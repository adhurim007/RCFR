import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { MenuDto } from '../modules/admin/menus/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = environment.apiUrl + '/api/menus';

  constructor(private http: HttpClient) {}

  // Get all menus
  getMenus(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(this.apiUrl);
  }

  // Get single menu by id
  getMenuById(id: number): Observable<MenuDto> {
    return this.http.get<MenuDto>(`${this.apiUrl}/${id}`);
  }

  // Create a new menu
  createMenu(menu: Partial<MenuDto>): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/create`, menu);
  }

  // Update an existing menu
  updateMenu(id: number, menu: Partial<MenuDto>): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, menu);
  }

  // Delete a menu
  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

   getAllClaims(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/claims`);
  }
}
