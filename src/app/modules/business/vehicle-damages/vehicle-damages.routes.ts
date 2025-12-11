import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DamageListComponent } from './damage-list/damage-list.component';
import { DamageFormComponent } from './damage-form/damage-form.component';

const routes: Routes = [
    { path: '', component: DamageListComponent },
    { path: 'create', component: DamageFormComponent },
    { path: 'edit/:id', component: DamageFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VehicleDamagesRoutingModule {}
