import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuListComponent } from './menu-list.component';
import { MenuFormComponent } from './menu-form/menu-form.component';

const routes: Routes = [
  { path: '', component: MenuListComponent },         // ✅ default route
  { path: 'create', component: MenuFormComponent },
  { path: 'edit/:id', component: MenuFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule {}
