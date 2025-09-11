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
  template: `
    <div class="w-full flex items-center justify-center gap-2">
      <div *ngIf="authState().username" class="flex items-center bg-blue-950/80 dark:bg-gray-900/90 rounded-xl px-4 py-2 shadow-lg border border-blue-800 dark:border-gray-700 w-full justify-between">
        <span class="text-blue-400 font-semibold text-sm">{{ authState().username }}</span>
  <button (click)="logout()" class="hidden md:flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 transition ml-4 md:ml-6" style="position:relative; right:-8px;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mx-auto">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>
    </div>
  `
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
