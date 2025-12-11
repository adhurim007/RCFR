import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExtraServicesService } from 'app/services/extra-services.service';
import { ExtraServiceModalComponent } from '../extra-service-modal/extra-service-modal.component';

@Component({
    selector: 'app-extra-services-list',
    templateUrl: './extra-services-list.component.html'
})
export class ExtraServicesListComponent implements OnInit {

    services: any[] = [];

    displayedColumns = ['name', 'pricePerDay', 'actions'];

    constructor(
        private service: ExtraServicesService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.service.getAll().subscribe({
            next: (res) => this.services = res,
            error: (err) => console.error("Error loading extra services", err)
        });
    }

    openCreate(): void {
        const dialogRef = this.dialog.open(ExtraServiceModalComponent, {
            width: '400px',
            data: { isEdit: false }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.load();
        });
    }

    openEdit(item: any): void {
        const dialogRef = this.dialog.open(ExtraServiceModalComponent, {
            width: '400px',
            data: { isEdit: true, service: item }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) this.load();
        });
    }

    delete(id: number): void {
        if (!confirm("A jeni i sigurt?")) return;

        this.service.delete(id).subscribe(() => this.load());
    }
}
