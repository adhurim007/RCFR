import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarLookupService {

  private apiUrl = `${environment.apiUrl}/api/cars/`;

  constructor(private http: HttpClient) {}

  // Brands
  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'brands');
  }

  // Models by brand
  getModels(brandId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}models/${brandId}`);
  }

  // Car types
  getCarTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'cartypes');
  }

  // Fuel types
  getFuelTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'fueltypes');
  }

  // Transmissions
  getTransmissions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'transmissions');
  }
}
