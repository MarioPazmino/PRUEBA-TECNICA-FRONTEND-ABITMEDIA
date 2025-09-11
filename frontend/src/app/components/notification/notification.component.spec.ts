import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { By } from '@angular/platform-browser';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display notification when message is empty', () => {
    component.msg = '';
    fixture.detectChanges();
    
    const notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv).toBeFalsy();
  });

  it('should display notification when message is set', () => {
    component.msg = 'Test message';
    fixture.detectChanges();
    
    const notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv).toBeTruthy();
    
    const messageSpan = fixture.debugElement.query(By.css('span'));
    expect(messageSpan.nativeElement.textContent.trim()).toBe('Test message');
  });

  it('should update message signal when msg input changes', () => {
    component.msg = 'Initial message';
    expect(component.message()).toBe('Initial message');
    
    component.msg = 'Updated message';
    expect(component.message()).toBe('Updated message');
  });

  it('should default to success type', () => {
    expect(component.type).toBe('success');
  });

  it('should accept error type', () => {
    component.type = 'error';
    expect(component.type).toBe('error');
  });

  it('should display success styling and icon for success type', () => {
    component.type = 'success';
    component.msg = 'Success message';
    fixture.detectChanges();
    
    const notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv.nativeElement.className).toContain('bg-green-100');
    expect(notificationDiv.nativeElement.className).toContain('text-green-800');
    expect(notificationDiv.nativeElement.className).toContain('border-green-200');
    
    // Check for success icon (checkmark)
    const successIcon = fixture.debugElement.query(By.css('svg'));
    expect(successIcon).toBeTruthy();
    expect(successIcon.nativeElement.getAttribute('class')).toContain('text-green-400');
    
    const iconPath = successIcon.query(By.css('path'));
    expect(iconPath.nativeElement.getAttribute('d')).toBe('M5 13l4 4L19 7');
  });

  it('should display error styling and icon for error type', () => {
    component.type = 'error';
    component.msg = 'Error message';
    fixture.detectChanges();
    
    const notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv.nativeElement.className).toContain('bg-red-100');
    expect(notificationDiv.nativeElement.className).toContain('text-red-800');
    expect(notificationDiv.nativeElement.className).toContain('border-red-200');
    
    // Check for error icon (X mark)
    const errorIcon = fixture.debugElement.query(By.css('svg'));
    expect(errorIcon).toBeTruthy();
    expect(errorIcon.nativeElement.getAttribute('class')).toContain('text-red-400');
    
    const iconPath = errorIcon.query(By.css('path'));
    expect(iconPath.nativeElement.getAttribute('d')).toBe('M6 18L18 6M6 6l12 12');
  });

  it('should have correct positioning classes', () => {
    component.msg = 'Test message';
    fixture.detectChanges();
    
    const notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv.nativeElement.className).toContain('fixed');
    expect(notificationDiv.nativeElement.className).toContain('top-4');
    expect(notificationDiv.nativeElement.className).toContain('right-4');
    expect(notificationDiv.nativeElement.className).toContain('z-50');
  });

  it('should have animation classes', () => {
    component.msg = 'Test message';
    fixture.detectChanges();
    
    const notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv.nativeElement.className).toContain('animate-fade-in');
    expect(notificationDiv.nativeElement.className).toContain('transition-all');
    expect(notificationDiv.nativeElement.className).toContain('duration-500');
  });

  it('should have correct layout classes', () => {
    component.msg = 'Test message';
    fixture.detectChanges();
    
    const notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv.nativeElement.className).toContain('flex');
    expect(notificationDiv.nativeElement.className).toContain('items-center');
    expect(notificationDiv.nativeElement.className).toContain('gap-2');
    expect(notificationDiv.nativeElement.className).toContain('px-4');
    expect(notificationDiv.nativeElement.className).toContain('py-2');
    expect(notificationDiv.nativeElement.className).toContain('rounded-lg');
    expect(notificationDiv.nativeElement.className).toContain('shadow-lg');
  });

  it('should toggle visibility when message changes from empty to filled', () => {
    // Start with empty message
    component.msg = '';
    fixture.detectChanges();
    let notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv).toBeFalsy();
    
    // Set message
    component.msg = 'Now visible';
    fixture.detectChanges();
    notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv).toBeTruthy();
    
    // Clear message again
    component.msg = '';
    fixture.detectChanges();
    notificationDiv = fixture.debugElement.query(By.css('div'));
    expect(notificationDiv).toBeFalsy();
  });

  it('should display message with correct font weight', () => {
    component.msg = 'Test message';
    fixture.detectChanges();
    
    const messageSpan = fixture.debugElement.query(By.css('span'));
    expect(messageSpan.nativeElement.className).toContain('font-medium');
  });
});
