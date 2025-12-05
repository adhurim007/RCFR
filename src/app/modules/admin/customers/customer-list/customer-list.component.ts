import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from 'app/services/customer.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

    customers: Customer[] = [];

    constructor(
        private customerService: CustomerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadData();
    }
     
     loadData() {
        this.customerService.getAll().subscribe(res => this.customers = res);
    }

    create() {
        this.router.navigate(['/admin/customers/create']);
    }

    edit(id: number) {
        this.router.navigate(['/admin/customers/edit', id]);
    }

    delete(id: number) {
        if (confirm('A jeni i sigurt që dëshironi të fshini këtë klient?')) {
            this.customerService.delete(id).subscribe(() => this.loadData());
        }
    }

    
}
