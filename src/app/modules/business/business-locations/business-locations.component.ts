import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessLocationService } from 'app/services/business-location.service';
import { BusinessLocationModalComponent } from './business-location-modal.component';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-business-locations',
  templateUrl: './business-locations.component.html',
  standalone: false,
})
export class BusinessLocationsComponent implements OnInit {

  locations: any[] = [];
  businessId!: number;
  loading = false;

  selectedLocation: any | null = null;

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
    this.loading = true;

    this.service.getByBusinessId(this.businessId)
      .subscribe({
        next: (res) => {
          this.locations = res ?? [];
          this.loading = false;
        },
        error: () => {
          this.locations = [];
          this.loading = false;
        }
      });
  }

  openCreate(): void {
    const ref = this.dialog.open(BusinessLocationModalComponent, {
      width: '550px',
      data: {
        isEdit: false,
        businessId: this.businessId
      }
    });

    ref.afterClosed().subscribe(r => r && this.load());
  }

  openEdit(item?: any): void {
    if (!item) return;

    const ref = this.dialog.open(BusinessLocationModalComponent, {
      width: '550px',
      data: {
        isEdit: true,
        location: item,
        businessId: this.businessId
      }
    });

    ref.afterClosed().subscribe(r => r && this.load());
  }

  delete(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this location?')) return;

    this.service.delete(id).subscribe(() => this.load());
  }
}