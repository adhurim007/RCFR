import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule  } from '@angular/material/menu';
import { CarRoutingModule } from './car-routing.module';
import { CarListComponent } from './car-list/car-list.component';
import { CarFormComponent } from './car-form/car-form.component';

@NgModule({
  declarations: [
    CarListComponent,
    CarFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    // Material modules
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatMenuModule ,
    CarRoutingModule
  ]
})
export class CarModule {}
