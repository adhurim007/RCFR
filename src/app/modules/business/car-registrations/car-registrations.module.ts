import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CarRegistrationsRoutingModule } from './car-registrations.routing'
import { CarRegistrationsListComponent } from './car-registration-list/car-registrations-list.component'
import { CarRegistrationFormComponent } from './car-registration-form/car-registration-form.component';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    CarRegistrationsListComponent,
    CarRegistrationFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // ✅ KJO E RREGULLON ERRORIN
    CarRegistrationsRoutingModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class CarRegistrationsModule {}
