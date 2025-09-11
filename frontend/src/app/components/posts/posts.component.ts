import { Component, effect, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationComponent } from '../notification/notification.component';
import { CommentsComponent } from '../comments/comments.component';
import { notificationSignal } from '../../signals/notification.signal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PostService } from '../../services/post.service';
import { postsSignal } from '../../signals/posts.signal';
import { Post } from '../../models/post.model';
import { authState } from '../../signals/auth.signal';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent, CommentsComponent, TranslateModule],
  templateUrl: './posts.component.html',
  animations: [
    trigger('postAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-24px) scale(0.98)' }),
        animate('350ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('500ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.98)' }),
        animate('250ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateY(-20px) scale(0.98)' }))
      ])
    ])
  ]
})
export class PostsComponent {
  deletedPostId: number | null = null;
  get notificationSignal() {
    return notificationSignal;
  }
  get currentUsername() {
    return authState().username;
  }
  private postService = inject(PostService);
  private translate = inject(TranslateService);
  posts = postsSignal;
  title = '';
  content = '';
  editing = false;
  editId: number | null = null;
  editTitle = '';
  editContent = '';
  loadingPost = false;
  createdPostId: number | null = null; // Agregado para identificar el post recién creado

  constructor() {
    effect(() => {
      this.loadPosts();
    });
  }

  loadPosts() {
    this.postService.getPosts().subscribe(response => {
      // Si el backend no envía createdAt, ordena por id descendente (nuevos arriba)
      const sorted = [...response.data].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return b.id - a.id;
      });
      this.posts.set(sorted);
    });
  }

  createPost() {
    if (!this.title || !this.content) return;
    this.loadingPost = true;
    this.postService.createPost({ title: this.title, content: this.content, authorUsername: authState().username }).subscribe({
      next: post => {
        this.title = '';
        this.content = '';
        this.createdPostId = post.id;
        this.posts.set([post, ...this.posts()]);
  notificationSignal.set({ type: 'success', message: this.translate.instant('posts.created') });
        setTimeout(() => {
          this.createdPostId = null;
          this.loadPosts();
          notificationSignal.set(null);
        }, 1500);
        this.loadingPost = false;
      },
      error: (err) => {
  let msg = this.translate.instant('posts.errorCreate');
  if (err?.error?.message) msg = err.error.message;
  notificationSignal.set({ type: 'error', message: msg });
        setTimeout(() => notificationSignal.set(null), 2500);
        this.loadingPost = false;
      }
    });
  }

  editPost(post: Post) {
    this.editing = true;
    this.editId = post.id;
    this.editTitle = post.title;
    this.editContent = post.content;
  }

  updatePost() {
    if (this.editId == null) return;
    this.postService.updatePost(this.editId, { title: this.editTitle, content: this.editContent }).subscribe({
      next: updated => {
  notificationSignal.set({ type: 'success', message: this.translate.instant('posts.edited') });
        this.cancelEdit();
        this.loadPosts();
        setTimeout(() => notificationSignal.set(null), 2000);
      },
      error: err => {
  let msg = this.translate.instant('posts.errorEdit');
  if (err?.error?.message) msg = err.error.message;
  notificationSignal.set({ type: 'error', message: msg });
        setTimeout(() => notificationSignal.set(null), 2500);
      }
    });
  }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe({
      next: () => {
        this.posts.set(this.posts().filter(p => p.id !== id));
  notificationSignal.set({ type: 'success', message: this.translate.instant('posts.deleted') });
        setTimeout(() => notificationSignal.set(null), 2000);
      },
      error: (err) => {
  let msg = this.translate.instant('posts.errorDelete');
  if (err?.error?.message) msg = err.error.message;
  notificationSignal.set({ type: 'error', message: msg });
        setTimeout(() => notificationSignal.set(null), 2500);
      }
    });
  }

  cancelEdit() {
    this.editing = false;
    this.editId = null;
    this.editTitle = '';
    this.editContent = '';
  }

  trackById(index: number, post: Post) {
    return post.id;
  }
}
