import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';  // ✅ add this
import { MatIconModule } from '@angular/material/icon';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { MenuListComponent } from './menu-list.component';   // ✅ add this
import { MenusRoutingModule } from './menus-routing.module';

@NgModule({
  declarations: [
    MenuFormComponent,
    MenuListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,      // ✅ add dialog module
    MenusRoutingModule,
    MatIconModule,  
  ]
})
export class MenusModule {}
