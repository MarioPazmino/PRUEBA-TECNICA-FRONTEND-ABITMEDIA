import { Component, signal, HostListener, effect } from '@angular/core';
import { authState } from './signals/auth.signal';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterOutlet, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './language-selector.component';
import { notificationSignal } from './signals/notification.signal';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, LanguageSelectorComponent, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('temp-frontend');
  currentLang = 'es';
  isMobile = window.innerWidth < 768;
  get isLoggedIn() {
    return !!authState().token;
  }

  constructor(private translate: TranslateService, private router: Router) {
    this.currentLang = translate.currentLang || translate.getDefaultLang() || 'es';
    // Limpiar notificación al cambiar de ruta
    effect(() => {
      this.router.events.subscribe(() => {
        notificationSignal.set(null);
      });
    });
    // Limpiar notificación al cambiar de usuario
    effect(() => {
      authState();
      notificationSignal.set(null);
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  onLangChange(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
