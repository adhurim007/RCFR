import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarRegistrationFormComponent } from './car-registration-form/car-registration-form.component';
import { CarRegistrationsListComponent } from './car-registration-list/car-registrations-list.component';

const routes: Routes = [
    { path: '', component: CarRegistrationsListComponent },
    {
        path: 'create',
        component: CarRegistrationFormComponent
    },
    {
        path: 'edit/:id',
        component: CarRegistrationFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CarRegistrationsRoutingModule {}
