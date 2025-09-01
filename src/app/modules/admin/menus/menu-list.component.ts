import { Component, OnInit } from '@angular/core';
import { MenuService } from 'app/services/menu.service';
import { MenuDto } from './menu.model';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
})
export class MenuListComponent implements OnInit {
  menus: MenuDto[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenus().subscribe({
      next: (data) => {
        console.log('Menus from API:', data); // 👀 check browser console
        this.menus = data;
      },
      error: (err) => console.error('Error loading menus', err),
    });
  }
}
