import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarServicesService } from 'app/services/car-services.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-car-service-list',
  templateUrl: './car-service-list.component.html',
  styleUrls: ['./car-service-list.component.scss']
})
export class CarServiceListComponent implements OnInit {

  services: any[] = [];
  loading = false;
  businessId!: number;

  constructor(
    private service: CarServicesService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.userService.user;
    //this.businessId = user?.businessId;

    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;

    this.service.getByBusiness().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: () => {
        this.services = [];
        this.loading = false;
      }
    });
  }

  create(): void {
    this.router.navigate(['/business/car-services/create']);
  }

  edit(id: number): void {
    this.router.navigate(['/business/car-services/edit', id]);
  }

  delete(id: number): void {
    if (!confirm('Are you sure you want to delete this service?')) return;

    this.service.delete(id).subscribe(() => {
      this.loadServices();
    });
  }
}
