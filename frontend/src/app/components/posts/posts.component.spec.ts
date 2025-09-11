import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { PostService } from '../../services/post.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import * as AuthSignal from '../../signals/auth.signal';
import { notificationSignal } from '../../signals/notification.signal';
import { postsSignal } from '../../signals/posts.signal';
import { Post } from '../../models/post.model';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postService: jasmine.SpyObj<PostService>;
  let translate: TranslateService;

  const mockPosts: Post[] = [
    { id: 1, title: 'Test Post 1', content: 'Content 1', authorUsername: 'user1', createdAt: '2023-01-02' },
    { id: 2, title: 'Test Post 2', content: 'Content 2', authorUsername: 'user2', createdAt: '2023-01-01' }
  ];

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostService', 
      ['getPosts', 'createPost', 'updatePost', 'deletePost']);

    await TestBed.configureTestingModule({
      imports: [PostsComponent, TranslateModule.forRoot(), BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        { provide: PostService, useValue: postServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    translate = TestBed.inject(TranslateService);
    
    // Mock default responses
    postService.getPosts.and.returnValue(of({ data: mockPosts }));
    
    // Set auth state
    AuthSignal.authState.set({ username: 'testuser', token: 'token123' });
    
    fixture.detectChanges();
  });

  afterEach(() => {
    AuthSignal.authState.set({ username: '', token: null });
    notificationSignal.set(null);
    postsSignal.set([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    expect(postService.getPosts).toHaveBeenCalled();
    expect(component.posts().length).toBe(2);
  });

  it('should sort posts by createdAt descending', () => {
    const posts = component.posts();
    expect(new Date(posts[0].createdAt).getTime()).toBeGreaterThan(new Date(posts[1].createdAt).getTime());
  });

  it('should sort posts by id descending when no createdAt', () => {
    const postsWithoutDate = [
      { id: 1, title: 'Post 1', content: 'Content', authorUsername: 'user1' },
      { id: 3, title: 'Post 3', content: 'Content', authorUsername: 'user2' }
    ] as Post[];
    
    postService.getPosts.and.returnValue(of({ data: postsWithoutDate }));
    component.loadPosts();
    
    const posts = component.posts();
    expect(posts[0].id).toBe(3);
    expect(posts[1].id).toBe(1);
  });

  it('should create post successfully', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Post created');
    
    const newPost: Post = { id: 3, title: 'New Post', content: 'New Content', authorUsername: 'testuser', createdAt: '2023-01-03' };
    postService.createPost.and.returnValue(of(newPost));
    
    component.title = 'New Post';
    component.content = 'New Content';
    component.createPost();
    
    expect(postService.createPost).toHaveBeenCalledWith({
      title: 'New Post',
      content: 'New Content',
      authorUsername: 'testuser'
    });
    expect(component.title).toBe('');
    expect(component.content).toBe('');
    expect(component.createdPostId).toBe(3);
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Post created' });
    
    // Test timeout behavior
    tick(1500);
    expect(component.createdPostId).toBeNull();
  }));

  it('should not create post with empty title or content', () => {
    component.title = '';
    component.content = 'Some content';
    component.createPost();
    
    expect(postService.createPost).not.toHaveBeenCalled();
    
    component.title = 'Some title';
    component.content = '';
    component.createPost();
    
    expect(postService.createPost).not.toHaveBeenCalled();
  });

  it('should handle create post error', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error creating post');
    postService.createPost.and.returnValue(throwError({ error: { message: 'Server error' } }));
    
    component.title = 'Test';
    component.content = 'Test content';
    component.createPost();
    
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Server error' });
    expect(component.loadingPost).toBeFalse();
  });

  it('should clear error notification after timeout when creating post fails', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error creating post');
    postService.createPost.and.returnValue(throwError({ error: { message: 'Server error' } }));
    
    component.title = 'Test';
    component.content = 'Test content';
    component.createPost();
    
    // Check that error notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Server error' });
    
    // Advance time by 2500ms to trigger setTimeout
    tick(2500);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should start edit mode', () => {
    const post = mockPosts[0];
    component.editPost(post);
    
    expect(component.editing).toBeTrue();
    expect(component.editId).toBe(1);
    expect(component.editTitle).toBe('Test Post 1');
    expect(component.editContent).toBe('Content 1');
  });

  it('should cancel edit mode', () => {
    component.editing = true;
    component.editId = 1;
    component.editTitle = 'Some title';
    component.editContent = 'Some content';
    
    component.cancelEdit();
    
    expect(component.editing).toBeFalse();
    expect(component.editId).toBeNull();
    expect(component.editTitle).toBe('');
    expect(component.editContent).toBe('');
  });

  it('should update post successfully', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Post updated');
    const updatedPost: Post = { id: 1, title: 'Updated Title', content: 'Updated Content', authorUsername: 'user1', createdAt: '2023-01-02' };
    postService.updatePost.and.returnValue(of(updatedPost));
    
    component.editId = 1;
    component.editTitle = 'Updated Title';
    component.editContent = 'Updated Content';
    component.updatePost();
    
    expect(postService.updatePost).toHaveBeenCalledWith(1, {
      title: 'Updated Title',
      content: 'Updated Content'
    });
    expect(component.editing).toBeFalse();
    expect(component.editId).toBeNull();
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Post updated' });
  });

  it('should not update if no edit id', () => {
    component.editId = null;
    component.updatePost();
    
    expect(postService.updatePost).not.toHaveBeenCalled();
  });

  it('should handle update post error', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error updating post');
    postService.updatePost.and.returnValue(throwError({ error: { message: 'Update failed' } }));
    
    component.editId = 1;
    component.updatePost();
    
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Update failed' });
  });

  it('should delete post successfully', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Post deleted');
    postService.deletePost.and.returnValue(of(undefined));
    
    component.posts.set([...mockPosts]);
    component.deletePost(1);
    
    expect(postService.deletePost).toHaveBeenCalledWith(1);
    expect(component.posts().length).toBe(1);
    expect(component.posts()[0].id).toBe(2);
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Post deleted' });
  });

  it('should handle delete post error', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error deleting post');
    postService.deletePost.and.returnValue(throwError({ error: { message: 'Delete failed' } }));
    
    component.deletePost(1);
    
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Delete failed' });
  });

  it('should return current username from auth state', () => {
    AuthSignal.authState.set({ username: 'currentuser', token: 'token' });
    expect(component.currentUsername).toBe('currentuser');
  });

  it('should return notification signal', () => {
    expect(component.notificationSignal).toBe(notificationSignal);
  });

  it('should track posts by id', () => {
    const post = mockPosts[0];
    expect(component.trackById(0, post)).toBe(1);
  });

  it('should set loading state during post creation', () => {
    const newPost: Post = { id: 3, title: 'New Post', content: 'New Content', authorUsername: 'testuser', createdAt: '2023-01-03' };
    postService.createPost.and.returnValue(of(newPost));
    
    component.title = 'Test';
    component.content = 'Test content';
    
    expect(component.loadingPost).toBeFalse();
    component.createPost();
    expect(component.loadingPost).toBeFalse(); // Set to false after success
  });

  it('should handle error messages from server or use default', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Default error');
    
    // Test with server error message
    postService.createPost.and.returnValue(throwError({ error: { message: 'Custom server error' } }));
    component.title = 'Test';
    component.content = 'Test';
    component.createPost();
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Custom server error' });
    
    // Test with no server error message
    postService.createPost.and.returnValue(throwError({ error: {} }));
    component.createPost();
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Default error' });
  });

  it('should clear notification after timeout on success', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    const newPost: Post = { id: 3, title: 'New Post', content: 'New Content', authorUsername: 'testuser', createdAt: '2023-01-03' };
    postService.createPost.and.returnValue(of(newPost));
    
    component.title = 'Test';
    component.content = 'Test';
    component.createPost();
    
    tick(1500);
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear success notification after timeout when creating post', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Post created');
    postService.createPost.and.returnValue(of({ id: 3, title: 'New Post', content: 'Content', authorUsername: 'testuser', createdAt: '2023-01-03' }));
    
    component.title = 'New Post';
    component.content = 'Content';
    component.createPost();
    
    // Check that success notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Post created' });
    
    // Advance time by 2500ms to trigger setTimeout
    tick(2500);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear success notification after timeout when updating post', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Post updated');
    postService.updatePost.and.returnValue(of({ id: 1, title: 'Updated', content: 'Updated content', authorUsername: 'testuser', createdAt: '2023-01-01' }));
    
    component.editId = 1;
    component.editTitle = 'Updated';
    component.editContent = 'Updated content';
    component.updatePost();
    
    // Check that success notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Post updated' });
    
    // Advance time by 2000ms to trigger setTimeout
    tick(2000);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear error notification after timeout when updating post fails', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error updating');
    postService.updatePost.and.returnValue(throwError({ error: { message: 'Update failed' } }));
    
    component.editId = 1;
    component.updatePost();
    
    // Check that error notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Update failed' });
    
    // Advance time by 2500ms to trigger setTimeout
    tick(2500);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear success notification after timeout when deleting post', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Post deleted');
    postService.deletePost.and.returnValue(of(undefined));
    
    component.posts.set([...mockPosts]);
    component.deletePost(1);
    
    // Check that success notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Post deleted' });
    
    // Advance time by 2000ms to trigger setTimeout
    tick(2000);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear error notification after timeout when deleting post fails', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error deleting');
    postService.deletePost.and.returnValue(throwError({ error: { message: 'Delete failed' } }));
    
    component.deletePost(1);
    
    // Check that error notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Delete failed' });
    
    // Advance time by 2500ms to trigger setTimeout
    tick(2500);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));
});
