
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

describe('App', () => {
  let fixture: any;
  let app: App;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, TranslateModule.forRoot()],
      providers: [
        provideHttpClient()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should set currentLang from translate service on init', () => {
  spyOnProperty(translate, 'currentLang', 'get').and.returnValue('en');
  const mockRouter = {} as Router;
  const newApp = new App(translate, mockRouter);
  expect(newApp.currentLang).toBe('en');
  });

  it('should change language and call translate.use', () => {
    spyOn(translate, 'use');
    app.onLangChange('en');
    expect(app.currentLang).toBe('en');
    expect(translate.use).toHaveBeenCalledWith('en');
  });
});
