/**
 * Flexão de gênero dos termos que se referem ao **usuário** (o cliente), a partir
 * do pronome escolhido no cadastro (spec 007). Fonte única das variações — os
 * templates chamam estes helpers em vez de repetir ternários.
 *
 * Cadastros anteriores à spec não têm `pronoun`; todos os helpers assumem
 * `'feminino'` nesse caso, que é como o sistema se comportava antes.
 */
export type Pronoun = 'masculino' | 'feminino';

export const DEFAULT_PRONOUN: Pronoun = 'feminino';

const isMale = (pronoun?: Pronoun | null): boolean =>
  (pronoun ?? DEFAULT_PRONOUN) === 'masculino';

/** "Usuária" / "Usuário" — o cliente na tela (spec 010: substitui "Maestra"). */
export const userLabel = (pronoun?: Pronoun | null): string =>
  isMale(pronoun) ? 'Usuário' : 'Usuária';

/** "Nova usuária" / "Novo usuário" — gatilho de criação. */
export const newUserLabel = (pronoun?: Pronoun | null): string =>
  isMale(pronoun) ? 'Novo usuário' : 'Nova usuária';

/** "a usuária" / "o usuário" — sujeito usado em frases dos modais. */
export const userSubject = (pronoun?: Pronoun | null): string =>
  isMale(pronoun) ? 'o usuário' : 'a usuária';

/** "Feminino" / "Masculino" — o próprio pronome, para exibição. */
export const pronounLabel = (pronoun?: Pronoun | null): string =>
  isMale(pronoun) ? 'Masculino' : 'Feminino';
