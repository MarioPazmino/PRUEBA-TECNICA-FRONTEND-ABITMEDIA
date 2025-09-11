import { signal } from '@angular/core';
import { Comment } from '../models/comment.model';

export const commentsSignal = signal<Comment[]>([]);
