import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Observable } from 'rxjs';
import { authState } from '../signals/auth.signal';

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = '/api/posts';
  posts = signal<Post[]>([]);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = authState().token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getPosts(): Observable<{ data: Post[] }> {
    return this.http.get<{ data: Post[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post, { headers: this.getAuthHeaders() });
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post, { headers: this.getAuthHeaders() });
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
