import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _apiUrl = 'https://localhost:7136/api/Auth'; // adjust backend URL
  accessToken: string | null = localStorage.getItem('accessToken');

  constructor(private http: HttpClient) {}

  // ------------------- Auth actions -------------------

  signIn(payload: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this._apiUrl}/signin`, payload).pipe(
      tap((response) => {
        if (response && response.token) {
          this.accessToken = response.token;
          localStorage.setItem('accessToken', response.token);

          if (response.roles) {
            localStorage.setItem('roles', JSON.stringify(response.roles));
          }
        }
      })
    );
  }

  // auth.service.ts
forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this._apiUrl}/forgot-password`, { email });
}

resetPassword(password: string, token?: string): Observable<any> {
  return this.http.post(`${this._apiUrl}/reset-password`, { password, token });
}

unlockSession(payload: any): Observable<any> {
  return this.http.post(`${this._apiUrl}/unlock-session`, payload);
}


  signUp(payload: any): Observable<any> {
    // ✅ backend endpoint is /register not /signup
    return this.http.post(`${this._apiUrl}/register`, payload);
  }

  signOut(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('roles');
  }

  check(): Observable<boolean> {
    // ✅ User is authenticated only if token exists
    return of(!!this.accessToken);
  }
}
