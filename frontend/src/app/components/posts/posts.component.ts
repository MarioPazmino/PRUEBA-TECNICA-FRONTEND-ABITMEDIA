import { Component, effect, signal, inject } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { notificationSignal } from '../../signals/notification.signal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { postsSignal } from '../../signals/posts.signal';
import { Post } from '../../models/post.model';
import { authState } from '../../signals/auth.signal';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './posts.component.html'
})
export class PostsComponent {
  get notificationSignal() {
    return notificationSignal;
  }
  private postService = inject(PostService);
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
    const tempId = Date.now();
    const placeholder: Post = {
      id: tempId,
      title: '',
      content: '',
      authorUsername: '',
      createdAt: '',
    };
    this.createdPostId = tempId;
    this.posts.set([placeholder, ...this.posts()]);
    this.postService.createPost({ title: this.title, content: this.content, authorUsername: authState().username }).subscribe({
      next: post => {
        this.title = '';
        this.content = '';
        this.createdPostId = post.id;
        this.posts.set([post, ...this.posts().filter(p => p.id !== tempId)]);
        notificationSignal.set({ type: 'success', message: '¡Post creado exitosamente!' });
        setTimeout(() => {
          this.createdPostId = null;
          this.loadPosts();
          notificationSignal.set(null);
        }, 1500);
        this.loadingPost = false;
      },
      error: (err) => {
        this.posts.set(this.posts().filter(p => p.id !== tempId));
        let msg = 'Error al crear el post.';
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
    this.postService.updatePost(this.editId, { title: this.editTitle, content: this.editContent }).subscribe(updated => {
      this.posts.set(this.posts().map(p => p.id === updated.id ? updated : p));
      this.cancelEdit();
    });
  }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe(() => {
      this.posts.set(this.posts().filter(p => p.id !== id));
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
