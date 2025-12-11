import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { UserService } from 'app/core/user/user.service';

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
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.loading = true;

    const currentUser = this.userService.getCurrent();
    if (!currentUser) {
      this.loading = false;
      return;
    }

    this.userService.getBusinessId(currentUser.id).subscribe({
      next: (res: any) => {
        const businessId = res?.businessId;
        if (!businessId) {
          this.cars = [];
          this.loading = false;
          return;
        }

        this.carService.getByBusiness(businessId).subscribe({
          next: (cars) => {
            this.cars = cars;
            this.loading = false;
          },
          error: () => {
            this.cars = [];
            this.loading = false;
          }
        });
      },
      error: () => {
        this.cars = [];
        this.loading = false;
      }
    });
  }

  // ----------------- actions -----------------

  createCar(): void {
    this.router.navigate(['/business/cars/create']);
  }

  editCar(id: number): void {
    this.router.navigate(['/business/cars/edit', id]);
  }

  addDetails(id: number): void {
    this.router.navigate(['/business/cars/details', id]);
  }

  deleteCar(id: number): void {
    if (!confirm('A je i sigurt që dëshiron ta fshish këtë veturë?')) return;

    this.carService.delete(id).subscribe(() => {
      this.loadCars();
    });
  }

  toggleAvailability(car: any): void {
    this.carService.setAvailability(car.id, !car.isAvailable).subscribe(() => {
      car.isAvailable = !car.isAvailable;
    });
  }
}
