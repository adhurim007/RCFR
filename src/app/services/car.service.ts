import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class CarService {

  private baseUrl = environment.apiUrl + '/api/cars';
   

  constructor(private http: HttpClient) {}
 
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getByBusiness(businessId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/cars/by-business/${businessId}`);
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
 
  setAvailability(carId: number, isAvailable: boolean) {
    return this.http.put(`${this.baseUrl}/${carId}/availability`, isAvailable);
  }
 
  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/brands`);
  }

  getModelsByBrand(brandId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/models/${brandId}`);
  }

  getTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cartypes`);
  }

  getFuelTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fueltypes`);
  }

  getTransmissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/transmissions`);
  }
 
  uploadImages(carId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post(`${this.baseUrl}/${carId}/images`, formData);
  }
}
