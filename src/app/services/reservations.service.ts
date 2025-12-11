// src/app/services/reservations.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, map, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';

@Injectable({ providedIn: 'root' })
export class ReservationService {

  private baseUrl      = environment.apiUrl + '/api/reservations';
  private extrasUrl    = environment.apiUrl + '/api/extraservices';
  private customersUrl = environment.apiUrl + '/api/customers';
  private locationsUrl = environment.apiUrl + '/api/businesslocations';
  private carsUrl      = environment.apiUrl + '/api/cars';
  private usersUrl     = environment.apiUrl + '/api/users';

  private businessId: number | null = null;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  // =========================================================
  //  BUSINESS ID (merret nga /api/users/{userId}/business-id)
  // =========================================================
  private ensureBusinessId(): Observable<number | null> {

    // nëse e kemi ruajtur më herët, mos e thirr API-n prapë
    if (this.businessId !== null) {
      return of(this.businessId);
    }

    const currentUser = this.userService.getCurrent();
    if (!currentUser) {
      // nëse s’ka user, mos bëj error, vetëm kthe null
      return of(null);
    }

    return this.http
      .get<{ businessId: number }>(
        `${this.usersUrl}/${currentUser.id}/business-id`
      )
      .pipe(
        map(res => res?.businessId ?? null),
        tap(id => { this.businessId = id; })
      );
  }

  // nëse të duhet diku tjetër:
  loadBusinessId(): Observable<number | null> {
    return this.ensureBusinessId();
  }

  // =========================================================
  //  RESERVATIONS
  // =========================================================

  // Lista për një biznes (pa parametër; vetë e gjen businessId)
  getByBusiness(): Observable<any[]> {
    return this.ensureBusinessId().pipe(
      switchMap(id => {
        if (!id) return of([]);
        return this.http.get<any[]>(`${this.baseUrl}/business/${id}`);
      })
    );
  }

  // (për admin ose për inspection-form – të gjitha rezervimet)
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(payload: any): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // =========================================================
  //  CARS & LOCATIONS (filtruara sipas biznesit)
  // =========================================================
  getCars(): Observable<any[]> {
    return this.ensureBusinessId().pipe(
      switchMap(id => {
        if (!id) return of([]);
        return this.http.get<any[]>(`${this.carsUrl}/by-business/${id}`);
      })
    );
  }

  getLocations(): Observable<any[]> {
    return this.ensureBusinessId().pipe(
      switchMap(id => {
        if (!id) return of([]);
        // ke controller me [HttpGet("by-business/{businessId:int}")]
        return this.http.get<any[]>(`${this.locationsUrl}/by-business/${id}`);
      })
    );
  }

  // =========================================================
  //  EXTRAS, CUSTOMERS
  // =========================================================
  getExtraServices(): Observable<any[]> {
    return this.http.get<any[]>(this.extrasUrl);
  }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.customersUrl);
  }

  searchCustomer(personalNumber: string): Observable<any> {
    return this.http.get<any>(
      `${this.customersUrl}/search`,
      { params: { personalNumber } }
    );
  }
}
