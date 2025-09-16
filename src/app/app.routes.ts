import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { RoleGuard } from './core/auth/guards/role.guard';

export const appRoutes: Route[] = [
  // Redirects
  { path: '', pathMatch: 'full', redirectTo: 'admin/example' },
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'admin/example' },

   
  // Guest auth (empty layout)
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: { layout: 'empty' },
    children: [
      { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
      { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
      { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
      { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
      { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
    ]
  },

  // Auth-only (empty layout)
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: { layout: 'empty' },
    children: [
      { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
      { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
    ]
  },

  // Optional landing (empty layout)
  {
    path: '',
    component: LayoutComponent,
    data: { layout: 'empty' },
    children: [{ path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') }]
  },

  // === MAIN APP SHELL (keeps sidebar/topbar) ===
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,                // ⬅️ not 'empty' here
    resolve: { initialData: initialDataResolver },
    children: [
      {
        path: 'admin',
        children: [
          { path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes') },
          {
            path: 'roles',
            loadChildren: () => import('app/modules/admin/roles/roles.module').then(m => m.RolesModule),
            // canActivate: [RoleGuard],
            // data: { roles: ['SuperAdmin'] }
          },
          {
            path: 'menus',
            loadChildren: () => import('app/modules/admin/menus/menus.module').then(m => m.MenusModule),
            canActivate: [RoleGuard],
            data: { roles: ['SuperAdmin'] }
          },
          {
            path: 'users',
            loadChildren: () => import('app/modules/admin/user/users.module').then(m => m.UsersModule),
            // canActivate: [RoleGuard],
            // data: { roles: ['SuperAdmin'] }
          },
          { path: '', pathMatch: 'full', redirectTo: 'example' }
        ] 
      }, 
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'admin/example' }
];
