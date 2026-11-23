import { authErrorMessage, firebaseAuthCode } from './firebase-auth-error';

const err = (code: string) => Object.assign(new Error(code), { code });

describe('authErrorMessage', () => {
  it('credencial errada: mensagem única, sem dizer se é o e-mail ou a senha', () => {
    const expected = 'E-mail ou senha incorretos.';
    expect(authErrorMessage(err('auth/invalid-credential'))).toBe(expected);
    expect(authErrorMessage(err('auth/wrong-password'))).toBe(expected);
    expect(authErrorMessage(err('auth/user-not-found'))).toBe(expected);
  });

  it('muitas tentativas, conta desativada e sem conexão têm mensagem própria', () => {
    expect(authErrorMessage(err('auth/too-many-requests'))).toContain('Muitas tentativas');
    expect(authErrorMessage(err('auth/user-disabled'))).toContain('desativada');
    expect(authErrorMessage(err('auth/network-request-failed'))).toContain('Sem conexão');
  });

  it('código desconhecido ou erro sem código: mensagem genérica (ou a informada)', () => {
    expect(authErrorMessage(err('auth/algo-novo'))).toBe('Não foi possível entrar. Tente novamente.');
    expect(authErrorMessage(new Error('x'))).toBe('Não foi possível entrar. Tente novamente.');
    expect(authErrorMessage(null, 'Outra.')).toBe('Outra.');
  });

  it('firebaseAuthCode lê só códigos em texto', () => {
    expect(firebaseAuthCode(err('auth/x'))).toBe('auth/x');
    expect(firebaseAuthCode({ code: 42 })).toBeNull();
    expect(firebaseAuthCode('auth/x')).toBeNull();
  });
});
