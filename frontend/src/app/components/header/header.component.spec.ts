
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { notificationSignal } from '../../signals/notification.signal';
import { authState } from '../../signals/auth.signal';

// Mock AuthService
class MockAuthService {
  logout() {
    return {
      subscribe: (handlers: any) => {
        handlers.next();
      }
    };
  }
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock TranslateService
class MockTranslateService {
  instant(key: string) { return key; }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: MockAuthService;
  let router: MockRouter;
  let translate: MockTranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, CommonModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
    translate = TestBed.inject(TranslateService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.logout and update state on logout', () => {
    spyOn(authState, 'set');
    spyOn(notificationSignal, 'set');
    component.logout();
    expect(authState.set).toHaveBeenCalledWith({ username: '', token: null });
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'success', message: 'header.logoutSuccess' });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

    it('should not call logout logic if loading is true', () => {
    component.loading = true;
    const spy = spyOn(component['authService'], 'logout');
    component.logout();
    expect(spy).not.toHaveBeenCalled();
  });
  
  it('should show error notification on logout error', () => {
    // Override logout to call error
    spyOn(authService, 'logout').and.returnValue({
      subscribe: (handlers: any) => {
        handlers.error();
      }
    });
    spyOn(notificationSignal, 'set');
    component.logout();
    expect(notificationSignal.set).toHaveBeenCalledWith({ type: 'error', message: 'header.logoutError' });
  });
});
