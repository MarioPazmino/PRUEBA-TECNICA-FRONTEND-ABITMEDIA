import { signal } from '@angular/core';

export const notificationSignal = signal<{ type: 'success' | 'error'; message: string } | null>(null);
