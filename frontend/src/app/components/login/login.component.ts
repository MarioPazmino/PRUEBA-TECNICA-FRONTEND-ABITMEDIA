import { Component, computed, effect, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, AuthResponse } from '../../models/auth.models';
import { authState } from '../../signals/auth.signal';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink]
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');

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
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Credenciales inválidas o error de conexión');
        this.loading.set(false);
      }
    });
  }
}
