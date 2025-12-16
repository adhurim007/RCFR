import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarServicesService } from 'app/services/car-services.service'; 
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-car-service-form',
  templateUrl: './car-service-form.component.html',
  styleUrls: ['./car-service-form.component.scss']
})
export class CarServiceFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  id!: number;
  loadingCars = false;
  cars: any[] = []; 
  businessId!: number;

  serviceTypes = [
    { value: 1, label: 'Oil Change' },
    { value: 2, label: 'Major Service' },
    { value: 3, label: 'Tire Change' },
    { value: 4, label: 'Brake Service' },
    { value: 5, label: 'Engine Service' },
    { value: 99, label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: CarServicesService, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.userService.user;
    //this.businessId = user?.businessId;

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;

    this.buildForm();
    this.loadCars();

    if (this.isEdit) {
      this.loadService();
    }
  }

    buildForm(): void {
      this.form = this.fb.group({
        id: [0],
        carId: ['', Validators.required],
        serviceType: ['', Validators.required],
        serviceDate: ['', Validators.required],
        mileage: [''],
        cost: ['', Validators.required],
        serviceCenter: [''],
        nextServiceDate: [''],
        nextServiceMileage: [''],
        notes: ['']
      });
    }

loadCars(): void {
  this.loadingCars = true;

  this.service.getCars().subscribe({
    next: (cars) => {
      this.cars = cars ?? [];
      this.loadingCars = false;
    },
    error: (err) => {
      console.error('Failed to load cars', err);
      this.cars = [];
      this.loadingCars = false;
    }
  });
}

  loadService(): void {
    this.service.getById(this.id).subscribe(data => {
      this.form.patchValue(data);
    });
  }

submit(): void {
  if (this.form.invalid) {
    return;
  }

  if (this.isEdit) {
    this.service.update(this.id, this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/business/car-registrations']);
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  } else {
    this.service.create(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/business/car-registrations']);
      },
      error: (err) => {
        console.error('Create failed', err);
      }
    });
  }
}


  cancel(): void {
    this.router.navigate(['/business/car-services']);
  }
}
