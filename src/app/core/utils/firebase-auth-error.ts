/** Código de erro do SDK do Firebase Auth (ex.: `auth/invalid-credential`). */
export function firebaseAuthCode(e: unknown): string | null {
  if (typeof e === 'object' && e !== null && 'code' in e) {
    const code = (e as { code: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/invalid-email': 'Informe um e-mail válido.',
  'auth/missing-password': 'Informe a senha.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'auth/user-disabled': 'Esta conta está desativada. Fale com quem fez o seu cadastro.',
  'auth/network-request-failed':
    'Sem conexão com o servidor. Verifique sua internet e tente novamente.',
  'auth/weak-password': 'A nova senha precisa ter pelo menos 6 caracteres.',
  'auth/email-already-in-use': 'Este e-mail já está em uso por outra conta.',
  'auth/requires-recent-login': 'Por segurança, confirme sua senha e tente de novo.',
};

/**
 * Mensagem em PT-BR para um erro do Firebase Auth (login, redefinição,
 * reautenticação). Credencial errada nunca diz se o problema é o e-mail ou a
 * senha — isso revelaria quais e-mails têm conta.
 */
export function authErrorMessage(e: unknown, fallback = 'Não foi possível entrar. Tente novamente.'): string {
  const code = firebaseAuthCode(e);
  return (code && MESSAGES[code]) || fallback;
}

/** Erros de "senha atual" ao reautenticar no Meu Perfil. */
const WRONG_CURRENT_PASSWORD = ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-mismatch'];

/**
 * Mensagem para ações do Meu Perfil, que pedem a **senha atual**: aqui não há
 * o que esconder (a pessoa já está logada), então a senha errada é dita como
 * tal em vez de "E-mail ou senha incorretos".
 */
export function reauthErrorMessage(e: unknown, fallback: string): string {
  const code = firebaseAuthCode(e);
  if (code && WRONG_CURRENT_PASSWORD.includes(code)) {
    return 'Senha atual incorreta.';
  }
  return authErrorMessage(e, fallback);
}
