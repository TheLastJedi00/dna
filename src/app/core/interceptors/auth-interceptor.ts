import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { LoginService } from '../services/login.service';

function withToken<T>(req: HttpRequest<T>, token: string | null): HttpRequest<T> {
  return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
}

/**
 * Injeta o **ID token do Firebase** em toda requisição à API. O SDK renova o
 * token sozinho; num 401 (token revogado ou vencido no meio do caminho) há
 * **uma** nova tentativa com um token forçadamente renovado. Se falhar de
 * novo, a sessão é encerrada e a pessoa volta ao login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const login = inject(LoginService);
  const router = inject(Router);

  const endSession = (err: unknown) => {
    login.clearSession();
    router.navigate(['/login']);
    return throwError(() => err);
  };

  return from(login.getIdToken()).pipe(
    switchMap((token) => next(withToken(req, token))),
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) {
        return throwError(() => err);
      }
      return from(login.getIdToken(true)).pipe(
        switchMap((fresh) => (fresh ? next(withToken(req, fresh)) : endSession(err))),
        catchError((retryErr: HttpErrorResponse) =>
          retryErr.status === 401 || !(retryErr instanceof HttpErrorResponse)
            ? endSession(retryErr)
            : throwError(() => retryErr),
        ),
      );
    }),
  );
};
