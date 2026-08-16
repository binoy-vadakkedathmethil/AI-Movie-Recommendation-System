import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  sub?: string;
  name?: string;
  email?: string;
  username?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly TOKEN_KEY = 'movie_pilot_ai_token';

  readonly currentUser = signal<JwtPayload | null>(
    this.decodeToken()
  );

  constructor(
    private readonly router: Router
  ) {}

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);

    this.currentUser.set(
      jwtDecode<JwtPayload>(token)
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  getUserName(): string {
    const user = this.currentUser();

    return user?.name ||
           user?.username ||
           user?.email ||
           'User';
  }

  logout(): void {
    // Remove authentication data
    localStorage.removeItem(this.TOKEN_KEY);

    // Clear current user
    this.currentUser.set(null);

    // Redirect to login
    this.router.navigate(['/auth/login']);
  }
}
