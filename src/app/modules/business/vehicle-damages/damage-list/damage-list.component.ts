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
}
