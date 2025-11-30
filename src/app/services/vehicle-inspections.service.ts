import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleInspectionsService {

  private apiUrl = environment.apiUrl + '/api/VehicleInspections';

  constructor(private http: HttpClient) {}

  /** ADMIN – get ALL inspections */
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  /** Get inspection by Id */
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Get inspections by reservation (customer/business-level) */
  getByReservation(reservationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/${reservationId}`);
  }

  /** Create */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** Update */
  update(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${data.id}`, data);
  }

  /** Delete */
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
