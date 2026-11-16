import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { httpErrorMessage } from '../utils/http-error-message';

/**
 * Se o erro desta requisição abre o modal global.
 *
 * `null` (padrão) = decidir pelo método: **leituras (`GET`) não abrem** — a tela
 * mostra o erro inline, no lugar do skeleton, com "Tentar novamente"; **ações**
 * (`POST`/`PATCH`/`PUT`/`DELETE`) abrem. Passe `true`/`false` para forçar.
 */
export const SHOW_ERROR_MODAL = new HttpContextToken<boolean | null>(() => null);

function shouldShowModal(req: HttpRequest<unknown>): boolean {
  const explicit = req.context.get(SHOW_ERROR_MODAL);
  if (explicit !== null) return explicit;
  return req.method !== 'GET';
}

/**
 * Exibe os erros de **ações** num modal global (ErrorService). Ignora 401 em
 * rotas protegidas — esses são tratados pelo authInterceptor (refresh
 * silencioso / redirect ao login).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.includes('/auth');
      const silent401 = err.status === 401 && !isAuthEndpoint;
      if (!silent401 && shouldShowModal(req)) {
        errorService.show(httpErrorMessage(err, { preferServer: true }));
      }
      return throwError(() => err);
    }),
  );
};
