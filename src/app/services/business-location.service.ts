import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessLocationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getByBusinessId(businessId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/businesslocations/business/${businessId}`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/businesslocations/all`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(model: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/businesslocations`, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/businesslocations/${model.id}`, model);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/businesslocations/${id}`);
  }
}
