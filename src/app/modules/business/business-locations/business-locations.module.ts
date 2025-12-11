import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table'; 
import { businessLocationsRoutes } from './business-locations.routes';
import { BusinessLocationsComponent } from './business-locations.component';
import { BusinessLocationModalComponent } from './business-location-modal.component';

@NgModule({
  declarations: [
    BusinessLocationsComponent,
    BusinessLocationModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule   ,
    RouterModule.forChild(businessLocationsRoutes)
  ]
})
export class BusinessLocationsModule {}
