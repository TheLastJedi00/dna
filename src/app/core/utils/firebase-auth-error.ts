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
