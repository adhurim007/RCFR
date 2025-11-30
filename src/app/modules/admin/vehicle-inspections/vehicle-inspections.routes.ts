import { Route } from '@angular/router';
import { InspectionListComponent } from './inspection-list/inspection-list.component';
import { InspectionFormComponent } from './inspection-form/inspection-form.component';

export const vehicleInspectionsRoutes: Route[] = [
    {
        path: '',
        component: InspectionListComponent
    },
    {
        path: 'create/:reservationId',
        component: InspectionFormComponent
    },
    {
        path: 'edit/:id',
        component: InspectionFormComponent
    }
];
