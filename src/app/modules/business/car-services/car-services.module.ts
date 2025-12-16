import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CarServicesRoutingModule } from './car-services-routing.module';
import { CarServiceListComponent } from './car-service-list/car-service-list.component';
import { CarServiceFormComponent } from './car-service-form/car-service-form.component';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [
    CarServiceListComponent,
    CarServiceFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CarServicesRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule, 
    MatMenuModule
  ]
})
export class CarServicesModule {}
