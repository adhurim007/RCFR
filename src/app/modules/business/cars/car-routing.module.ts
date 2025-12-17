import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';
import { CarFormComponent } from './car-form/car-form.component';
import { CarDetailsComponent } from './car-details/car-details.component';

const routes: Routes = [
  { path: '', component: CarListComponent },
  { path: 'create', component: CarFormComponent },
  { path: 'edit/:id', component: CarFormComponent },
  { path: ':id/details', component: CarDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule {}
