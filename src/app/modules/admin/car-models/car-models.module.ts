import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { carModelsRoutes } from './car-models.routes';
import { CarModelsListComponent } from './car-models-list/car-models-list.component';
import { CarModelModalComponent } from './car-model-modal/car-model-modal.component';

@NgModule({
    declarations: [
        CarModelsListComponent,
        CarModelModalComponent
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
        MatSelectModule,

        RouterModule.forChild(carModelsRoutes)
    ]
})
export class CarModelsModule {}
