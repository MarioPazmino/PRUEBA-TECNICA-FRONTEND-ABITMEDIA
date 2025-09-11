import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../models/post.model';
import * as AuthSignal from '../signals/auth.signal';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test content',
    authorUsername: 'testuser',
    createdAt: '2023-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
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

  it('should have initial empty posts signal', () => {
    expect(service.posts()).toEqual([]);
  });

  it('should get all posts', () => {
    const mockResponse = { data: [mockPost] };

    service.getPosts().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.data.length).toBe(1);
      expect(response.data[0]).toEqual(mockPost);
    });

    const req = httpMock.expectOne('/api/posts');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockResponse);
  });

  it('should get a single post', () => {
    const postId = 1;

    service.getPost(postId).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockPost);
  });

  it('should create a post', () => {
    const newPost: Partial<Post> = {
      title: 'New Post',
      content: 'New content',
      authorUsername: 'testuser'
    };

    service.createPost(newPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne('/api/posts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockPost);
  });

  it('should update a post', () => {
    const postId = 1;
    const updateData: Partial<Post> = {
      title: 'Updated Title',
      content: 'Updated content'
    };
    const updatedPost = { ...mockPost, ...updateData };

    service.updatePost(postId, updateData).subscribe(post => {
      expect(post).toEqual(updatedPost);
    });

    const req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(updatedPost);
  });

  it('should delete a post', () => {
    const postId = 1;

    service.deletePost(postId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(null);
  });

  it('should include auth headers in all requests', () => {
    const postId = 1;
    const postData: Partial<Post> = { title: 'Test', content: 'Test' };

    // Test getPosts
    service.getPosts().subscribe();
    let req = httpMock.expectOne('/api/posts');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({ data: [] });

    // Test getPost
    service.getPost(postId).subscribe();
    req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockPost);

    // Test createPost
    service.createPost(postData).subscribe();
    req = httpMock.expectOne('/api/posts');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockPost);

    // Test updatePost
    service.updatePost(postId, postData).subscribe();
    req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockPost);

    // Test deletePost
    service.deletePost(postId).subscribe();
    req = httpMock.expectOne(`/api/posts/${postId}`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(null);
  });

  it('should handle different auth token values', () => {
    AuthSignal.authState.set({ username: 'testuser', token: 'different-token' });
    
    service.getPosts().subscribe();
    
    const req = httpMock.expectOne('/api/posts');
    expect(req.request.headers.get('Authorization')).toBe('Bearer different-token');
    req.flush({ data: [] });
  });

  it('should handle null token', () => {
    AuthSignal.authState.set({ username: 'testuser', token: null });
    
    service.getPosts().subscribe();
    
    const req = httpMock.expectOne('/api/posts');
    expect(req.request.headers.get('Authorization')).toBe('Bearer null');
    req.flush({ data: [] });
  });

  it('should use correct API endpoints', () => {
    const postId = 123;
    const postData: Partial<Post> = { title: 'Test', content: 'Content' };

    service.getPosts().subscribe();
    httpMock.expectOne('/api/posts').flush({ data: [] });

    service.getPost(postId).subscribe();
    httpMock.expectOne(`/api/posts/${postId}`).flush(mockPost);

    service.createPost(postData).subscribe();
    httpMock.expectOne('/api/posts').flush(mockPost);

    service.updatePost(postId, postData).subscribe();
    httpMock.expectOne(`/api/posts/${postId}`).flush(mockPost);

    service.deletePost(postId).subscribe();
    httpMock.expectOne(`/api/posts/${postId}`).flush(null);
  });

  it('should handle partial post data in create and update', () => {
    // Test create with minimal data
    const minimalPost: Partial<Post> = { title: 'Title only' };
    service.createPost(minimalPost).subscribe();
    let req = httpMock.expectOne('/api/posts');
    expect(req.request.body).toEqual(minimalPost);
    req.flush(mockPost);

    // Test update with partial data
    const partialUpdate: Partial<Post> = { content: 'New content only' };
    service.updatePost(1, partialUpdate).subscribe();
    req = httpMock.expectOne('/api/posts/1');
    expect(req.request.body).toEqual(partialUpdate);
    req.flush(mockPost);
  });

  it('should properly handle posts signal', () => {
    // Initially empty
    expect(service.posts()).toEqual([]);
    
    // Can be set
    service.posts.set([mockPost]);
    expect(service.posts()).toEqual([mockPost]);
    
    // Can be updated
    const secondPost = { ...mockPost, id: 2, title: 'Second Post' };
    service.posts.set([mockPost, secondPost]);
    expect(service.posts().length).toBe(2);
  });
});
