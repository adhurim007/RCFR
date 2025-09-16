import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { User } from 'app/core/user/user.types'; 
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
 

@Injectable({ providedIn: 'root' })
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    constructor(private http: HttpClient) {}
    
    set user(value: User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    getCurrent(): User | null {
        let currentUser: User | null = null;
        this._user.subscribe(u => currentUser = u).unsubscribe();
        return currentUser;
    }

    clear(): void {
        this._user.next(null);
    }

    // Re-add update for compatibility with Fuse components
    update(user: User): Observable<User> {
        this._user.next(user);
        return of(user);
    }

      getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/users`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/users/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/users/create`, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/users/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/users/${id}`);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/api/users/roles`);
  }
}
