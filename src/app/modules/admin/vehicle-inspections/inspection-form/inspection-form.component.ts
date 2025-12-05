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
  id!: number;
  isEdit = false;

  reservations: any[] = []; // dropdown list

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

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.id;

    this.buildForm();
    this.loadReservations();

    if (this.isEdit) {
      this.service.getById(this.id).subscribe(x => this.form.patchValue(x));
    }
  }

  loadReservations(): void {
    this.reservationService.getAll().subscribe(r => this.reservations = r);
  }

  buildForm(): void {
    this.form = this.fb.group({
      id: [0],
      reservationId: [null, Validators.required],
      type: [null, Validators.required],
      mileage: [0, Validators.required],
      fuelLevel: [0, Validators.required],
      tireCondition: [''],
      overallCondition: ['']
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const req = this.isEdit
      ? this.service.update(this.form.value)
      : this.service.create(this.form.value);

    req.subscribe(() => this.router.navigate(['/admin/vehicle-inspections']));
  }

  cancel(): void {
    this.router.navigate(['/admin/vehicle-inspections']);
  }
}
