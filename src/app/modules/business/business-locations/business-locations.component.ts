import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessLocationService } from 'app/services/business-location.service';
import { BusinessLocationModalComponent } from './business-location-modal.component';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-business-locations',
  templateUrl: './business-locations.component.html'
})
export class BusinessLocationsComponent implements OnInit {

  locations: any[] = [];
  businessId!: number;

  displayedColumns: string[] = ['name', 'address', 'state', 'city', 'actions'];

  constructor(
    private service: BusinessLocationService,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const user = this.userService.getCurrent();
    if (!user) return;

    this.userService.getBusinessId(user.id).subscribe(res => {
      this.businessId = res.businessId;
      this.load();
    });
  }

  load(): void {
    this.service.getByBusinessId(this.businessId)
      .subscribe(res => this.locations = res);
  }

  openCreate(): void {
    const ref = this.dialog.open(BusinessLocationModalComponent, {
      width: '550px',
      data: {
        isEdit: false,
        businessId: this.businessId     // ✅ KRYESORE
      }
    });

    ref.afterClosed().subscribe(r => r && this.load());
  }

  openEdit(item: any): void {
    const ref = this.dialog.open(BusinessLocationModalComponent, {
      width: '550px',
      data: {
        isEdit: true,
        location: item,
        businessId: this.businessId    // ✅ KRYESORE
      }
    });

    ref.afterClosed().subscribe(r => r && this.load());
  }

  delete(id: number): void {
    if (!confirm('Delete this location?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
