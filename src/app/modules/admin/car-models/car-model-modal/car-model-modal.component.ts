import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarModelsService } from 'app/services/car-models.service';
import { CarBrandsService } from 'app/services/car-brands.service';
import { CarBrand } from 'app/models/car-brand.model';

@Component({
    selector: 'app-car-model-modal',
    templateUrl: './car-model-modal.component.html'
})
export class CarModelModalComponent implements OnInit {

    form: FormGroup;
    isEdit = false;
    model: any;
    brands: CarBrand[] = [];

    constructor(
        private fb: FormBuilder,
        private service: CarModelsService,
        private brandService: CarBrandsService,
        public dialogRef: MatDialogRef<CarModelModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.isEdit = data.isEdit;
        this.model = data.model;

        this.form = this.fb.group({
            name: ['', Validators.required],
            carBrandId: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.brandService.getAll().subscribe(b => this.brands = b);

        if (this.isEdit && this.model) {
            this.form.patchValue({
                name: this.model.name,
                carBrandId: this.model.carBrandId
            });
        }
    }

    save(): void {
        if (this.isEdit) {
            const updated = {
                id: this.model.id,
                ...this.form.value
            };
            this.service.update(updated).subscribe(() => this.dialogRef.close(true));
        } else {
            this.service.create(this.form.value)
                .subscribe(() => this.dialogRef.close(true));
        }
    }
}
