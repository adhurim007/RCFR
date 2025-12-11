import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleInspectionsService } from '../../../../services/vehicle-inspections.service';
import { ReservationService } from '../../../../services/reservations.service';

@Component({
  selector: 'app-inspection-form',
  templateUrl: './inspection-form.component.html'
})
export class InspectionFormComponent implements OnInit {

  form!: FormGroup;
  id = 0;
  isEdit = false;

  reservations: any[] = [];
  selectedImages: File[] = [];
  existingImages: string[] = [];
  types = [
    { value: 1, label: 'Check-in (Pre-rental)' },
    { value: 2, label: 'Check-out (Post-rental)' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: VehicleInspectionsService,
    private reservationService: ReservationService
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = this.id > 0;

    this.buildForm();
    this.loadReservations();

    if (this.isEdit) {
    this.service.getById(this.id).subscribe(res => {
      this.form.patchValue({
        reservationId: res.reservationId,
        type: res.type,
        mileage: res.mileage,
        fuelLevel: res.fuelLevel,
        tireCondition: res.tireCondition,
        overallCondition: res.overallCondition
      });

      // ✅ existing images
      this.existingImages = res.photos || [];
    });
  }
  }

  // ================= FORM =================
  buildForm(): void {
    this.form = this.fb.group({
      reservationId: [null, Validators.required],
      type: [null, Validators.required],
      mileage: [0, Validators.required],
      fuelLevel: [0, Validators.required],
      tireCondition: [''],
      overallCondition: ['']
    });
  }

  // ================= RESERVATIONS =================
  loadReservations(): void {
    this.reservationService.getByBusiness().subscribe(res => {
      this.reservations = res;
    });
  }

  // ================= FILE UPLOAD =================
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      this.selectedImages.push(files[i]);
    }

    event.target.value = ''; 
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  // ================= SAVE =================
save(): void {
  if (this.form.invalid) return;

  const formData: globalThis.FormData = new globalThis.FormData();

  Object.entries(this.form.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as any);
    }
  });

  this.selectedImages.forEach((file: File) => {
    formData.append('photos', file, file.name);
  });

  const req = this.isEdit
    ? this.service.update(this.id, formData)
    : this.service.create(formData);

  req.subscribe(() => {
    this.router.navigate(['/business/vehicle-inspections']);
  });
}


  // ================= CANCEL =================
  cancel(): void {
    this.router.navigate(['/business/vehicle-inspections']);
  }
}
