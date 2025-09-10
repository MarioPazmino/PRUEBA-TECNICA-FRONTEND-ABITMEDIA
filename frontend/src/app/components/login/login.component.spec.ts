import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import * as AuthSignal from '../../signals/auth.signal';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterTestingModule, TranslateModule.forRoot()],
      // declarations: [LoginComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
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
    expect(component.error()).toBe('Credenciales inválidas o error de conexión');
    expect(mockAuthService.login).toHaveBeenCalled();
  });
});
