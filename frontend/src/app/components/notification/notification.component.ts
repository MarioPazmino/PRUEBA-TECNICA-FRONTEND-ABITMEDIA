import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styles: [
    `.animate-fade-in { animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1); }`,
    `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`
  ]
})
export class NotificationComponent {
  @Input() type: 'error' | 'success' = 'success';
  @Input() set msg(val: string) { this.message.set(val); }
  message = signal('');
}
