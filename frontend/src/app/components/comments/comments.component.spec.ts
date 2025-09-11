import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    component.orderDesc = true;
    component.comments.set([...mockComments]);
    component.toggleOrder(); // This will re-sort
    
    const sorted = component.comments();
    expect(new Date(sorted[0].createdAt).getTime()).toBeGreaterThan(new Date(sorted[1].createdAt).getTime());
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

  it('should start edit mode', () => {
    // Set up component with mock comments first
    component.comments.set(mockComments);
    
    const comment = mockComments[0]; // This is the comment with id: 1, content: 'Test comment 1'
    component.startEdit(comment);
    
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
    // Set auth state before testing
    AuthSignal.authState.set({ username: 'user1', token: 'token123' });
    fixture.detectChanges(); // Trigger change detection
    
    // mockComments[0] has authorUsername: 'user1', so should be true
    expect(component.isOwner(mockComments[0])).toBeTrue();
    // mockComments[1] has authorUsername: 'user2', so should be false  
    expect(component.isOwner(mockComments[1])).toBeFalse();
    
    // Test with different user
    AuthSignal.authState.set({ username: 'user2', token: 'token123' });
    fixture.detectChanges();
    
    // Now the results should be inverted
    expect(component.isOwner(mockComments[0])).toBeFalse();
    expect(component.isOwner(mockComments[1])).toBeTrue();
  });

  it('should track comments by id', () => {
    const comment = mockComments[0];
    expect(component.trackById(0, comment)).toBe(1);
  });
});
