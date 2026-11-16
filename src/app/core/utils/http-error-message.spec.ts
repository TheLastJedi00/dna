import { HttpErrorResponse } from '@angular/common/http';
import { GENERIC_LOAD_ERROR, httpErrorMessage, statusMessage } from './http-error-message';

function err(status: number, error: unknown = null) {
  return new HttpErrorResponse({ status, error });
}

describe('httpErrorMessage', () => {
  it('traduz cada faixa de status', () => {
    expect(statusMessage(0)).toContain('Sem conexão');
    expect(statusMessage(401)).toContain('sessão expirou');
    expect(statusMessage(403)).toContain('permissão');
    expect(statusMessage(404)).toContain('Não encontramos');
    expect(statusMessage(504)).toContain('demorou');
    expect(statusMessage(503)).toContain('instabilidade');
    expect(statusMessage(418)).toBe(GENERIC_LOAD_ERROR);
  });

  it('em leitura ignora a mensagem técnica do backend', () => {
    const e = err(404, { message: 'Usuário com ID abc não encontrado.' });
    expect(httpErrorMessage(e)).toBe('Não encontramos estas informações.');
  });

  it('em ação usa a mensagem do backend para 4xx', () => {
    expect(httpErrorMessage(err(401, { message: 'Senha inválida.' }), { preferServer: true })).toBe(
      'Senha inválida.',
    );
  });

  it('junta a lista de mensagens do ValidationPipe', () => {
    const e = err(400, { message: ['nome é obrigatório.', 'email inválido.'] });
    expect(httpErrorMessage(e, { preferServer: true })).toBe('nome é obrigatório. email inválido.');
  });

  it('em ação não repassa o corpo de um 5xx', () => {
    const e = err(500, { message: 'TypeError: x is undefined' });
    expect(httpErrorMessage(e, { preferServer: true })).toContain('instabilidade');
  });

  it('erro que não é HTTP vira a mensagem genérica', () => {
    expect(httpErrorMessage(new Error('x'))).toBe(GENERIC_LOAD_ERROR);
  });
});
