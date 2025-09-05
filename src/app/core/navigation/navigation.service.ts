import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MenuDto } from '../../modules/admin/menus/menu.model';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _navigation: BehaviorSubject<Navigation> = new BehaviorSubject<Navigation>({
    compact: [],
    default: [],
    futuristic: [],
    horizontal: []
  });

  constructor(
    private http: HttpClient,
    private authService: AuthService   // ✅ inject AuthService
  ) {}

  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

loadNavigation(): void {
  this.http.get<MenuDto[]>(`${environment.apiUrl}/api/menus/my-menus`)
    .subscribe(menus => {
      const navItems: FuseNavigationItem[] = menus.map(menu => ({
        id: menu.id.toString(),
        title: menu.title,
        type: (menu.type as FuseNavigationItem['type']) || 'basic',
        icon: menu.icon || 'heroicons_outline:square-3-stack-3d',
        link: menu.link || '/'
      }));

      this._navigation.next({
        compact: [],
        default: navItems,
        futuristic: [],
        horizontal: []
      });
    });
  } 
}
 