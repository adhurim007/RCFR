import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarRegistrationsService } from 'app/services/car-registrations.service';
 
@Component({
    selector: 'app-car-registration-form',
    templateUrl: './car-registration-form.component.html'
})
export class CarRegistrationFormComponent implements OnInit {

    form!: FormGroup;
    cars: any[] = [];
    isEdit = false;
    id!: number;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private service: CarRegistrationsService
    ) {}

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.isEdit = !!this.id;

        this.buildForm();
        this.loadCars();

        if (this.isEdit) {
            this.service.getById(this.id).subscribe(data => {
                this.form.patchValue(data);
            });
        }
    }

    buildForm(): void {
    this.form = this.fb.group({
        id: [0],
        carId: ['', Validators.required],
        registrationNumber: ['', Validators.required],
        issuedDate: ['', Validators.required],
        expiryDate: ['', Validators.required],
        cost: ['', Validators.required],
        insuranceCompany: [''],
        insuranceExpiryDate: [''],
        documentUrl: [''],
        notes: ['']
    });
    }

    loadCars(): void {
        this.service.getCars().subscribe(cars => {
            this.cars = cars ?? [];
        });
    }

    submit(): void {

    console.log('FORM VALUE:', this.form.value);
    console.log('FORM VALID:', this.form.valid);

    Object.keys(this.form.controls).forEach(key => {
        console.log(key, this.form.get(key)?.errors);
    });

    if (this.form.invalid) {
        this.form.markAllAsTouched(); // 👈 SHUMË E RËNDËSISHME
        return;
    }

    if (this.isEdit) {
        this.service.update(this.id, this.form.value).subscribe(() => {
            this.router.navigate(['/business/car-registrations']);
        });
    } else {
        this.service.create(this.form.value).subscribe(() => {
            this.router.navigate(['/business/car-registrations']);
        });
    }
}


    cancel(): void {
        this.router.navigate(['/business/car-registrations']);
    }
}
