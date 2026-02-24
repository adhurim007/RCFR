import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleDamagesService } from 'app/services/vehicle-damages.service';

@Component({
  selector: 'app-damage-list',
  templateUrl: './damage-list.component.html',
  standalone: false,
})
export class DamageListComponent implements OnInit {

  damages: any[] = [];
  loading = false;

  selectedDamage: any | null = null;

  loadingDamageReportId: number | null = null;

  constructor(
    private service: VehicleDamagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.service.getList().subscribe({
      next: (res) => {
        this.damages = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.damages = [];
        this.loading = false;
      }
    });
  }

  create(): void {
    this.router.navigate(['/business/vehicle-damages/create']);
  }

  edit(id?: number): void {
    if (!id) return;
    this.router.navigate(['/business/vehicle-damages/edit', id]);
  }

  remove(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this damage?')) return;

    this.service.delete(id).subscribe(() => this.load());
  }

  openDamageReport(reservationId?: number): void {
    if (!reservationId) return;

    this.loadingDamageReportId = reservationId;

    this.service.getDamageReport(reservationId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.loadingDamageReportId = null;
      },
      error: (err) => {
        console.error('Failed to generate/open damage report', err);
        this.loadingDamageReportId = null;
      }
    });
  }
}