import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _apiUrl = 'https://localhost:7136/api/auth/'; // adjust to your backend URL
  accessToken: string | null = localStorage.getItem('accessToken');

  constructor(private http: HttpClient) {}

  // ------------------- Auth actions -------------------

  signIn(payload: any): Observable<any> {
    return this.http.post(`${this._apiUrl}/signin`, payload);
  }

  signUp(payload: any): Observable<any> {
    return this.http.post(`${this._apiUrl}/signup`, payload);
  }

  signOut(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    // TODO: navigate to login if needed
  }

  unlockSession(payload: any): Observable<any> {
    return this.http.post(`${this._apiUrl}/unlock-session`, payload);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this._apiUrl}/forgot-password`, { email });
  }

  resetPassword(password: string): Observable<any> {
    return this.http.post(`${this._apiUrl}/reset-password`, { password });
  }

  check(): Observable<boolean> {
    // ✅ User is only "authenticated" if token exists
    return of(!!this.accessToken);
  }

}
