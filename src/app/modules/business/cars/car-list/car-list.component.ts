import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarService } from 'app/services/car.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  standalone: false,
})
export class CarListComponent implements OnInit {

  cars: any[] = [];
  loading = true;

  // Needed for menu actions (same pattern as reservations)
  selectedCar: any | null = null;

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
      this.cars = [];
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
            this.cars = cars ?? [];
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

  editCar(id?: number): void {
    if (!id) return;
    this.router.navigate(['/business/cars/edit', id]);
  }

  viewDetails(carId?: number): void {
    if (!carId) return;
    this.router.navigate(['/business/cars', carId, 'details']);
  }

  deleteCar(id?: number): void {
    if (!id) return;
    if (!confirm('A je i sigurt që dëshiron ta fshish këtë veturë?')) return;

    this.carService.delete(id).subscribe({
      next: () => this.loadCars()
    });
  }

  toggleAvailability(car: any): void {
    if (!car?.id) return;

    this.carService.setAvailability(car.id, !car.isAvailable).subscribe({
      next: () => {
        car.isAvailable = !car.isAvailable;

        // keep selectedCar in sync in case menu is open
        if (this.selectedCar?.id === car.id) {
          this.selectedCar.isAvailable = car.isAvailable;
        }
      }
    });
  }
}