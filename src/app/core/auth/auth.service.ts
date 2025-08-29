import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    signUpBusiness(data: any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/api/auth/register-business`, data);
    }

    getStates(): Observable<any[]> {
        return this._httpClient.get<any[]>('api/locations/states');
    }

    getCitiesByState(stateId: number): Observable<any[]> {
        return this._httpClient.get<any[]>(`api/locations/cities/${stateId}`);
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    signIn(credentials: { email: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError(() => 'User is already logged in.');
        }

        return this._httpClient.post<any>(`${environment.apiUrl}/api/auth/signin`, credentials).pipe(
            switchMap((response) => {
                this.accessToken = response.token;
                this._authenticated = true;

                // Store user info for Fuse layouts
                this._userService.user = {
                    id: response.id,
                    email: response.email,
                    fullName: response.fullName,
                    name: response.fullName,   // alias for {{user.name}}
                    roles: response.roles
                };

                return of(response);
            }),
        );
    }

    signInUsingToken(): Observable<any> {
        return this._httpClient.post<any>(`${environment.apiUrl}/auth/sign-in-with-token`, {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() => of(false)),
            switchMap((response) => {
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }
                this._authenticated = true;
                this._userService.user = response.user;
                return of(true);
            }),
        );
    }

    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        this._userService.clear();
        return of(true);
    }

    signUp(user: { fullName: string; email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/register`, user);
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/forgot-password`, { email });
    }

    resetPassword(password: string, token?: string): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/reset-password`, { password, token });
    }

    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/unlock-session`, credentials);
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }
        if (!this.accessToken) {
            return of(false);
        }
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }
        return of(true);
    }
}
