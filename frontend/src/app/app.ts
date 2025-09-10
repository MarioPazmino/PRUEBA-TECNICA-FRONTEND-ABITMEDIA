import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './language-selector.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('temp-frontend');
  currentLang = 'es';

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || translate.getDefaultLang() || 'es';
  }

  onLangChange(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
