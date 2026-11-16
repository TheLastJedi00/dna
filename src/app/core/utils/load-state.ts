import { HttpErrorResponse } from '@angular/common/http';
import { computed, Signal, signal } from '@angular/core';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { httpErrorMessage } from './http-error-message';

/**
 * - `idle`: nada pedido ainda (ex.: modal fechado)
 * - `loading`: requisição em voo → skeleton
 * - `success`: dados prontos
 * - `empty`: não há o que mostrar, e isso **não é falha** (ex.: pilar ainda não
 *   cadastrado) → estado vazio da própria tela
 * - `error`: falhou → mensagem inline + "Tentar novamente"
 */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface LoadStateOptions<T> {
  /** 404 vira `empty` em vez de `error`. */
  emptyOn404?: boolean;
  /** Resposta que deve ser tratada como vazia (ex.: lista sem itens). */
  isEmpty?: (data: T) => boolean;
  /**
   * Status antes do primeiro `load()`. Padrão `loading`: a tela já nasce com o
   * skeleton e não pisca vazia antes de o `ngOnInit` disparar a requisição.
   */
  initial?: 'idle' | 'loading';
}

export interface LoadState<T> {
  readonly status: Signal<LoadStatus>;
  readonly data: Signal<T | null>;
  /** Mensagem pronta para exibir quando `status === 'error'`. */
  readonly error: Signal<string | null>;
  readonly isLoading: Signal<boolean>;
  /** Busca de novo. Respostas de chamadas anteriores ainda em voo são descartadas. */
  load(): Promise<void>;
  /** Atualiza os dados localmente (ex.: após uma ação que devolve a entidade). */
  set(data: T): void;
  /** Volta ao `idle` e descarta o que estiver em voo. */
  reset(): void;
}

/**
 * Estado de uma **leitura**: envolve a função que busca os dados e expõe
 * signals de status/dados/erro para o template escolher entre skeleton,
 * conteúdo, vazio e erro.
 *
 * A função é chamada a cada `load()`, então pode ler signals (filtros,
 * paginação, id da rota) no momento da chamada.
 */
export function loadState<T>(
  loader: () => Observable<T> | Promise<T>,
  options: LoadStateOptions<T> = {},
): LoadState<T> {
  const status = signal<LoadStatus>(options.initial ?? 'loading');
  const data = signal<T | null>(null);
  const error = signal<string | null>(null);
  let requestId = 0;

  async function load(): Promise<void> {
    const id = ++requestId;
    status.set('loading');
    error.set(null);
    try {
      const source = loader();
      const result = isObservable(source) ? await firstValueFrom(source) : await source;
      if (id !== requestId) return;
      data.set(result);
      const empty = result == null || (options.isEmpty?.(result) ?? false);
      status.set(empty ? 'empty' : 'success');
    } catch (e) {
      if (id !== requestId) return;
      data.set(null);
      if (options.emptyOn404 && e instanceof HttpErrorResponse && e.status === 404) {
        status.set('empty');
        return;
      }
      error.set(httpErrorMessage(e));
      status.set('error');
    }
  }

  return {
    status: status.asReadonly(),
    data: data.asReadonly(),
    error: error.asReadonly(),
    isLoading: computed(() => status() === 'loading'),
    load,
    set(value: T) {
      requestId++;
      data.set(value);
      error.set(null);
      status.set('success');
    },
    reset() {
      requestId++;
      data.set(null);
      error.set(null);
      status.set('idle');
    },
  };
}

export interface CombinedLoad {
  /** `error` > `loading` > `empty` > `success` (e `idle` se todas estiverem idle). */
  readonly status: Signal<LoadStatus>;
  /** Mensagem da primeira leitura que falhou. */
  readonly error: Signal<string | null>;
  /** Dispara todas as leituras em paralelo. */
  load(): Promise<void>;
  /** "Tentar novamente": refaz só as leituras que falharam. */
  retry(): Promise<void>;
}

/**
 * Junta leituras de uma mesma tela que só fazem sentido juntas (ex.: dados do
 * pilar + perfil): um skeleton, um erro e um "Tentar novamente".
 */
export function combineLoad(...states: LoadState<unknown>[]): CombinedLoad {
  const status = computed<LoadStatus>(() => {
    const all = states.map((s) => s.status());
    if (all.includes('error')) return 'error';
    if (all.includes('loading')) return 'loading';
    if (all.every((s) => s === 'idle')) return 'idle';
    if (all.includes('empty')) return 'empty';
    return 'success';
  });
  return {
    status,
    error: computed(() => states.find((s) => s.status() === 'error')?.error() ?? null),
    async load() {
      await Promise.all(states.map((s) => s.load()));
    },
    async retry() {
      await Promise.all(states.filter((s) => s.status() === 'error').map((s) => s.load()));
    },
  };
}
