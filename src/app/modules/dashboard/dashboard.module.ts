import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FuseCardComponent } from '@fuse/components/card';
import { BusinessDashboardComponent } from './business-dashboard.component';
import { dashboardRoutes } from './dashboard.routing';

@NgModule({
  declarations: [
    BusinessDashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FuseCardComponent,
    RouterModule.forChild(dashboardRoutes),

    // Material
    MatButtonModule,
    MatIconModule, 
  ]
})
export class DashboardModule {}
