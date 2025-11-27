import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarLookupService } from '../../../../services/car-lookup.service';
import { CarService } from '../../../../services/car.service';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  carId!: number;

  brands: any[] = [];
  models: any[] = [];
  types: any[] = [];
  fuels: any[] = [];
  transmissions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private lookup: CarLookupService,   // ⬅️ New service for dropdowns
    private carService: CarService,      // CRUD for cars
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.buildForm();
    this.loadDropdowns();

    this.carId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.carId) {
      this.isEdit = true;

      this.carService.getById(this.carId).subscribe(car => {

        this.loadModels(car.carBrandId, () => {
            this.form.patchValue(car);
        });

      });
    }
  }

  selectedFiles: File[] = [];

onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    this.selectedFiles = [];
    return;
  }
  this.selectedFiles = Array.from (input.files);
}
 
  buildForm(): void {
       this.form = this.fb.group({
        id: [0], 
        businessId: [2, Validators.required],
        carBrandId: ['', Validators.required],
        carModelId: ['', Validators.required],
        carTypeId: ['', Validators.required],
        fuelTypeId: ['', Validators.required],
        transmissionId: ['', Validators.required],
        licensePlate: ['', Validators.required],
        color: [''], 
        dailyPrice: ['', Validators.required],
        description: [''],
        isAvailable: [true]  
    });
  }
 
  loadDropdowns() {
    this.lookup.getBrands().subscribe(x => this.brands = x);
    this.lookup.getCarTypes().subscribe(x => this.types = x);
    this.lookup.getFuelTypes().subscribe(x => this.fuels = x);
    this.lookup.getTransmissions().subscribe(x => this.transmissions = x);
  }

  loadModels(brandId: number, callback?: () => void) {
    this.lookup.getModels(brandId).subscribe(x => {
      this.models = x;

      if (callback) callback();
    });
  }

save() {
  if (this.form.invalid) return;

  const payload = this.form.value;
  payload.imageUrl = '';
  if (this.isEdit) {
    this.carService.update(this.carId, payload).subscribe(() => {
      if (this.selectedFiles.length) {
        this.carService.uploadImages(this.carId, this.selectedFiles).subscribe(() => {
          this.router.navigate(['/admin/cars']);
        });
      } else {
        this.router.navigate(['/admin/cars']);
      }
    });
  } else {
    this.carService.create(payload).subscribe((newId: number) => {
      if (this.selectedFiles.length) {
        this.carService.uploadImages(newId, this.selectedFiles).subscribe(() => {
          this.router.navigate(['/admin/cars']);
        });
      } else {
        this.router.navigate(['/admin/cars']);
      }
    });
  }
}


cancel(): void {
  this.router.navigate(['/admin/cars']);
}
}
