import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [

  // Redirects
  { path: '', pathMatch: 'full', redirectTo: 'business/reservations' },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'business/reservations' },

  // ================= GUEST =================
  {
    path: '',
    component: LayoutComponent,
    data: { layout: 'empty' },
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    children: [
      { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
      { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
      { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
      { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') }
    ]
  },

  // ================= AUTH EMPTY =================
  {
    path: '',
    component: LayoutComponent,
    data: { layout: 'empty' },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
      { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
    ]
  },

  // ================= MAIN APP SHELL =================
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: { initialData: initialDataResolver },
    children: [

      // ---------- ADMIN ----------
      {
        path: 'admin',
        children: [
          { path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes') },
          { path: 'roles', loadChildren: () => import('app/modules/admin/roles/roles.module').then(m => m.RolesModule) },
          { path: 'menu', loadChildren: () => import('app/modules/admin/menus/menus.module').then(m => m.MenusModule) },
          { path: 'users', loadChildren: () => import('app/modules/admin/user/users.module').then(m => m.UsersModule) },
          
        
          { path: 'carbrands', loadChildren: () => import('app/modules/admin/car-brands/car-brands.module').then(m => m.CarBrandsModule) },
          { path: 'carmodels', loadChildren: () => import('app/modules/admin/car-models/car-models.module').then(m => m.CarModelsModule) },
         
          { path: '', pathMatch: 'full', redirectTo: 'example' }
        ]
      },

      // ---------- BUSINESS ----------
      {
        path: 'business',
        children: [
          { path: 'reservations', loadChildren: () => import('app/modules/business/reservations/reservation.module').then(m => m.ReservationModule) },
          { path: 'customers', loadChildren: () => import('app/modules/business/customers/customer.module').then(m => m.CustomerModule) },
          { path: 'cars', loadChildren: () => import('app/modules/business/cars/car.module').then(m => m.CarModule) },
          { path: 'extra-services', loadChildren: () => import('app/modules/business/extra-services/extra-services.module').then(m => m.ExtraServicesModule) },
          { path: 'business-locations', loadChildren: () => import('app/modules/business/business-locations/business-locations.module').then(m => m.BusinessLocationsModule) },
          { path: 'vehicle-inspections', loadChildren: () => import('app/modules/business/vehicle-inspections/vehicle-inspections.module').then(m => m.VehicleInspectionsModule) },
          {
            path: 'vehicle-damages',
            loadChildren: () =>
              import('app/modules/business/vehicle-damages/vehicle-damages.module')
                .then(m => m.VehicleDamagesModule)
          },
          { path: 'car-pricing-rules', loadChildren: () => import('app/modules/business/car-pricing-rules/car-pricing-rules.module').then(m => m.CarPricingRulesModule) },
          { path: 'car-services', loadChildren: () => import('app/modules/business/car-services/car-services.module').then(m => m.CarServicesModule) },
          { path: 'car-registrations', loadChildren: () => import('app/modules/business/car-registrations/car-registrations.module').then(m => m.CarRegistrationsModule) },
          { path: '', pathMatch: 'full', redirectTo: 'reservations' }
        ]
      }
    ]
  },

  
];
