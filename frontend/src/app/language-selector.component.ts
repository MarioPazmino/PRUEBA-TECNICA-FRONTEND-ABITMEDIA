import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select
      class="appearance-none bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 text-xs px-2 py-1 rounded-xl shadow-sm focus:outline-none border border-gray-700 hover:border-gray-500 transition-colors duration-150"
      [value]="currentLang"
      (change)="changeLang($any($event.target).value)"
      style="min-width: 48px; border-radius: 0.75rem;"
    >
      <option value="es" class="bg-gray-900 text-gray-200 rounded-xl">ES</option>
      <option value="en" class="bg-gray-900 text-gray-200 rounded-xl">EN</option>
    </select>
  `,
})
export class LanguageSelectorComponent {
  @Input() currentLang: string = 'es';
  @Output() langChange = new EventEmitter<string>();

  changeLang(lang: string) {
    this.langChange.emit(lang);
  }
}
