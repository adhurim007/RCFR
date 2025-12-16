import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment'; 
import { Observable, of, switchMap, map, tap } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
@Injectable({ providedIn: 'root' })
export class CarServicesService {
  

private baseUrl = `${environment.apiUrl}/api/car-services`;
private usersUrl     = environment.apiUrl + '/api/users';
private carsUrl      = environment.apiUrl + '/api/cars';

constructor(
  private http: HttpClient,
  private userService: UserService, 
) {}

private businessId: number | null = null;

private ensureBusinessId(): Observable<number | null> {
   
      if (this.businessId !== null) {
        return of(this.businessId);
      }
  
      const currentUser = this.userService.getCurrent();
      if (!currentUser) { 
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

  getCars(): Observable<any[]> {
    return this.ensureBusinessId().pipe(
      switchMap(id => {
        if (!id) return of([]);
        return this.http.get<any[]>(`${this.carsUrl}/by-business/${id}`);
      })
    );
  }
  
   

    getByBusiness(): Observable<any[]> {
    return this.ensureBusinessId().pipe(
      switchMap(businessId => {
        if (!businessId) return of([]);
        return this.http.get<any[]>(
          `${this.baseUrl}/by-business/${businessId}`
        );
      })
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
   
  create(data: any): Observable<number> {
    return this.ensureBusinessId().pipe(
      switchMap(businessId => {
        if (!businessId) {
          throw new Error('BusinessId not found');
        }

        const payload = {
          ...data,
          businessId
        };

        return this.http.post<number>(this.baseUrl, payload);
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
