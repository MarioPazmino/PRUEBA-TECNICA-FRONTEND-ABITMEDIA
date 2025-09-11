import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { CommentService } from '../../services/comment.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import * as AuthSignal from '../../signals/auth.signal';
import { notificationSignal } from '../../signals/notification.signal';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let commentService: jasmine.SpyObj<CommentService>;
  let translate: TranslateService;

  const mockComments = [
    { id: 1, content: 'Test comment 1', authorUsername: 'user1', postId: 1, createdAt: '2023-01-01' },
    { id: 2, content: 'Test comment 2', authorUsername: 'user2', postId: 1, createdAt: '2023-01-02' }
  ];

  beforeEach(async () => {
    const commentServiceSpy = jasmine.createSpyObj('CommentService', 
      ['getComments', 'createComment', 'updateComment', 'deleteComment']);

    await TestBed.configureTestingModule({
      imports: [CommentsComponent, TranslateModule.forRoot(), BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        { provide: CommentService, useValue: commentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    commentService = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    translate = TestBed.inject(TranslateService);
    
    // Reset signals to clean state
    AuthSignal.authState.set({ username: '', token: null });
    notificationSignal.set(null);
    
    component.postId = 1;
    
    // Mock default responses
    commentService.getComments.and.returnValue(of({ data: mockComments }));
    
    fixture.detectChanges();
  });

  afterEach(() => {
    AuthSignal.authState.set({ username: '', token: null });
    notificationSignal.set(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load comments on init', () => {
    expect(commentService.getComments).toHaveBeenCalledWith(1);
    expect(component.comments().length).toBe(2);
  });

  it('should handle array data response', () => {
    commentService.getComments.and.returnValue(of({ data: mockComments }));
    component.loadComments();
    expect(component.comments().length).toBe(2);
  });

  it('should handle nested comments object response', () => {
    const nestedResponse = { data: { comments: mockComments } as any };
    commentService.getComments.and.returnValue(of(nestedResponse as any));
    component.loadComments();
    expect(component.comments().length).toBe(2);
  });

  it('should toggle order desc/asc', () => {
    component.orderDesc = true;
    component.toggleOrder();
    expect(component.orderDesc).toBeFalse();
    
    component.toggleOrder();
    expect(component.orderDesc).toBeTrue();
  });

  it('should sort comments by date descending', () => {
    // Set to false first, so toggleOrder will make it true (descending)
    component.orderDesc = false;
    component.comments.set([...mockComments]);
    component.toggleOrder(); // This will change orderDesc to true and sort descending
    
    const sorted = component.comments();
    // In descending order, more recent date (2023-01-02) should come first
    expect(new Date(sorted[0].createdAt).getTime()).toBeGreaterThan(new Date(sorted[1].createdAt).getTime());
    expect(component.orderDesc).toBeTrue();
  });

  it('should sort comments by date ascending', () => {
    // Set to true first, so toggleOrder will make it false (ascending)
    component.orderDesc = true;
    component.comments.set([...mockComments]);
    component.toggleOrder(); // This will change orderDesc to false and sort ascending
    
    const sorted = component.comments();
    // In ascending order, older date (2023-01-01) should come first
    expect(new Date(sorted[0].createdAt).getTime()).toBeLessThan(new Date(sorted[1].createdAt).getTime());
    expect(component.orderDesc).toBeFalse();
  });

  it('should add comment successfully', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Comment created');
    commentService.createComment.and.returnValue(of({ id: 3, content: 'New test comment', authorUsername: 'user1', postId: 1, createdAt: '2023-01-03' }));
    
    component.newComment = 'New test comment';
    component.addComment();
    
    expect(commentService.createComment).toHaveBeenCalledWith(1, 'New test comment');
    expect(component.newComment).toBe('');
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Comment created' });
  });

  it('should not add empty comment', () => {
    component.newComment = '   ';
    component.addComment();
    
    expect(commentService.createComment).not.toHaveBeenCalled();
  });

  it('should handle add comment error', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error adding comment');
    commentService.createComment.and.returnValue(throwError({ error: { message: 'Server error' } }));
    
    component.newComment = 'Test comment';
    component.addComment();
    
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Server error' });
  });

  it('should clear success notification after timeout when adding comment', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Comment created');
    commentService.createComment.and.returnValue(of({ id: 3, content: 'New test comment', authorUsername: 'user1', postId: 1, createdAt: '2023-01-03' }));
    
    component.newComment = 'New test comment';
    component.addComment();
    
    // Check that success notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Comment created' });
    
    // Advance time by 2000ms to trigger setTimeout
    tick(2000);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear error notification after timeout when adding comment fails', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error adding comment');
    commentService.createComment.and.returnValue(throwError({ error: { message: 'Server error' } }));
    
    component.newComment = 'Test comment';
    component.addComment();
    
    // Check that error notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Server error' });
    
    // Advance time by 2500ms to trigger setTimeout
    tick(2500);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should start edit mode', () => {
    // Reset component state and set known comments
    component.comments.set([...mockComments]);
    
    // Use a specific comment we know exists
    const targetComment = mockComments.find(c => c.id === 1); // Get comment with id: 1
    expect(targetComment).toBeDefined(); // Make sure it exists
    
    component.startEdit(targetComment!);
    
    expect(component.editingId).toBe(1);
    expect(component.editContent).toBe('Test comment 1');
  });

  it('should cancel edit mode', () => {
    component.editingId = 1;
    component.editContent = 'Some content';
    
    component.cancelEdit();
    
    expect(component.editingId).toBeNull();
    expect(component.editContent).toBe('');
  });

  it('should update comment successfully', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Comment updated');
    commentService.updateComment.and.returnValue(of({ id: 1, content: 'Updated content', authorUsername: 'user1', postId: 1, createdAt: '2023-01-01' }));
    
    component.editingId = 1;
    component.editContent = 'Updated content';
    component.updateComment();
    
    expect(commentService.updateComment).toHaveBeenCalledWith(1, 1, 'Updated content');
    expect(component.editingId).toBeNull();
    expect(component.editContent).toBe('');
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Comment updated' });
  });

  it('should not update if no editing id', () => {
    component.editingId = null;
    component.updateComment();
    
    expect(commentService.updateComment).not.toHaveBeenCalled();
  });

  it('should handle update comment error', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error updating');
    commentService.updateComment.and.returnValue(throwError({ error: { message: 'Update failed' } }));
    
    component.editingId = 1;
    component.updateComment();
    
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Update failed' });
  });

  it('should delete comment successfully', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Comment deleted');
    commentService.deleteComment.and.returnValue(of(undefined));
    
    component.comments.set([...mockComments]);
    component.deleteComment(1);
    
    expect(commentService.deleteComment).toHaveBeenCalledWith(1, 1);
    expect(component.comments().length).toBe(1);
    expect(component.comments()[0].id).toBe(2);
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Comment deleted' });
  });

  it('should handle delete comment error', () => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error deleting');
    commentService.deleteComment.and.returnValue(throwError({ error: { message: 'Delete failed' } }));
    
    component.deleteComment(1);
    
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Delete failed' });
  });

  it('should check if user is owner', () => {
    // Debug: First, let's see what we have by default
    console.log('Initial auth state:', AuthSignal.authState());
    console.log('mockComments[0].authorUsername:', mockComments[0].authorUsername);
    console.log('mockComments[1].authorUsername:', mockComments[1].authorUsername);
    
    // Set auth state directly using the signal
    AuthSignal.authState.set({ username: 'user1', token: 'token123' });
    
    // Verify the signal was set correctly
    const currentAuth = AuthSignal.authState();
    console.log('After setting auth state:', currentAuth);
    console.log('Auth username is:', currentAuth.username);
    
    // Test the comparison directly
    console.log('Direct comparison mockComments[0]:', mockComments[0].authorUsername === currentAuth.username);
    console.log('Direct comparison mockComments[1]:', mockComments[1].authorUsername === currentAuth.username);
    
    // Find the specific comments by authorUsername instead of relying on array index
    const user1Comment = mockComments.find(c => c.authorUsername === 'user1');
    const user2Comment = mockComments.find(c => c.authorUsername === 'user2');
    
    console.log('user1Comment:', user1Comment);
    console.log('user2Comment:', user2Comment);
    
    // Test with user1 (should own user1's comment)
    const isOwnerUser1 = component.isOwner(user1Comment!);
    const isOwnerUser2 = component.isOwner(user2Comment!);
    
    console.log('isOwner result for user1Comment:', isOwnerUser1);
    console.log('isOwner result for user2Comment:', isOwnerUser2);
    
    // user1 should own user1Comment but not user2Comment
    expect(isOwnerUser1).toBeTrue();
    expect(isOwnerUser2).toBeFalse();
  });

  it('should check if user is owner with different user', () => {
    // Set auth state for user2
    AuthSignal.authState.set({ username: 'user2', token: 'token123' });
    
    // Debug
    const currentAuth = AuthSignal.authState();
    console.log('Second test - auth state:', currentAuth);
    console.log('Second test - username:', currentAuth.username);
    
    // Find the specific comments by authorUsername instead of relying on array index
    const user1Comment = mockComments.find(c => c.authorUsername === 'user1');
    const user2Comment = mockComments.find(c => c.authorUsername === 'user2');
    
    // Test with user2 (should own user2's comment)
    const isOwnerUser1 = component.isOwner(user1Comment!);
    const isOwnerUser2 = component.isOwner(user2Comment!);
    
    console.log('Second test - isOwnerUser1:', isOwnerUser1);
    console.log('Second test - isOwnerUser2:', isOwnerUser2);
    
    // user2 should own user2Comment but not user1Comment
    expect(isOwnerUser1).toBeFalse();
    expect(isOwnerUser2).toBeTrue();
  });

  it('should check if user is owner with no auth', () => {
    // Set auth state to empty
    AuthSignal.authState.set({ username: '', token: null });
    
    // Test with no user (should own nothing)
    const isOwner0 = component.isOwner(mockComments[0]);
    const isOwner1 = component.isOwner(mockComments[1]);
    
    expect(isOwner0).toBeFalse();
    expect(isOwner1).toBeFalse();
  });

  it('should track comments by id', () => {
    const comment1 = mockComments[0];
    const comment2 = mockComments[1];
    
    // The trackById function should return the comment's id, regardless of the index
    expect(component.trackById(0, comment1)).toBe(comment1.id);
    expect(component.trackById(1, comment2)).toBe(comment2.id);
    
    // Test with different indices to show it doesn't matter
    expect(component.trackById(999, comment1)).toBe(comment1.id);
    expect(component.trackById(0, comment2)).toBe(comment2.id);
  });

  it('should clear success notification after timeout when updating comment', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Comment updated');
    commentService.updateComment.and.returnValue(of({ id: 1, content: 'Updated content', authorUsername: 'user1', postId: 1, createdAt: '2023-01-01' }));
    
    component.editingId = 1;
    component.editContent = 'Updated content';
    component.updateComment();
    
    // Check that success notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Comment updated' });
    
    // Advance time by 2000ms to trigger setTimeout
    tick(2000);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear error notification after timeout when updating comment fails', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error updating');
    commentService.updateComment.and.returnValue(throwError({ error: { message: 'Update failed' } }));
    
    component.editingId = 1;
    component.updateComment();
    
    // Check that error notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Update failed' });
    
    // Advance time by 2500ms to trigger setTimeout
    tick(2500);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear success notification after timeout when deleting comment', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Comment deleted');
    commentService.deleteComment.and.returnValue(of(undefined));
    
    component.comments.set([...mockComments]);
    component.deleteComment(1);
    
    // Check that success notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'Comment deleted' });
    
    // Advance time by 2000ms to trigger setTimeout
    tick(2000);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));

  it('should clear error notification after timeout when deleting comment fails', fakeAsync(() => {
    spyOn(notificationSignal, 'set');
    spyOn(translate, 'instant').and.returnValue('Error deleting');
    commentService.deleteComment.and.returnValue(throwError({ error: { message: 'Delete failed' } }));
    
    component.deleteComment(1);
    
    // Check that error notification is set
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'Delete failed' });
    
    // Advance time by 2500ms to trigger setTimeout
    tick(2500);
    
    // Check that notification is cleared
    expect(notificationSignal.set).toHaveBeenCalledWith(null);
  }));
});
