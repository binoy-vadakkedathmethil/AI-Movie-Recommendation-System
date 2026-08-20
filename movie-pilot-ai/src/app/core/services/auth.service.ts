import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

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
  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {}

  login(payload: LoginRequest): Observable<any> {
    return this.apiService.post<any>('/auth/login', payload).pipe(
      map((response) => {
        console.log('Login response:', response);
        const token = response?.access_token ?? null;
        if (token) {
          this.tokenService.setToken(token);
        }

        return response;
      })
    );
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.apiService.post('/auth/register', payload);
  }


}
