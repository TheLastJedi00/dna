import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

function extractMessage(err: HttpErrorResponse): string {
  const serverMsg = err.error?.message ?? err.error;
  if (typeof serverMsg === 'string' && serverMsg.trim()) {
    return serverMsg;
  }
  if (err.status === 0) {
    return 'Sem conexão com o servidor. Tente novamente.';
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/**
 * Exibe os erros HTTP num modal global (ErrorService), substituindo os
 * `alert()` espalhados. Ignora 401 em rotas protegidas — esses são tratados
 * pelo authInterceptor (refresh silencioso / redirect ao login).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.includes('/auth');
      const silent401 = err.status === 401 && !isAuthEndpoint;
      if (!silent401) {
        errorService.show(extractMessage(err));
      }
      return throwError(() => err);
    }),
  );
};
