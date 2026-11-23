import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { LoginService } from '../services/login.service';

/** Injeta o ID token do Firebase em toda requisição à API. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const login = inject(LoginService);
  const router = inject(Router);

  return from(login.getIdToken()).pipe(
    switchMap((token) =>
      next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req),
    ),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        login.clearSession();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
