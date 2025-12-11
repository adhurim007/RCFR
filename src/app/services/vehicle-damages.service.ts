import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleDamagesService {
  
  
  private baseUrl = environment.apiUrl + '/api/vehicledamages';
 

  constructor(private http: HttpClient) {}
 
  getList(reservationId?: number): Observable<any[]> {
    let url = this.baseUrl;

    if (reservationId) {
      url += `?reservationId=${reservationId}`;
    }

    return this.http.get<any[]>(url);
  }

  // ✅ GET BY ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // ✅ CREATE
  create(formData: FormData): Observable<number> {
    return this.http.post<number>(this.baseUrl, formData);
  }

  // ✅ UPDATE
  update(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, formData);
  }

  // ✅ DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
