import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarLookupService } from 'app/services/car-lookup.service';
import { CarService } from 'app/services/car.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-car-form',
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.scss']
})
export class CarFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  carId!: number;
  businessId!: number;

  brands: any[] = [];
  models: any[] = [];
  types: any[] = [];
  fuels: any[] = [];
  transmissions: any[] = [];

  selectedFiles: File[] = [];
imagePreviews: string[] = [];

  
  constructor(
    private fb: FormBuilder,
    private lookup: CarLookupService,
    private carService: CarService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // =====================================================
  // INIT
  // =====================================================
  ngOnInit(): void {
    this.buildForm();
    this.loadDropdowns();

    // Shiko nëse jemi në CREATE apo EDIT
    this.carId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = this.carId > 0;

    if (this.isEdit) {
      // EDIT – nuk kemi nevojë me marrë biznesin nga useri
      this.loadCarForEdit();
    } else {
      // CREATE – duhet me marrë BusinessId nga useri
      this.loadBusinessForCreate();
    }
  }

  // =====================================================
  // FORM
  // =====================================================
  buildForm(): void {
    this.form = this.fb.group({
      id: [0],
      businessId: ['', Validators.required],
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

  // =====================================================
  // LOAD BUSINESS (vetëm për CREATE)
  // =====================================================
  private loadBusinessForCreate(): void {
    const currentUser = this.userService.getCurrent();
    if (!currentUser) {
      alert('Përdoruesi nuk është gjetur');
      this.router.navigate(['/business/cars']);
      return;
    }

    this.userService.getBusinessId(currentUser.id).subscribe({
      next: (res: any) => {
        if (!res || !res.businessId) {
          alert('Ky përdorues nuk ka biznes të lidhur');
          this.router.navigate(['/business/cars']);
          return;
        }

        this.businessId = res.businessId;
        this.form.patchValue({ businessId: this.businessId });
      },
      error: () => {
        alert('Biznesi nuk u gjet');
        this.router.navigate(['/business/cars']);
      }
    });
  }

  // =====================================================
  // LOAD CAR (vetëm për EDIT)
  // =====================================================
  private loadCarForEdit(): void {
    this.carService.getById(this.carId).subscribe({
      next: (car: any) => {
        if (!car) {
          alert('Veturë nuk u gjet');
          this.router.navigate(['/business/cars']);
          return;
        }

        // Biznesin e marrim nga vetura ekzistuese
        this.businessId = car.businessId;

        // Ngarko modelet për brand-in e veturës
        this.loadModels(car.carBrandId, () => {
          this.form.patchValue({
            id: car.id,
            businessId: car.businessId,
            carBrandId: car.carBrandId,
            carModelId: car.carModelId,
            carTypeId: car.carTypeId,
            fuelTypeId: car.fuelTypeId,
            transmissionId: car.transmissionId,
            licensePlate: car.licensePlate,
            color: car.color,
            dailyPrice: car.dailyPrice,
            description: car.description,
            isAvailable: car.isAvailable
          });
        });
      },
      error: () => {
        alert('Veturë nuk u gjet');
        this.router.navigate(['/business/cars']);
      }
    });
  }

  // =====================================================
  // FILE UPLOAD
  // =====================================================
  onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    this.selectedFiles = [];
    this.imagePreviews = [];
    return;
  }

  // reset
  this.selectedFiles = [];
  this.imagePreviews = [];

  Array.from(input.files).forEach(file => {
    this.selectedFiles.push(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews.push(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}


removeImage(index: number): void {
  this.selectedFiles.splice(index, 1);
  this.imagePreviews.splice(index, 1);
}

  // =====================================================
  // DROPDOWNS
  // =====================================================
  loadDropdowns(): void {
    this.lookup.getBrands().subscribe(x => this.brands = x);
    this.lookup.getCarTypes().subscribe(x => this.types = x);
    this.lookup.getFuelTypes().subscribe(x => this.fuels = x);
    this.lookup.getTransmissions().subscribe(x => this.transmissions = x);
  }

  loadModels(brandId: number, callback?: () => void): void {
    if (!brandId) {
      this.models = [];
      return;
    }

    this.lookup.getModels(brandId).subscribe(x => {
      this.models = x;
      if (callback) callback();
    });
  }

  // =====================================================
  // SAVE
  // =====================================================
  save(): void {
    if (this.form.invalid) return;

    // ============================
    // FormData (për fields + images)
    // ============================
    const formData = new FormData();

    // shto të gjitha fushat e formës
    Object.entries(this.form.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    // sigurohemi që businessId dërgohet gjithmonë
    formData.set('businessId', this.businessId.toString());

    // shto imazhet (opsionale)
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('Images', file);
      });
    }

    // ============================
    // CREATE / UPDATE
    // ============================
    if (this.isEdit) {
      this.carService.update(this.carId, formData).subscribe(() => {
        this.router.navigate(['/business/cars']);
      });
    } else {
      this.carService.create(formData).subscribe(() => {
        this.router.navigate(['/business/cars']);
      });
    }
  }


  private afterSave(carId: number): void {
    if (this.selectedFiles.length) {
      this.carService.uploadImages(carId, this.selectedFiles).subscribe(() => {
        this.router.navigate(['/business/cars']);
      });
    } else {
      this.router.navigate(['/business/cars']);
    }
  }

  // =====================================================
  // CANCEL
  // =====================================================
  cancel(): void {
    this.router.navigate(['/business/cars']);
  }
}
