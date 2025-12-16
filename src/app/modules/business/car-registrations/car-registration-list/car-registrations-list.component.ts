import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarRegistrationsService } from 'app/services/car-registrations.service';

@Component({
    selector: 'app-car-registrations-list',
    templateUrl: './car-registrations-list.component.html'
})
export class CarRegistrationsListComponent implements OnInit {

    registrations: any[] = [];
    loading = false;

    constructor(
        private service: CarRegistrationsService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading = true;

        this.service.getByBusiness().subscribe({
            next: (data) => {
                this.registrations = data ?? [];
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load registrations', err);
                this.registrations = [];
                this.loading = false;
            }
        });
    }

    create(): void {
        this.router.navigate(['/business/car-registrations/create']);
    }

    edit(id: number): void {
        this.router.navigate(['/business/car-registrations/edit', id]);
    }

    delete(id: number): void {
        if (!confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        this.service.delete(id).subscribe(() => {
            this.load();
        });
    }
}
