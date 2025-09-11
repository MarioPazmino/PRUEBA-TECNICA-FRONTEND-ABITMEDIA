import { Component, Input, signal, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { commentsSignal } from '../../signals/comments.signal';
import { Comment } from '../../models/comment.model';
import { authState } from '../../signals/auth.signal';
import { notificationSignal } from '../../signals/notification.signal';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  animations: [
    trigger('commentAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.96)' }),
        animate('600ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ])
  ]
})
export class CommentsComponent {
  @Input() postId!: number;
  comments = signal<Comment[]>([]);
  newComment = '';
  editingId: number | null = null;
  editContent = '';
  private commentService = inject(CommentService);
  trackById(index: number, comment: Comment) {
    return comment.id;
  }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments(this.postId).subscribe(res => {
      if (Array.isArray(res.data)) {
        this.comments.set(res.data);
      } else if (res.data && typeof res.data === 'object' && 'comments' in res.data && Array.isArray((res.data as any).comments)) {
        this.comments.set((res.data as any).comments);
      } else {
        this.comments.set([]);
      }
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentService.createComment(this.postId, this.newComment).subscribe({
      next: () => {
        notificationSignal.set({ type: 'success', message: '¡Comentario agregado exitosamente!' });
        this.newComment = '';
        this.loadComments();
        setTimeout(() => notificationSignal.set(null), 2000);
      },
      error: err => {
        let msg = 'Error al agregar el comentario.';
        if (err?.error?.message) msg = err.error.message;
        notificationSignal.set({ type: 'error', message: msg });
        setTimeout(() => notificationSignal.set(null), 2500);
      }
    });
  }

  startEdit(comment: Comment) {
    this.editingId = comment.id;
    this.editContent = comment.content;
  }

  updateComment() {
    if (this.editingId == null) return;
    this.commentService.updateComment(this.postId, this.editingId, this.editContent).subscribe(updated => {
      this.comments.set(this.comments().map(c => c.id === updated.id ? updated : c));
      this.editingId = null;
      this.editContent = '';
    });
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(this.postId, id).subscribe(() => {
      this.comments.set(this.comments().filter(c => c.id !== id));
    });
  }

  isOwner(comment: Comment) {
    return comment.authorUsername === authState().username;
  }
}
