import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { LoginService } from '../services/login.service';
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
/** Código da API (spec 010) para conta com e-mail ainda não confirmado. */
export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED';

function isEmailNotVerified(err: HttpErrorResponse): boolean {
  const body: unknown = err.error;
  return (
    err.status === 403 &&
    typeof body === 'object' &&
    body !== null &&
    (body as { code?: unknown }).code === EMAIL_NOT_VERIFIED
  );
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const login = inject(LoginService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // E-mail não confirmado não é erro a explicar num modal: a pessoa volta
      // ao dashboard, onde o popup de verificação diz o que fazer.
      if (isEmailNotVerified(err)) {
        login.markEmailUnverified();
        router.navigate(['/dashboard']);
        return throwError(() => err);
      }
      const isAuthEndpoint = req.url.includes('/auth');
      const silent401 = err.status === 401 && !isAuthEndpoint;
      if (!silent401 && shouldShowModal(req)) {
        errorService.show(httpErrorMessage(err, { preferServer: true }));
      }
      return throwError(() => err);
    }),
  );
};
