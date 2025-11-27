import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarBrandsService } from 'app/services/car-brands.service';
import { CarBrand } from 'app/models/car-brand.model';

@Component({
    selector: 'app-car-brand-modal',
    templateUrl: './car-brand-modal.component.html'
})
export class CarBrandModalComponent {
    form: FormGroup;
    isEdit = false;
    brand!: CarBrand;

    constructor(
        private fb: FormBuilder,
        private service: CarBrandsService,
        public dialogRef: MatDialogRef<CarBrandModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.isEdit = data.isEdit;

        this.form = this.fb.group({
            name: ['', Validators.required]
        });

        if (this.isEdit && data.brand) {
            this.brand = data.brand;
            this.form.patchValue({
                name: data.brand.name
            });
        }
    }

    save(): void {
        const value = this.form.value;

        if (this.isEdit) {
            const model: CarBrand = {
                id: this.brand.id,
                name: value.name
            };

            this.service.update(model).subscribe(() => this.dialogRef.close(true));
        } else {
            this.service.create(value).subscribe(() => this.dialogRef.close(true));
        }
    }
}
