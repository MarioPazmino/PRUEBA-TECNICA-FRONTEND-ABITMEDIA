import { Component, effect, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { postsSignal } from '../../signals/posts.signal';
import { Post } from '../../models/post.model';

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

  constructor() {
    effect(() => {
      this.loadPosts();
    });
  }

  loadPosts() {
    this.postService.getPosts().subscribe(response => {
      this.posts.set(response.data);
    });
  }

  createPost() {
    if (!this.title || !this.content) return;
    this.postService.createPost({ title: this.title, content: this.content, authorUsername: 'Usuario' }).subscribe(post => {
      this.posts.set([post, ...this.posts()]);
      this.title = '';
      this.content = '';
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
}
