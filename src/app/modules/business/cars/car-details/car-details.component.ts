import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from 'app/services/car.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html'
})
export class CarDetailsComponent implements OnInit {

  car: any;
  loading = true;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      this.router.navigate(['/business/cars']);
      return;
    }

    this.loadDetails();
  }

  loadDetails(): void {
    this.loading = true;

    this.carService.getDetails(this.id).subscribe({
      next: (data) => {
        this.car = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load car details', err);
        this.loading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/business/cars']);
  }
}
