import { newUserLabel, pronounLabel, userLabel, userSubject } from './pronoun';

describe('pronoun (flexão do termo "usuário")', () => {
  it('feminino é o padrão (cadastros sem pronome)', () => {
    expect(userLabel(undefined)).toBe('Usuária');
    expect(newUserLabel(null)).toBe('Nova usuária');
    expect(userSubject(undefined)).toBe('a usuária');
    expect(pronounLabel(undefined)).toBe('Feminino');
  });

  it('masculino', () => {
    expect(userLabel('masculino')).toBe('Usuário');
    expect(newUserLabel('masculino')).toBe('Novo usuário');
    expect(userSubject('masculino')).toBe('o usuário');
  });

  it('nenhum termo antigo', () => {
    const all = [userLabel('feminino'), userLabel('masculino'), newUserLabel('feminino')].join(' ');
    expect(all).not.toMatch(/maestr/i);
  });
});
