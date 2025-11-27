import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ExtraServicesService } from 'app/services/extra-services.service';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-extra-service-modal',
    templateUrl: './extra-service-modal.component.html'
})
export class ExtraServiceModalComponent {

    form = this.fb.group({
        id: [0],
        name: ['', Validators.required],
        pricePerDay: [0, Validators.required]
    });

    constructor(
        private fb: FormBuilder,
        private service: ExtraServicesService,
        private dialogRef: MatDialogRef<ExtraServiceModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data.isEdit) {
            this.form.patchValue(data.service);
        }
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const model = {
            id: this.data?.service?.id ?? 0,
            name: this.form.value.name,
            pricePerDay: this.form.value.pricePerDay
        };

        let request$: Observable<any>;

        if (this.data.isEdit) {
            request$ = this.service.update(model);
        } else {
            request$ = this.service.create(model);
        }

        request$.subscribe({
            next: () => {
                this.dialogRef.close(true);   
            },
            error: (err) => {
                console.error("Error saving Extra Service:", err);
            }
        });
    }

     close() {
        this.dialogRef.close(false);
    }

}
