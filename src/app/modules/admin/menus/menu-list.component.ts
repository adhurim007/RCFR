import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'app/services/menu.service';
import { MenuDto } from '../menus/menu.model'; 
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MenuFormComponent } from './menu-form/menu-form.component';
@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
})
export class MenuListComponent implements OnInit {
  menus: MenuDto[] = [];

  constructor(
    private menuService: MenuService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.menuService.getMenus().subscribe({
      next: (data) => (this.menus = data),
      error: (err) => console.error('Error loading menus', err),
    });
  }

createMenu(): void {
  const dialogRef = this.dialog.open(MenuFormComponent, {
    width: '600px',
    disableClose: true,
    data: null // nëse do dërgosh ndonjë parametër
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.loadMenus(); // rifresko listën pasi mbyllet forma
    }
  });
}
  editMenu(id: number): void {
    this.router.navigate(['/admin/menu/edit', id]);
  }

  deleteMenu(id: number): void {
    Swal.fire({
      title: 'A jeni i sigurt?',
      text: 'Ky veprim do të fshijë menunë përfundimisht.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Po, fshije!',
      cancelButtonText: 'Anulo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.deleteMenu(id).subscribe({
          next: () => {
            Swal.fire('Fshirë!', 'Menuja u fshi me sukses.', 'success');
            this.loadMenus(); // rifresko listën
          },
          error: (err) => {
            console.error('Gabim gjatë fshirjes:', err);
            Swal.fire('Gabim!', 'Nuk mund të fshihet menuja.', 'error');
          },
        });
      }
    });
  }
}
