import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusinessLocationService } from 'app/services/business-location.service';
import { LocationService } from 'app/core/locations/location.service';
import { Observable } from 'rxjs';

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
      businessId: [this.data?.location?.businessId ?? this.data.businessId, Validators.required],
      name: [this.data?.location?.name ?? '', Validators.required],
      address: [this.data?.location?.address ?? ''],
      stateId: [this.data?.location?.stateId ?? null, Validators.required],
      cityId: [this.data?.location?.cityId ?? null, Validators.required]
    });

    this.loadStates();

    // Nëse është EDIT → mbush cities
    if (this.data?.isEdit && this.data.location.stateId) {
      this.loadCities(this.data.location.stateId);
    }
  }

  loadStates(): void {
    this.locationService.getStates().subscribe(res => this.states = res);
  }

  loadCities(stateId: number): void {
    this.locationService.getCities(stateId).subscribe(res => this.cities = res);
  }

  onStateChange(event: any): void {
    const stateId = event.value;
    this.form.patchValue({ cityId: null });
    this.loadCities(stateId);
  }

  save(): void {
    if (this.form.invalid) return;

    const dto = this.form.value;   // mjafton — gjithçka është në form

    let request$: Observable<any> = this.data.isEdit
      ? this.service.update(dto)
      : this.service.create(dto);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Save failed:', err)
    });
  }

  close(): void {
  this.dialogRef.close(false);
}

}
