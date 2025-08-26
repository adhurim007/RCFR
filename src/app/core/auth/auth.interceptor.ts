import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  const token = authService.accessToken;

  // Clone request and add token if available
  let newReq = req;
  if (token) {
    newReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(newReq).pipe(
    catchError((error) => {
      // Auto-logout on 401
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.signOut();
      }
      return throwError(() => error); // ✅ Correct way
    })
  );
};
