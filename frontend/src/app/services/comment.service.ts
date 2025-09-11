import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { authState } from '../signals/auth.signal';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private apiUrl = '/api/posts';
  comments = signal<Comment[]>([]);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = authState().token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getComments(postId: number): Observable<{ data: Comment[] }> {
    return this.http.get<{ data: Comment[] }>(`${this.apiUrl}/${postId}`, { headers: this.getAuthHeaders() });
  }

  createComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${postId}/comments`, { content }, { headers: this.getAuthHeaders() });
  }

  updateComment(postId: number, commentId: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${postId}/comments/${commentId}`, { content }, { headers: this.getAuthHeaders() });
  }

  deleteComment(postId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/comments/${commentId}`, { headers: this.getAuthHeaders() });
  }
}
