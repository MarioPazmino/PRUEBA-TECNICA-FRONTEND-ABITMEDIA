import { Component, computed, effect, signal, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
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
  // Método público para validación en vivo de email
  public checkEmailExists() {
    this.emailInput$.next(this.username());
  }

  constructor() {
  }

  register() {
    // Validaciones previas
    if (!this.username().match(/^\S+@\S+\.\S+$/)) {
      this.error.set('El usuario debe ser un email válido.');
      setTimeout(() => this.error.set(''), 3000);
      return;
    }
    if (!this.password().match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)) {
      this.error.set('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
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
        this.success.set('Usuario registrado correctamente');
        this.loading.set(false);
        this.username.set('');
        this.password.set('');
      },
      error: (err: any) => {
        if (err.status === 409) {
          this.error.set('El usuario ya existe. Usa otro correo.');
        } else if (err.status === 401) {
          this.error.set('No tienes permisos para registrar usuarios.');
        } else if (err.status === 404) {
          this.error.set('El servicio de registro no está disponible.');
        } else {
          this.error.set('Error al registrar usuario');
        }
        this.loading.set(false);
      }
    });
  }
}
