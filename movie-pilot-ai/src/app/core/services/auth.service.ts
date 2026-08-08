import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  login(payload: LoginRequest): Observable<any> {
    return this.apiService.post('/auth/login', payload);
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.apiService.post('/auth/register', payload);
  }
}
