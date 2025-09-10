

import { RegisterComponent } from './register.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    it('should clear error after 3 seconds', (done) => {
      component.error.set('Error!');
      setTimeout(() => {
        expect(component.error()).toBe('');
        done();
      }, 3100);
    });

    it('should clear success after 3 seconds', (done) => {
      component.success.set('Success!');
      setTimeout(() => {
        expect(component.success()).toBe('');
        done();
      }, 3100);
    });
  });


  it('should set loading true and call authService.register on register success', () => {
    const mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.next({});
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test');
    component.password.set('12345678');
    component.register();
    expect(component.loading()).toBe(false);
    expect(component.success()).toBe('Usuario registrado correctamente');
    expect(component.username()).toBe('');
    expect(component.password()).toBe('');
    expect(mockAuthService.register).toHaveBeenCalled();
  });

  it('should set error and loading false on register failure', () => {
    const mockAuthService = {
      register: jasmine.createSpy('register').and.returnValue({
        subscribe: (handlers: any) => {
          handlers.error({});
        }
      })
    };
    (component as any).authService = mockAuthService;
    component.username.set('test');
    component.password.set('12345678');
    component.register();
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('Error al registrar usuario');
    expect(mockAuthService.register).toHaveBeenCalled();
  });
});
