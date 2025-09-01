import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Menu } from '../modules/admin/menus/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private apiUrl = environment.apiUrl + '/menus';

  constructor(private http: HttpClient) {}

  // Get all menus
  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  // Get single menu by id
  getMenuById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.apiUrl}/${id}`);
  }

  // Create a new menu
  createMenu(menu: Partial<Menu>): Observable<number> {
    return this.http.post<number>(this.apiUrl, menu);
  }

  // Update an existing menu
  updateMenu(id: number, menu: Partial<Menu>): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${id}`, menu);
  }

  // Delete a menu
  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
