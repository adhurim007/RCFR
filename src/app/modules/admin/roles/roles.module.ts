import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { RoleListComponent } from './role-list.component';
import { RoleCreateDialogComponent } from './role-create/role-create-dialog.component';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: '', component: RoleListComponent }
];

@NgModule({
  declarations: [
    RoleListComponent,
    RoleCreateDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,        // ✅ Required for <mat-dialog-actions>
    MatFormFieldModule,
    MatInputModule
  ]
})
export class RolesModule {}
