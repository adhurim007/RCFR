import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { carBrandsRoutes } from './car-brands.routes';
import { CarBrandsListComponent } from './car-brands-list/car-brands-list.component';
import { CarBrandModalComponent } from './car-brand-modal/car-brand-modal.component';

@NgModule({
    declarations: [
        CarBrandsListComponent,
        CarBrandModalComponent
    ],
imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    RouterModule.forChild(carBrandsRoutes)
]
})
export class CarBrandsModule {}
