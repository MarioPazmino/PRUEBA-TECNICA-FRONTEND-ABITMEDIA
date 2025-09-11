import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { authState } from '../../signals/auth.signal';
import { AuthService } from '../../services/auth.service';
import { notificationSignal } from '../../signals/notification.signal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  authState = authState;
  private translate = inject(TranslateService);
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        authState.set({ username: '', token: null });
        notificationSignal.set({ type: 'success', message: this.translate.instant('header.logoutSuccess') });
        this.router.navigate(['/login']);
      },
      error: () => {
        notificationSignal.set({ type: 'error', message: this.translate.instant('header.logoutError') });
      }
    });
  }
}
