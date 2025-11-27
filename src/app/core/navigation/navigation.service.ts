import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MenuDto } from '../../modules/admin/menus/menu.model';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _navigation: BehaviorSubject<Navigation> = new BehaviorSubject<Navigation>({
        compact: [],
        default: [],
        futuristic: [],
        horizontal: []
    });

    constructor(
        private http: HttpClient
    ) {}

    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // ------------------------------------------------------------------------------------
    // BUILD TREE (FLAT → TREE)
    // ------------------------------------------------------------------------------------
    private buildTree(flat: MenuDto[]): FuseNavigationItem[] {
        const idMap: { [key: number]: FuseNavigationItem } = {};
        const tree: FuseNavigationItem[] = [];

        // Convert each record to a nav item
        flat.forEach(m => {
            idMap[m.id] = {
                id: m.id.toString(),
                title: m.title,
                subtitle: m.subtitle || '',
                type: (m.type as FuseNavigationItem['type']) || 'basic',
                icon: m.icon || 'heroicons_outline:square-3-stack-3d',
                link: m.link || undefined,
                children: []
            };
        });

        // Build the parent-child relationships
        flat.forEach(m => {
            if (m.parentId && idMap[m.parentId]) {
                idMap[m.parentId].children.push(idMap[m.id]);
            } else {
                tree.push(idMap[m.id]);
            }
        });

        return tree;
    }

    // ------------------------------------------------------------------------------------
    // LOAD NAVIGATION FROM API
    // ------------------------------------------------------------------------------------
    loadNavigation(): void {
        this.http.get<MenuDto[]>(`${environment.apiUrl}/api/menus/my-menus`)
            .subscribe({
                next: (menus) => {
                    const navTree = this.buildTree(menus);

                    this._navigation.next({
                        compact: [],
                        default: navTree,
                        futuristic: [],
                        horizontal: []
                    });
                },
                error: err => {
                    console.error('❌ Error loading navigation:', err);
                }
            });
    }
}
