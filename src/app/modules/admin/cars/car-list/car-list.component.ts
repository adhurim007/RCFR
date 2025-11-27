import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from '../../../../services/car.service'

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {

  displayedColumns: string[] = [
    'brand',
    'model',
    'plate',
    'price',
    'availability',
    'actions'
  ];

  cars: any[] = [];
  loading = true;

  constructor(
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }


  loadCars() {
    this.loading = true;
    this.carService.getAll().subscribe({
      next: (res) => {
        this.cars = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createCar() {
      this.router.navigate(['/admin/cars/create']);
  }

  create() {
    this.router.navigate(['/admin/cars/create']);
  }

  edit(id: number) {
    this.router.navigate(['/admin/cars/edit', id]);
  }

  delete(id: number) {
    if (!confirm('Are you sure you want to delete this car?')) return;

    this.carService.delete(id).subscribe(() => {
      this.loadCars();
    });
  }

  toggleAvailability(car: any) {
    this.carService.setAvailability(car.id, !car.isAvailable).subscribe(() => {
      car.isAvailable = !car.isAvailable;
    });
  }
}
