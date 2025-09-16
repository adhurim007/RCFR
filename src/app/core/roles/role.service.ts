import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/roles`);
  }

  createRole(name: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/roles`, { roleName: name });
  }

  updateRole(id: string, name: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${environment.apiUrl}/api/roles/${id}`, 
      { id, name }
    );
  }
  
  deleteRole(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.apiUrl}/api/roles/${id}`
    );
  }
}
