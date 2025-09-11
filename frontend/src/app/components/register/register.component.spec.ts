import { RegisterComponent } from './register.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule, RouterTestingModule, TranslateModule.forRoot()]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should disable register button if fields are empty', () => {
    component.username.set('');
    component.password.set('');
    expect(component.canRegister()).toBe(false);
  });

  it('should enable register button if fields are filled', () => {
    component.username.set('test');
    component.password.set('12345678'); // 8 caracteres
    expect(component.canRegister()).toBe(true);
  });

  describe('effect signal for clearing messages', () => {
    it('should clear error after 3 seconds', fakeAsync(() => {
      component.error.set('Error!');
      fixture.detectChanges();
      tick(3100);
      expect(component.error()).toBe('');
    }));

    it('should clear success after 3 seconds', fakeAsync(() => {
      component.success.set('Success!');
      fixture.detectChanges();
      tick(3100);
      expect(component.success()).toBe('');
    }));
  });

  it('should set loading true and call authService.register on register success', fakeAsync(() => {
    const mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.next({});
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.register();
    tick(100); // Ensure signals are set before effect clears them
    expect(component.loading()).toBe(false);
    const expectedSuccess = (component as any).translate.instant('register.success');
    expect(component.success()).toBe(expectedSuccess);
    expect(component.username()).toBe('');
    expect(component.password()).toBe('');
    expect(mockAuthService.register).toHaveBeenCalled();
  }));

  it('should show error for invalid email', fakeAsync(() => {
    component.username.set('invalid-email');
    component.password.set('1234Abcd');
    component.register();
    expect(component.error()).toBe((component as any).translate.instant('register.invalidEmail'));
  }));

  it('should show error for invalid password', fakeAsync(() => {
    component.username.set('test@example.com');
    component.password.set('short'); 
    component.register();
    expect(component.error()).toBe((component as any).translate.instant('register.invalidPassword'));
  }));

  it('should show user exists error (409)', fakeAsync(() => {
    const mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 409 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.register();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('register.userExists'));
  }));

  it('should show forbidden error (401)', fakeAsync(() => {
    const mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 401 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.register();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('register.forbidden'));
  }));

  it('should show service unavailable error (404)', fakeAsync(() => {
    const mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 404 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.register();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('register.serviceUnavailable'));
  }));

  it('should show default error for other status', fakeAsync(() => {
    const mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({ status: 500 });
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test@example.com');
    component.password.set('1234Abcd');
    component.register();
    tick(100);
    expect(component.error()).toBe((component as any).translate.instant('register.error'));
  }));

  // Add other tests here if needed

});
