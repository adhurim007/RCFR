import { Component, OnInit } from '@angular/core';
import { VehicleInspectionsService } from '../../../../services/vehicle-inspections.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.component.html'
})
export class InspectionListComponent implements OnInit {

  inspections: any[] = [];
  displayedColumns = ['reservationId', 'type', 'mileage', 'fuelLevel', 'actions'];

  constructor(
    private service: VehicleInspectionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => this.inspections = res);
  }

  create(): void {
      this.router.navigate(['/admin/vehicle-inspections/create']);
  }
 
  edit(id: number): void {
    this.router.navigate(['/admin/vehicle-inspections/edit', id]);
  }

  delete(id: number): void {
    if (!confirm('Delete inspection?')) return;

    this.service.delete(id).subscribe(() => this.load());
  }
}
