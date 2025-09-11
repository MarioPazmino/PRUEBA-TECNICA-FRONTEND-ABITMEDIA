import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { Comment } from '../models/comment.model';
import * as AuthSignal from '../signals/auth.signal';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  const mockComment: Comment = {
    id: 1,
    content: 'Test comment',
    authorUsername: 'testuser',
    postId: 1,
    createdAt: '2023-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Set auth token for all tests
    AuthSignal.authState.set({ username: 'testuser', token: 'test-token' });
  });

  afterEach(() => {
    httpMock.verify();
    AuthSignal.authState.set({ username: '', token: null });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial empty comments signal', () => {
    expect(service.comments()).toEqual([]);
  });

  it('should get comments for a post', () => {
    const postId = 1;
    const mockResponse = { data: [mockComment] };

    service.getComments(postId).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.data.length).toBe(1);
      expect(response.data[0]).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockResponse);
  });

  it('should create a comment', () => {
    const postId = 1;
    const content = 'New comment content';

    service.createComment(postId, content).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`/api/posts/${postId}/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content });
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockComment);
  });

  it('should update a comment', () => {
    const postId = 1;
    const commentId = 1;
    const content = 'Updated comment content';
    const updatedComment = { ...mockComment, content };

    service.updateComment(postId, commentId, content).subscribe(comment => {
      expect(comment).toEqual(updatedComment);
    });

    const req = httpMock.expectOne(`/api/posts/${postId}/comments/${commentId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ content });
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(updatedComment);
  });

  it('should delete a comment', () => {
    const postId = 1;
    const commentId = 1;

    service.deleteComment(postId, commentId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`/api/posts/${postId}/comments/${commentId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(null);
  });

  it('should include auth headers in all requests', () => {
    const postId = 1;
    const commentId = 1;
    const content = 'Test content';

    // Test getComments
    service.getComments(postId).subscribe();
    let req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({ data: [] });

    // Test createComment
    service.createComment(postId, content).subscribe();
    req = httpMock.expectOne(`/api/posts/${postId}/comments`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockComment);

    // Test updateComment
    service.updateComment(postId, commentId, content).subscribe();
    req = httpMock.expectOne(`/api/posts/${postId}/comments/${commentId}`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockComment);

    // Test deleteComment
    service.deleteComment(postId, commentId).subscribe();
    req = httpMock.expectOne(`/api/posts/${postId}/comments/${commentId}`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(null);
  });

  it('should handle different auth token values', () => {
    AuthSignal.authState.set({ username: 'testuser', token: 'different-token' });
    
    service.getComments(1).subscribe();
    
    const req = httpMock.expectOne('/api/posts/1');
    expect(req.request.headers.get('Authorization')).toBe('Bearer different-token');
    req.flush({ data: [] });
  });

  it('should handle null token', () => {
    AuthSignal.authState.set({ username: 'testuser', token: null });
    
    service.getComments(1).subscribe();
    
    const req = httpMock.expectOne('/api/posts/1');
    expect(req.request.headers.get('Authorization')).toBe('Bearer null');
    req.flush({ data: [] });
  });

  it('should use correct API endpoints', () => {
    const postId = 123;
    const commentId = 456;

    service.getComments(postId).subscribe();
    httpMock.expectOne(`/api/posts/${postId}`).flush({ data: [] });

    service.createComment(postId, 'content').subscribe();
    httpMock.expectOne(`/api/posts/${postId}/comments`).flush(mockComment);

    service.updateComment(postId, commentId, 'content').subscribe();
    httpMock.expectOne(`/api/posts/${postId}/comments/${commentId}`).flush(mockComment);

    service.deleteComment(postId, commentId).subscribe();
    httpMock.expectOne(`/api/posts/${postId}/comments/${commentId}`).flush(null);
  });
});
