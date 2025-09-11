import { Component, Input, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommentService } from '../../services/comment.service';
import { commentsSignal } from '../../signals/comments.signal';
import { Comment } from '../../models/comment.model';
import { authState } from '../../signals/auth.signal';
import { notificationSignal } from '../../signals/notification.signal';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './comments.component.html',
  animations: [
    trigger('commentAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.96)' }),
        animate('600ms cubic-bezier(0.22, 1, 0.36, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('400ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateX(40px) scale(0.95)' }))
      ])
    ])
  ]
})
export class CommentsComponent {
  orderDesc = true;
  @Input() postId!: number;
  comments = signal<Comment[]>([]);
  newComment = '';
  editingId: number | null = null;
  editContent = '';
  // Cancela la edición
  cancelEdit() {
    this.editingId = null;
    this.editContent = '';
  }
  private commentService = inject(CommentService);
  private translate = inject(TranslateService);
  trackById(index: number, comment: Comment) {
    return comment.id;
  }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments(this.postId).subscribe(res => {
      let arr: Comment[] = [];
      if (Array.isArray(res.data)) {
        arr = res.data;
      } else if (res.data && typeof res.data === 'object' && 'comments' in res.data && Array.isArray((res.data as any).comments)) {
        arr = (res.data as any).comments;
      }
      arr = arr.sort((a, b) => this.orderDesc ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      this.comments.set(arr);
    });
  }

  toggleOrder() {
    this.orderDesc = !this.orderDesc;
    this.comments.set([...this.comments()].sort((a, b) => this.orderDesc ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentService.createComment(this.postId, this.newComment).subscribe({
      next: () => {
  notificationSignal.set({ type: 'success', message: this.translate.instant('comments.created') });
        this.newComment = '';
        this.loadComments();
        setTimeout(() => notificationSignal.set(null), 2000);
      },
      error: err => {
  let msg = this.translate.instant('comments.errorAdd');
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
    this.commentService.updateComment(this.postId, this.editingId, this.editContent).subscribe({
      next: () => {
        this.loadComments();
        this.editingId = null;
        this.editContent = '';
  notificationSignal.set({ type: 'success', message: this.translate.instant('comments.edited') });
        setTimeout(() => notificationSignal.set(null), 2000);
      },
      error: err => {
  let msg = this.translate.instant('comments.errorEdit');
  if (err?.error?.message) msg = err.error.message;
  notificationSignal.set({ type: 'error', message: msg });
        setTimeout(() => notificationSignal.set(null), 2500);
      }
    });
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(this.postId, id).subscribe({
      next: () => {
        this.comments.set(this.comments().filter(c => c.id !== id));
  notificationSignal.set({ type: 'success', message: this.translate.instant('comments.deleted') });
        setTimeout(() => notificationSignal.set(null), 2000);
      },
      error: err => {
  let msg = this.translate.instant('comments.errorDelete');
  if (err?.error?.message) msg = err.error.message;
  notificationSignal.set({ type: 'error', message: msg });
        setTimeout(() => notificationSignal.set(null), 2500);
      }
    });
  }

  isOwner(comment: Comment) {
    return comment.authorUsername === authState().username;
  }
}
