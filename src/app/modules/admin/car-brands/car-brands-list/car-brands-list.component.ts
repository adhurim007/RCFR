import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarBrandsService } from 'app/services/car-brands.service';
import { CarBrandModalComponent } from '../car-brand-modal/car-brand-modal.component';
import { CarBrand } from 'app/models/car-brand.model';

@Component({
  selector: 'app-car-brands-list',
  templateUrl: './car-brands-list.component.html',
  standalone: false,
})
export class CarBrandsListComponent implements OnInit {

  brands: CarBrand[] = [];
  loading = true;

  selectedBrand: CarBrand | null = null;

  constructor(
    private service: CarBrandsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.service.getAll().subscribe({
      next: res => {
        this.brands = res ?? [];
        this.loading = false;
      },
      error: err => {
        console.error("Error loading brands", err);
        this.brands = [];
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(CarBrandModalComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  openEdit(brand?: CarBrand | null): void {
    if (!brand) return;

    const dialogRef = this.dialog.open(CarBrandModalComponent, {
      width: '400px',
      data: { isEdit: true, brand }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm('A jeni i sigurt?')) return;

    this.service.delete(id).subscribe(() => this.load());
  }
}