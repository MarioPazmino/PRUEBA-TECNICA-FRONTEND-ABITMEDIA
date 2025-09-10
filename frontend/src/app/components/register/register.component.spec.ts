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
      imports: [RegisterComponent, FormsModule, RouterTestingModule, TranslateModule.forRoot()],
      // declarations: [RegisterComponent],
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
});
