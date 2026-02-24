import { Component, OnInit } from '@angular/core';
import { VehicleInspectionsService } from '../../../../services/vehicle-inspections.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html',
  standalone: false,
})
export class InspectionListComponent implements OnInit {

  inspections: any[] = [];
  loading = false;

  selectedInspection: any | null = null;

  constructor(
    private service: VehicleInspectionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (res) => {
        this.inspections = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.inspections = [];
        this.loading = false;
      }
    });
  }

  create(): void {
    this.router.navigate(['/business/vehicle-inspections/create']);
  }

  edit(id?: number): void {
    if (!id) return;
    this.router.navigate(['/business/vehicle-inspections/edit', id]);
  }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm('Delete inspection?')) return;

    this.service.delete(id).subscribe(() => this.load());
  }
}