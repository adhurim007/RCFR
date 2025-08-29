import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private apiUrl = environment.apiUrl; // http://localhost:7136/api

  constructor(private http: HttpClient) {}

  getStates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/locations/states`);
  }

  getCities(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/locations/cities/${stateId}`);
  }
}

