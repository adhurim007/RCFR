import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarBrandsService } from 'app/services/car-brands.service';
import { CarBrandModalComponent } from '../car-brand-modal/car-brand-modal.component';
import { CarBrand } from 'app/models/car-brand.model';

@Component({
    selector: 'app-car-brands-list',
    templateUrl: './car-brands-list.component.html'
})
export class CarBrandsListComponent implements OnInit {
    brands: CarBrand[] = [];
    displayedColumns = ['name', 'actions'];

    constructor(
        private service: CarBrandsService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.service.getAll().subscribe({
            next: res => {
                console.log("API response Brands:", res);
                this.brands = res;
            },
            error: err => {
                console.error("Error loading brands", err);
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

    openEdit(brand: CarBrand): void {
        const dialogRef = this.dialog.open(CarBrandModalComponent, {
            width: '400px',
            data: { isEdit: true, brand }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.load();
        });
    }

    delete(id: number): void {
        if (!confirm('A jeni i sigurt?')) return;

        this.service.delete(id).subscribe(() => this.load());
    }
}
