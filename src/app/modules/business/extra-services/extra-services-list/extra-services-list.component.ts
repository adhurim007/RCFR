import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExtraServicesService } from 'app/services/extra-services.service';
import { ExtraServiceModalComponent } from '../extra-service-modal/extra-service-modal.component';

@Component({
  selector: 'app-extra-services-list',
  templateUrl: './extra-services-list.component.html',
  standalone: false,
})
export class ExtraServicesListComponent implements OnInit {

  services: any[] = [];
  loading = true;

  selectedService: any | null = null;

  constructor(
    private service: ExtraServicesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (res) => {
        this.services = res ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading extra services", err);
        this.services = [];
        this.loading = false;
      }
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

  openEdit(item?: any): void {
    if (!item) return;

    const dialogRef = this.dialog.open(ExtraServiceModalComponent, {
      width: '400px',
      data: { isEdit: true, service: item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.load();
    });
  }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm("A jeni i sigurt?")) return;

    this.service.delete(id).subscribe(() => this.load());
  }
}