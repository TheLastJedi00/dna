import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { LoginService } from '../services/login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const login = inject(LoginService);
  const router = inject(Router);

  const token = login.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  const isAuthEndpoint = req.url.includes('/auth');

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || isAuthEndpoint) {
        return throwError(() => err);
      }
      // 401 numa rota protegida: tenta renovar uma vez e refaz a requisição.
      if (login.getRefreshToken()) {
        return login.refreshTokens().pipe(
          switchMap((tokens) =>
            next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${tokens.access_token}` },
              }),
            ),
          ),
          catchError((refreshErr) => {
            login.clearSession();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          }),
        );
      }
      login.clearSession();
      router.navigate(['/login']);
      return throwError(() => err);
    }),
  );
};
