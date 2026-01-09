import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleDamagesService } from 'app/services/vehicle-damages.service';

@Component({
  selector: 'app-damage-list',
  templateUrl: './damage-list.component.html'
})
export class DamageListComponent implements OnInit {

  damages: any[] = [];
  displayedColumns = [
    'id',
    'reservationId',
    'damageType',
    'estimatedCost',
    'status',
    'createdAt',
    'actions'
  ];

  constructor(
    private service: VehicleDamagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getList().subscribe(res => {
      this.damages = res;
    });
  }

  create(): void {
    this.router.navigate(['/business/vehicle-damages/create']);
  }

  edit(id: number): void {
    this.router.navigate(['/business/vehicle-damages/edit', id]);
  }

  remove(id: number): void {
    if (!confirm('Delete this damage?')) return;

    this.service.delete(id).subscribe(() => this.load());
  }

  loadingDamageReportId: number | null = null;

  openDamageReport(id: number): void {
    this.loadingDamageReportId = id;

    this.service.getDamageReport(id).subscribe({
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
