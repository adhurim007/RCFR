import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { DamageListComponent } from './damage-list/damage-list.component';
import { DamageFormComponent } from './damage-form/damage-form.component';
import { VehicleDamagesRoutingModule } from './vehicle-damages.routes';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    declarations: [
        DamageListComponent,
        DamageFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,

        // ✅ Angular Material
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        VehicleDamagesRoutingModule 
    ]
})
export class VehicleDamagesModule {}
