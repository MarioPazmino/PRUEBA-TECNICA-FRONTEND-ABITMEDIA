import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import * as AuthSignal from '../../signals/auth.signal';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';

// DummyComponent para rutas requeridas en los tests
import { Component } from '@angular/core';
@Component({selector: 'app-dummy', template: ''})
class DummyComponent {}
import { TranslateModule } from '@ngx-translate/core';

describe('LoginComponent', () => {
  it('should clear success message via effect signal after 5 seconds', fakeAsync(() => {
    component.success.set('Login successful');
    fixture.detectChanges();
    tick(5000);
    expect(component.success()).toBe('');
  }));
  it('should show success message on login and auto-clear after 5 seconds', fakeAsync(() => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.next({ data: { username: 'test', token: 'abc123' } });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test');
    component.password.set('1234');
    component.login();
    // Simulate the effect signal triggering autoClearSuccess
    component.success.set('Login successful');
    component.autoClearSuccess();
    tick(5000);
    expect(component.success()).toBe('');
  }));
  it('should auto-clear success message after 5 seconds', fakeAsync(() => {
    component.success.set('Login successful');
    component.autoClearSuccess();
    tick(5000);
    expect(component.success()).toBe('');
  }));
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'posts', component: DummyComponent },
          { path: 'login', component: DummyComponent }
        ]),
        TranslateModule.forRoot(),
        DummyComponent
      ],
      providers: [
        provideHttpClient()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Set language to Spanish for tests
    const translateService = fixture.debugElement.injector.get<any>('TranslateService', null) || (component as any).translate;
    if (translateService && typeof translateService.use === 'function') {
      translateService.use('es');
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial empty username and password', () => {
    expect(component.username()).toBe('');
    expect(component.password()).toBe('');
  });

  it('should disable login button if fields are empty', () => {
    component.username.set('');
    component.password.set('');
    expect(component.canLogin()).toBe(false);
  });

  it('should enable login button if fields are filled', () => {
    component.username.set('test');
    component.password.set('1234');
    expect(component.canLogin()).toBe(true);
  });

  describe('effect signal for clearing error', () => {
    it('should clear error after 3 seconds', fakeAsync(() => {
      component.error.set('Error!');
      fixture.detectChanges();
      tick(3100);
      expect(component.error()).toBe('');
    }));
  });

  it('should set loading true and call authService.login on login success', () => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.next({ data: { username: 'test', token: 'abc123' } });
        }
      })
    };
    (component as any).authService = mockAuthService;
    const setSpy = spyOn(AuthSignal.authState, 'set');
    component.username.set('test');
    component.password.set('1234');
    component.login();
    expect(component.loading()).toBe(false);
    expect(setSpy).toHaveBeenCalledWith({ username: 'test', token: 'abc123' });
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should set error and loading false on login failure', () => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({});
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test');
    component.password.set('1234');
    component.login();
    expect(component.loading()).toBe(false);
    const expectedError = (component as any).translate.instant('login.error');
    expect(component.error()).toBe(expectedError);
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should show error for 401 status', fakeAsync(() => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 401 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.login();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('login.error'));
  }));

  it('should show forbidden error for 403 status', fakeAsync(() => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 403 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.login();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('login.forbidden'));
  }));

  it('should show service unavailable error for 404 status', fakeAsync(() => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 404 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.login();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('login.serviceUnavailable'));
  }));

  it('should show conflict error for 409 status', fakeAsync(() => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 409 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.login();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('login.conflict'));
  }));

  it('should show default error for other status', fakeAsync(() => {
    const mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 500 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.login();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('login.error'));
  }));
});
