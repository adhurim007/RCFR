import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { InspectionFormComponent } from './inspection-form/inspection-form.component';

const routes: Routes = [
    { path: '', component: InspectionListComponent },
    { path: 'create', component: InspectionFormComponent },
    { path: 'edit/:id', component: InspectionFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VehicleInspectionsRoutingModule {}
