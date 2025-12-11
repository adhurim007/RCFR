import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleInspectionsService {
 
  private apiUrl = environment.apiUrl + '/api/VehicleInspections';

  constructor(private http: HttpClient) {}
 
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
 
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

 
  getByReservation(reservationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservation/${reservationId}`);
  }

  create(data: FormData) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: FormData) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  } 
  
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
