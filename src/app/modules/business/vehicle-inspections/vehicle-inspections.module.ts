import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { VehicleInspectionsRoutingModule } from './vehicle-inspections.routes';
import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { InspectionFormComponent } from './inspection-form/inspection-form.component';
import { TranslocoModule } from '@ngneat/transloco';

 
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
@NgModule({
  declarations: [
    InspectionListComponent,
    InspectionFormComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    // MATERIAL
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,

    // ❗❗ MË E RËNDËSISHMJA ❗❗
    VehicleInspectionsRoutingModule
  ]
})
export class VehicleInspectionsModule {}
