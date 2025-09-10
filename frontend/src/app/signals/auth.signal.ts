import { signal } from '@angular/core';

export const authState = signal<{ username: string; token: string | null }>({ username: '', token: null });
