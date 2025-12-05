import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {

  private baseUrl = environment.apiUrl + '/api/reservations';
  private extrasUrl = environment.apiUrl + '/api/extraservices';
  private customersUrl = environment.apiUrl + '/api/customers';
  private locationsUrl = environment.apiUrl + '/api/businesslocations';
  //private carPricingRulesUrl = environment.apiUrl + '/api/car-pricing-rules';

  constructor(private http: HttpClient) {}

 
    
  // CRUD rezervime
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

  // Lookup për formën
  getExtraServices(): Observable<any[]> {
    return this.http.get<any[]>(this.extrasUrl);
  }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.customersUrl);
  }

  getLocations(businessId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.locationsUrl}?businessId=${businessId}`);
  }

  searchCustomer(personalNumber: string): Observable<any> {
    return this.http.get<any>(`${this.customersUrl}/search?personalNumber=${personalNumber}`);
  }
  // Pricing rules për veturë
  // getCarPricingRules(carId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.carPricingRulesUrl}/by-car/${carId}`);
  // }
}
