import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface MonthlyPointDto {
  year: number;
  month: number;
  label: string;
  value: number;
}

export interface DashboardCardsDto {
  totalReservations: number;
  reservationsThisMonth: number;
  totalClients: number;
  totalCars: number;
  incomeThisMonth: number;
  pendingReservations: number;
}

export interface DashboardSummaryDto {
  cards: DashboardCardsDto;
  reservationsPerMonth: MonthlyPointDto[];
  incomePerMonth: MonthlyPointDto[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getBusinessDashboard(): Observable<DashboardSummaryDto> {
    return this.http.get<DashboardSummaryDto>(`${this.baseUrl}/business`);
  }
}
