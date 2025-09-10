import { Component, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { postsSignal } from '../../signals/posts.signal';
import { Post } from '../../models/post.model';
import { authState } from '../../signals/auth.signal';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html'
})
export class PostsComponent {
  private postService = inject(PostService);
  posts = postsSignal;
  title = '';
  content = '';
  editing = false;
  editId: number | null = null;
  editTitle = '';
  editContent = '';
  loadingPost = false;

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
        this.loadPosts();
        this.loadingPost = false;
      },
      error: () => {
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
