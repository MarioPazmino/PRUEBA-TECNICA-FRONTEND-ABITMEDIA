import { LanguageSelectorComponent } from './language-selector.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('LanguageSelectorComponent', () => {
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let component: LanguageSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent, CommonModule],
    }).compileComponents();
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit langChange when language is changed', () => {
    spyOn(component.langChange, 'emit');
    component.changeLang('en');
    expect(component.langChange.emit).toHaveBeenCalledWith('en');
  });

  it('should reflect currentLang in select value', () => {
    component.currentLang = 'en';
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('select')).nativeElement;
    expect(select.value).toBe('en');
  });
});
