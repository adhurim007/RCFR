import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessLocationService } from 'app/services/business-location.service';
import { LocationService } from 'app/core/locations/location.service';

@Component({
  selector: 'app-business-location-modal',
  templateUrl: './business-location-modal.component.html'
})
export class BusinessLocationModalComponent implements OnInit {

  form!: FormGroup;
  states: any[] = [];
  cities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BusinessLocationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: BusinessLocationService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data?.location?.id ?? 0],
      name: [this.data?.location?.name ?? '', Validators.required],
      address: [this.data?.location?.address ?? ''],
      stateId: [this.data?.location?.stateId ?? null, Validators.required],
      cityId: [this.data?.location?.cityId ?? null, Validators.required],
       businessId: this.data.businessId
    });

    this.loadStates();

    if (this.data?.isEdit && this.data.location?.stateId) {
      this.loadCities(this.data.location.stateId);
    }
  }

  loadStates(): void {
    this.locationService.getStates()
      .subscribe(res => this.states = res);
  }

  loadCities(stateId: number): void {
    this.locationService.getCities(stateId)
      .subscribe(res => this.cities = res);
  }

  onStateChange(event: any): void {
    const stateId = event.value;
    this.form.patchValue({ cityId: null });
    this.loadCities(stateId);
  }

  save(): void {
    if (this.form.invalid) return;

    const dto = {
      id: this.form.value.id,
      name: this.form.value.name,
      address: this.form.value.address,
      stateId: this.form.value.stateId,
      cityId: this.form.value.cityId,
      businessId: this.data.businessId   // ✅ KRYESORE
    };

    const req$ = this.data.isEdit
      ? this.service.update(dto)
      : this.service.create(dto);

    req$.subscribe(() => this.dialogRef.close(true));
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
