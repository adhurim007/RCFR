import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as Array<string>;
    const user = this.authService.getUser(); // implement in AuthService
    if (user && allowedRoles.includes(user.role)) {
      return true;
    }
    this.router.navigate(['/']); // redirect to home if unauthorized
    return false;
  }
}
