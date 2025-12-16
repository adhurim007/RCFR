import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, map, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';

@Injectable({ providedIn: 'root' })
export class CarRegistrationsService {

    private baseUrl  = environment.apiUrl + '/api/car-registrations';
    private usersUrl = environment.apiUrl + '/api/users';
    private carsUrl  = environment.apiUrl + '/api/cars';

    private businessId: number | null = null;

    constructor(
        private http: HttpClient,
        private userService: UserService
    ) {}

    // 🔹 get businessId once
    private ensureBusinessId(): Observable<number | null> {
        if (this.businessId !== null) {
            return of(this.businessId);
        }

        const user = this.userService.getCurrent();
        if (!user) return of(null);

        return this.http
            .get<{ businessId: number }>(`${this.usersUrl}/${user.id}/business-id`)
            .pipe(
                map(res => res?.businessId ?? null),
                tap(id => this.businessId = id)
            );
    }

    // 🔹 cars dropdown
    getCars(): Observable<any[]> {
        return this.ensureBusinessId().pipe(
            switchMap(id => id
                ? this.http.get<any[]>(`${this.carsUrl}/by-business/${id}`)
                : of([])
            )
        );
    }

    // 🔹 list
    getByBusiness(): Observable<any[]> {
        return this.ensureBusinessId().pipe(
            switchMap(id => id
                ? this.http.get<any[]>(`${this.baseUrl}/by-business/${id}`)
                : of([])
            )
        );
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    create(data: any): Observable<number> {
        return this.ensureBusinessId().pipe(
            switchMap(businessId => {
                if (!businessId) throw new Error('BusinessId missing');
                return this.http.post<number>(this.baseUrl, {
                    ...data,
                    businessId
                });
            })
        );
    }

    update(id: number, data: any): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
