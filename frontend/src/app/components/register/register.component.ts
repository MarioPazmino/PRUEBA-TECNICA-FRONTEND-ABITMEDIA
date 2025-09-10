import { Component, computed, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class RegisterComponent {
  username = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');
  success = signal('');

  // Computed signal para habilitar el botón
  canRegister = computed(() =>
    this.username().length > 0 && this.password().length > 7 && !this.loading()
  );


  private authService = inject(AuthService);

  constructor() {
    // Effect signal para mostrar mensajes
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
      error: (err) => {
        this.error.set('Error al registrar usuario');
        this.loading.set(false);
      }
    });
  }
}
