import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest, LoginRequest, AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
