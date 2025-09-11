import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { authState } from '../../signals/auth.signal';
import { AuthService } from '../../services/auth.service';
import { notificationSignal } from '../../signals/notification.signal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  authState = authState;
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        authState.set({ username: '', token: null });
        notificationSignal.set({ type: 'success', message: 'Sesión cerrada correctamente.' });
        this.router.navigate(['/login']);
      },
      error: () => {
        notificationSignal.set({ type: 'error', message: 'Error al cerrar sesión.' });
      }
    });
  }
}
