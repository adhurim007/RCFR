import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.check().pipe(
    map((authenticated) => {
      if (!authenticated) {
        router.navigate(['sign-in']);
        return false;
      }
      return true; // allow access to admin routes
    })
  );
};
