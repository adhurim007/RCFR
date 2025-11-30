import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { vehicleInspectionsRoutes } from './vehicle-inspections.routes';
import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { InspectionFormComponent } from './inspection-form/inspection-form.component';
import { MatIcon } from '@angular/material/icon';
@NgModule({
  declarations: [
    InspectionListComponent,
    InspectionFormComponent
  ],
  imports: [
     CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatIcon
  ]
})
export class VehicleInspectionsModule {}
