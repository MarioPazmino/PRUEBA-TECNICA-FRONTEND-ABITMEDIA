import { Component, computed, effect, signal, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  constructor() {
    // Effect signal para mostrar errores
    effect(() => {
      if (this.error()) {
        setTimeout(() => this.error.set(''), 3000);
      }
      if (this.success()) {
        setTimeout(() => this.success.set(''), 3000);
      }
    });
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
        this.success.set('¡Inicio de sesión exitoso!');
        this.loading.set(false);
      },
      error: (err) => {
        this.success.set('');
        if (err.status === 401) {
          this.error.set('Usuario o contraseña incorrectos.');
        } else if (err.status === 403) {
          this.error.set('No tienes permisos para acceder.');
        } else if (err.status === 404) {
          this.error.set('Servicio de autenticación no disponible.');
        } else if (err.status === 409) {
          this.error.set('Conflicto de credenciales.');
        } else {
          this.error.set('Error de conexión o credenciales inválidas.');
        }
        this.loading.set(false);
      }
    });
  }
}
