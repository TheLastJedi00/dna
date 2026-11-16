import { HttpErrorResponse } from '@angular/common/http';

/** Texto padrão para qualquer falha sem tradução específica. */
export const GENERIC_LOAD_ERROR = 'Não foi possível carregar as informações. Tente novamente.';

/**
 * Traduz o status HTTP em uma frase clara para a usuária. Não usa a mensagem
 * do backend: em leituras ela costuma ser técnica (ex.: "Usuário com ID abc
 * não encontrado.").
 */
export function statusMessage(status: number): string {
  if (status === 0) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';
  }
  if (status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (status === 403) return 'Você não tem permissão para ver estas informações.';
  if (status === 404) return 'Não encontramos estas informações.';
  if (status === 408 || status === 504) {
    return 'O servidor demorou para responder. Tente novamente.';
  }
  if (status >= 500) return 'O servidor está com instabilidade. Tente novamente em instantes.';
  return GENERIC_LOAD_ERROR;
}

/** Mensagem do corpo da resposta, quando o backend mandou uma legível. */
function serverMessage(err: HttpErrorResponse): string | null {
  const raw = err.error?.message ?? err.error;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  // ValidationPipe do Nest devolve `message: string[]`.
  if (Array.isArray(raw)) {
    const parts = raw.filter((m): m is string => typeof m === 'string' && !!m.trim());
    if (parts.length) return parts.join(' ');
  }
  return null;
}

/**
 * Mensagem de erro para exibir.
 *
 * - **Leitura** (`preferServer: false`, padrão): sempre a tradução do status.
 * - **Ação** (`preferServer: true`): a mensagem do backend vale quando é um 4xx,
 *   porque é dirigida à usuária ("Senha inválida.", "Email não cadastrado.").
 *   Falha de rede e 5xx continuam traduzidos — o corpo ali é detalhe interno.
 */
export function httpErrorMessage(err: unknown, opts: { preferServer?: boolean } = {}): string {
  if (!(err instanceof HttpErrorResponse)) return GENERIC_LOAD_ERROR;
  if (opts.preferServer && err.status >= 400 && err.status < 500) {
    return serverMessage(err) ?? statusMessage(err.status);
  }
  return statusMessage(err.status);
}
