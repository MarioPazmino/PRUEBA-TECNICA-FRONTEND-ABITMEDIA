import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { authState } from '../../signals/auth.signal';
import { notificationSignal } from '../../signals/notification.signal';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../header/header.component';
import { LanguageSelectorComponent } from '../../language-selector.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LanguageSelectorComponent, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() currentLang: string = 'es';
  @Output() langChange = new EventEmitter<string>();
  sidebarOpen = false;
  loading = false;

  private translate = inject(TranslateService);
  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    if (this.loading) return;
    this.loading = true;
    this.authService.logout().subscribe({
      next: () => {
        authState.set({ username: '', token: null });
        notificationSignal.set({ type: 'success', message: this.translate.instant('sidebar.logoutSuccess') });
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: () => {
        notificationSignal.set({ type: 'error', message: this.translate.instant('sidebar.logoutError') });
        this.loading = false;
      }
    });
  }

  onLangChange(lang: string) {
    this.langChange.emit(lang);
  }
}
