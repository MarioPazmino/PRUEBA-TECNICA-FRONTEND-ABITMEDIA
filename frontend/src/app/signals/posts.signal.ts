import { signal } from '@angular/core';
import { Post } from '../models/post.model';

export const postsSignal = signal<Post[]>([]);
