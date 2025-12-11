import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'app/services/customer.service';

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

    form!: FormGroup;
    id!: number;
    isEdit = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private service: CustomerService
    ) {}

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.isEdit = !!this.id;

        this.form = this.fb.group({
            id: [0],
            fullName: ['', Validators.required],
            email: ['', Validators.email],
            phoneNumber: ['', Validators.required],
            documentType: ['', Validators.required],
            documentNumber: ['', Validators.required],
            dateOfBirth: [null, Validators.required],
            address: ['']
        });

        if (this.isEdit) {
            this.service.getById(this.id).subscribe((c) => {
             this.form.patchValue({
                ...c,
                dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : null
            }); 
            });
        }
    }

    save() {
        if (this.form.invalid) return;

        const data = this.form.value;

        if (this.isEdit) {
            this.service.update(data).subscribe(() => {
                this.router.navigate(['/admin/customers']);
            });
        } else {
            this.service.create(data).subscribe(() => {
                this.router.navigate(['/admin/customers']);
            });
        }
    }

    cancel() {
        this.router.navigate(['/admin/customers']);
    }
}
