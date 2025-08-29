import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { User } from 'app/core/user/user.types';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

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
}
