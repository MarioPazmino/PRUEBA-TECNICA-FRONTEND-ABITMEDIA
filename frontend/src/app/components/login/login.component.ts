import { Component, computed, effect, signal, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, AuthResponse } from '../../models/auth.models';
import { authState } from '../../signals/auth.signal';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, TranslateModule, NotificationComponent]
})
export class LoginComponent {
  showPassword = false;
  username = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');
  success = signal('');

  // Computed signal para habilitar el botón
  canLogin = computed(() =>
    this.username().length > 0 && this.password().length > 0 && !this.loading()
  );


  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private router = inject(Router) as Router;

  constructor() {
    // Effect signal para mostrar errores
    effect(() => {
      if (this.error()) {
        setTimeout(() => this.error.set(''), 3000);
      }
      if (this.success()) {
        this.autoClearSuccess();
      }
    });
  // ...existing code...
  }

/**
 * Auto-clear success message after 5 seconds
 */
autoClearSuccess() {
  setTimeout(() => this.success.set(''), 5000);
}

  login() {
    this.loading.set(true);
    const data: LoginRequest = {
      username: this.username(),
      password: this.password()
    };
    this.authService.login(data).subscribe({
      next: (res: AuthResponse) => {
        authState.set({ username: res.data.username, token: res.data.token });
        this.error.set('');
        this.success.set(this.translate.instant('login.success'));
        this.loading.set(false);
    this.router.navigate(['/posts']);
      },
      error: (err) => {
        this.success.set('');
        let errorMsg = '';
        if (err.status === 401) {
          errorMsg = this.translate.instant('login.error');
        } else if (err.status === 403) {
          errorMsg = this.translate.instant('login.forbidden');
        } else if (err.status === 404) {
          errorMsg = this.translate.instant('login.serviceUnavailable');
        } else if (err.status === 409) {
          errorMsg = this.translate.instant('login.conflict');
        } else {
          errorMsg = this.translate.instant('login.error');
        }
        this.error.set(errorMsg);
        this.loading.set(false);
      }
    });
  }
}
