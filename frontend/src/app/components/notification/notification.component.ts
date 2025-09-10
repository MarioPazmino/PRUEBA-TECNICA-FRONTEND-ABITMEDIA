import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message()" [ngClass]="type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'" class="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg animate-fade-in transition-all duration-500 flex items-center gap-2">
      <ng-container *ngIf="type === 'error'">
        <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </ng-container>
      <ng-container *ngIf="type === 'success'">
        <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
      </ng-container>
      <span class="font-medium">{{ message() }}</span>
    </div>
  `,
    styles: [`
      .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1); }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    `]
})
export class NotificationComponent {
  @Input() type: 'error' | 'success' = 'success';
  @Input() set msg(val: string) { this.message.set(val); }
  message = signal('');
}
