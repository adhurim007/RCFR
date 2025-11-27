import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessLocationService } from 'app/services/business-location.service';
import { BusinessLocationModalComponent } from './business-location-modal.component';

@Component({
  selector: 'app-business-locations',
  templateUrl: './business-locations.component.html'
})
export class BusinessLocationsComponent implements OnInit {

  businessId!: number;
  locations: any[] = [];
  isAdmin = true;

  displayedColumns: string[] = ['name', 'address', 'state', 'city', 'actions'];

  constructor(
    private service: BusinessLocationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.businessId = Number(localStorage.getItem('businessId'));
    //this.isAdmin = localStorage.getItem('role') === 'SuperAdmin';
    this.load();
  }

  load(): void {
    if (this.isAdmin) {
      this.service.getAll().subscribe(res => this.locations = res);
    } else {
      this.service.getByBusinessId(this.businessId).subscribe(res => this.locations = res);
    }
  }

  openCreate(): void {
    const ref = this.dialog.open(BusinessLocationModalComponent, {
      width: '550px',
      data: { isEdit: false, businessId: this.businessId }
    });
    ref.afterClosed().subscribe(r => r && this.load());
  }

openEdit(item: any): void {
  const ref = this.dialog.open(BusinessLocationModalComponent, {
    width: '550px',
    data: { 
      isEdit: true,
      location: item,
      businessId: this.businessId    //  ✅ SHTOJE KËTË
    }
  });

  ref.afterClosed().subscribe(r => r && this.load());
}

  delete(id: number): void {
    if (!confirm('Delete this location?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
