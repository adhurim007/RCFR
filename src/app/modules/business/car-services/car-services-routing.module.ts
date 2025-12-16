import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarServiceListComponent } from './car-service-list/car-service-list.component';
import { CarServiceFormComponent } from './car-service-form/car-service-form.component';

const routes: Routes = [
  { path: '', component: CarServiceListComponent },
  { path: 'create', component: CarServiceFormComponent },
  { path: 'edit/:id', component: CarServiceFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarServicesRoutingModule {}
