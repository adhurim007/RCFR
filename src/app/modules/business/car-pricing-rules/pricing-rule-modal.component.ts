import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarService } from 'app/services/car.service';
import { CarPricingRuleService } from 'app/services/car-pricing-rule.service';

@Component({
  selector: 'app-pricing-rule-modal',
  templateUrl: './pricing-rule-modal.component.html',
  styleUrls: ['./pricing-rule-modal.component.scss']
})
export class PricingRuleModalComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;

  cars: any[] = [];

  ruleTypes = ['Standard', 'Weekend', 'Discount', 'Seasonal'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private carService: CarService,
    private service: CarPricingRuleService,
    private dialogRef: MatDialogRef<PricingRuleModalComponent>
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      Id: [0],
      carId: [this.data?.rule?.carId ?? '', Validators.required],
      ruleType: [this.data?.rule?.ruleType ?? '', Validators.required],
      pricePerDay: [this.data?.rule?.pricePerDay ?? '', Validators.required],
      fromDate: [this.data?.rule?.fromDate ?? null],
      toDate: [this.data?.rule?.toDate ?? null],
      daysOfWeek: [this.data?.rule?.daysOfWeek?.join(', ') ?? ''],
      description: [this.data?.rule?.description ?? '']
    });

    this.loadCars();

    if (this.data?.rule) {
      this.isEdit = true;
    }
  }

  loadCars(): void {
    this.carService.getAll().subscribe(res => {
      this.cars = res;

      // *** SET VALUE AGAIN AFTER CARS LOAD ***
      if (this.isEdit && this.data?.rule) {
        this.form.get('carId')?.setValue(this.data.rule.carId);
      }
    });
  }

  private buildPayload() {
    const raw = this.form.value;

    const daysOfWeekArray: string[] = raw.daysOfWeek
      ? (Array.isArray(raw.daysOfWeek)
          ? raw.daysOfWeek
          : (raw.daysOfWeek as string)
              .split(',')
              .map((x) => x.trim())
              .filter((x) => !!x))
      : [];

    return {
      id: this.isEdit ? this.data.rule.id : 0,
      carId: +raw.carId,
      ruleType: raw.ruleType,
      pricePerDay: +raw.pricePerDay,
      fromDate: raw.fromDate || null,
      toDate: raw.toDate || null,
      daysOfWeek: daysOfWeekArray,
      description: raw.description || null
    };
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = this.buildPayload();
    console.log('FORM VALUE', payload);

    if (this.isEdit && this.data.rule) {
      this.service
        .update(this.data.rule.id, payload)
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.service
        .create(payload)
        .subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
