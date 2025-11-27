import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { CarPricingRule } from 'app/models/car-pricing-rule.model'; 

@Injectable({
  providedIn: 'root'
})
export class CarPricingRuleService {
  private baseUrl = `${environment.apiUrl}/api/CarPricingRules`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CarPricingRule[]> {
    return this.http.get<CarPricingRule[]>(this.baseUrl);
  }

  getByCarId(carId: number): Observable<CarPricingRule[]> {
    return this.http.get<CarPricingRule[]>(`${this.baseUrl}/by-car/${carId}`);
  }

  getById(id: number): Observable<CarPricingRule> {
    return this.http.get<CarPricingRule>(`${this.baseUrl}/${id}`);
  }

  create(payload: Partial<CarPricingRule>): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<CarPricingRule>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
