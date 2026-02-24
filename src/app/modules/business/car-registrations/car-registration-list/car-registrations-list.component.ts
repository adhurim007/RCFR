import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarRegistrationsService } from 'app/services/car-registrations.service';

@Component({
  selector: 'app-car-registrations-list',
  templateUrl: './car-registrations-list.component.html',
  standalone: false,
})
export class CarRegistrationsListComponent implements OnInit {

  registrations: any[] = [];
  loading = false;

  selectedRegistration: any | null = null;

  loadingCarRegistrationsReportId: number | null = null;

  constructor(
    private service: CarRegistrationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.service.getByBusiness().subscribe({
      next: (data) => {
        this.registrations = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load registrations', err);
        this.registrations = [];
        this.loading = false;
      }
    });
  }

  create(): void {
    this.router.navigate(['/business/car-registrations/create']);
  }

  edit(id?: number): void {
    if (!id) return;
    this.router.navigate(['/business/car-registrations/edit', id]);
  }

  delete(id?: number): void {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    this.service.delete(id).subscribe(() => {
      this.load();
    });
  }

  openCarRegistrationsReport(carId?: number): void {
    if (!carId) return;

    this.loadingCarRegistrationsReportId = carId;

    this.service.getCarRegistrationsReport(carId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.loadingCarRegistrationsReportId = null;
      },
      error: (err) => {
        console.error('Failed to generate/open car registrations report', err);
        this.loadingCarRegistrationsReportId = null;
      }
    });
  }
}