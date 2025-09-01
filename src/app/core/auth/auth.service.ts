import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject, catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    // 🔹 Local user state
    private _user$ = new BehaviorSubject<any | null>(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Auth + User Methods
    // -----------------------------------------------------------------------------------------------------

    signUpBusiness(data: any): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/api/auth/register-business`, data);
    }

    getStates(): Observable<any[]> {
        return this._httpClient.get<any[]>('api/locations/states');
    }

    getCitiesByState(stateId: number): Observable<any[]> {
        return this._httpClient.get<any[]>(`api/locations/cities/${stateId}`);
    }

    // 🔹 Sign in
    signIn(credentials: { email: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError(() => 'User is already logged in.');
        }

        return this._httpClient.post<any>(`${environment.apiUrl}/api/auth/signin`, credentials).pipe(
            switchMap((response) => {
                this.accessToken = response.token;
                this._authenticated = true;

                // Store user info in UserService and local state
                const user = {
                    id: response.id,
                    email: response.email,
                    fullName: response.fullName,
                    name: response.fullName,
                    roles: response.roles
                };

                this._userService.user = user;
                this._user$.next(user);
                localStorage.setItem('user', JSON.stringify(user));

                return of(response);
            })
        );
    }

    // 🔹 Auto login using token
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

                if (response.user) {
                    this._userService.user = response.user;
                    this._user$.next(response.user);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                return of(true);
            })
        );
    }

    // 🔹 Sign out
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        this._authenticated = false;
        this._userService.clear();
        this._user$.next(null);
        return of(true);
    }

    // 🔹 Sign up
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

    // 🔹 Check session validity
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

    // -----------------------------------------------------------------------------------------------------
    // @ User helpers (used by RoleGuard & UserComponent)
    // -----------------------------------------------------------------------------------------------------

    getUser(): any | null {
        if (this._user$.value) {
            return this._user$.value;
        }
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            this._user$.next(parsed);
            return parsed;
        }
        return null;
    }

    get user$(): Observable<any | null> {
        return this._user$.asObservable();
    }
}
