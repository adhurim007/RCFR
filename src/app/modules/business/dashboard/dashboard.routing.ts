import { Route } from '@angular/router';
import { BusinessDashboardComponent } from './business-dashboard.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: BusinessDashboardComponent
  }
];