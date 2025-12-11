import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { extraServicesRoutes } from './extra-services.routes';
import { ExtraServicesListComponent } from './extra-services-list/extra-services-list.component';
import { ExtraServiceModalComponent } from './extra-service-modal/extra-service-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        ExtraServicesListComponent,
        ExtraServiceModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        RouterModule.forChild(extraServicesRoutes)
    ]
})
export class ExtraServicesModule { }
