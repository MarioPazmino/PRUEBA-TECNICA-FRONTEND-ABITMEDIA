import { Component, computed, effect, signal, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.models';
import { HttpClient } from '@angular/common/http';
import { NotificationComponent } from '../notification/notification.component';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, TranslateModule, NotificationComponent]
})
export class RegisterComponent {
  private translate = inject(TranslateService);
  username = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');
  success = signal('');
  showPassword = false;
  canRegister = computed(() =>
    this.username().length > 0 && this.password().length > 7 && !this.loading()
  );
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  public emailInput$ = new Subject<string>();

  constructor() {
      effect(() => {
        if (this.error()) {
          setTimeout(() => this.error.set(''), 3000);
        }
        if (this.success()) {
          setTimeout(() => this.success.set(''), 3000);
        }
      });
    }

  register() {
    // Validaciones previas
    if (!this.username().match(/^\S+@\S+\.\S+$/)) {
      this.error.set(this.translate.instant('register.invalidEmail'));
      setTimeout(() => this.error.set(''), 3000);
      return;
    }
    if (!this.password().match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)) {
      this.error.set(this.translate.instant('register.invalidPassword'));
      setTimeout(() => this.error.set(''), 3000);
      return;
    }
    this.loading.set(true);
    const data: RegisterRequest = {
      username: this.username(),
      password: this.password()
    };
    this.authService.register(data).subscribe({
      next: (res: any) => {
        this.success.set(this.translate.instant('register.success'));
        this.loading.set(false);
        this.username.set('');
        this.password.set('');
      },
      error: (err: any) => {
        let errorMsg = '';
        if (err.status === 409) {
          errorMsg = this.translate.instant('register.userExists');
        } else if (err.status === 401) {
          errorMsg = this.translate.instant('register.forbidden');
        } else if (err.status === 404) {
          errorMsg = this.translate.instant('register.serviceUnavailable');
        } else {
          errorMsg = this.translate.instant('register.error');
        }
        this.error.set(errorMsg);
        this.loading.set(false);
      }
    });
  }
}
