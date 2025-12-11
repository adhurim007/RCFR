import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDamagesService } from 'app/services/vehicle-damages.service';
import { ReservationService } from 'app/services/reservations.service';

@Component({
  selector: 'app-damage-form',
  templateUrl: './damage-form.component.html'
})
export class DamageFormComponent implements OnInit {

  form!: FormGroup;
  id!: number;
  isEdit = false;

  reservations: any[] = [];
  selectedImages: File[] = [];
  existingImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: VehicleDamagesService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;

    this.buildForm();
    this.loadReservations();

    if (this.isEdit) {
      this.service.getById(this.id).subscribe(res => {
        this.form.patchValue(res);
        this.existingImages = res.photos || [];
      });
    }
  }

  damageTypes = [
    { value: 'Scratch', label: 'Scratch' },
    { value: 'Dent', label: 'Dent' },
    { value: 'Broken Glass', label: 'Broken Glass' },
    { value: 'Paint Damage', label: 'Paint Damage' },
    { value: 'Interior Damage', label: 'Interior Damage' },
    { value: 'Other', label: 'Other' }
];

  buildForm(): void {
    this.form = this.fb.group({
        id: [0],
        reservationId: [null, Validators.required],
        damageType: [null, Validators.required],
        estimatedCost: [0, Validators.required],
        status: [1, Validators.required],
        description: ['']
    });
  }

  loadReservations(): void {
    this.reservationService
      .getByBusiness()
      .subscribe(r => (this.reservations = r));
  }

  onFilesSelected(event: any): void {
    Array.from(event.target.files)
      .forEach((f: any) => this.selectedImages.push(f));
    event.target.value = '';
  }

  removeImage(i: number): void {
    this.selectedImages.splice(i, 1);
  }

  save(): void {
    if (this.form.invalid) return;

    const formData = new FormData();

    Object.entries(this.form.value).forEach(([k, v]) => {
      if (v !== null) formData.append(k, v as any);
    });

    this.selectedImages.forEach(f =>
      formData.append('photos', f, f.name)
    );

    const req = this.isEdit
      ? this.service.update(this.id, formData)
      : this.service.create(formData);

     if (this.isEdit) {
        this.service.update(this.id, formData)
            .subscribe(() => {
            this.router.navigate(['/business/vehicle-damages']);
            });
        } else {
        this.service.create(formData)
            .subscribe(() => {
            this.router.navigate(['/business/vehicle-damages']);
            });
        }
  }

  cancel(): void {
    this.router.navigate(['/business/vehicle-damages']);
  }
}
