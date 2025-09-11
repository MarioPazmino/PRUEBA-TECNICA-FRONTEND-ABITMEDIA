import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { authState } from '../../signals/auth.signal';
import { notificationSignal } from '../../signals/notification.signal';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { LanguageSelectorComponent } from '../../language-selector.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LanguageSelectorComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() currentLang: string = 'es';
  @Output() langChange = new EventEmitter<string>();
  sidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

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

  onLangChange(lang: string) {
    this.langChange.emit(lang);
  }
}
