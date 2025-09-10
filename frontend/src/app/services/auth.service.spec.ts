import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

// Mock HttpClient
class MockHttpClient {
  post = jasmine.createSpy('post');
}

describe('AuthService', () => {
  let service: AuthService;
  let http: MockHttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.post on register', () => {
    const data = { username: 'test', password: '12345678' };
    service.register(data as any);
    expect(http.post).toHaveBeenCalledWith('/api/auth/register', data);
  });

  it('should call http.post on login', () => {
    const data = { username: 'test', password: '12345678' };
    service.login(data as any);
    expect(http.post).toHaveBeenCalledWith('/api/auth/login', data);
  });

  it('should call http.post on logout', () => {
    service.logout();
    expect(http.post).toHaveBeenCalledWith('/api/auth/logout', {});
  });
});
