import { HttpErrorResponse } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { combineLoad, loadState } from './load-state';

describe('loadState', () => {
  it('nasce em loading por padrão e em idle quando pedido', () => {
    expect(loadState(() => of(1)).status()).toBe('loading');
    expect(loadState(() => of(1), { initial: 'idle' }).status()).toBe('idle');
  });

  it('carrega dados de Observable e de Promise', async () => {
    const a = loadState(() => of('ok'));
    await a.load();
    expect(a.status()).toBe('success');
    expect(a.data()).toBe('ok');

    const b = loadState(() => Promise.resolve(42));
    await b.load();
    expect(b.data()).toBe(42);
  });

  it('erro HTTP vira mensagem clara', async () => {
    const s = loadState(() => throwError(() => new HttpErrorResponse({ status: 0 })));
    await s.load();
    expect(s.status()).toBe('error');
    expect(s.error()).toContain('Sem conexão');
    expect(s.data()).toBeNull();
  });

  it('404 vira empty com emptyOn404', async () => {
    const s = loadState(() => throwError(() => new HttpErrorResponse({ status: 404 })), {
      emptyOn404: true,
    });
    await s.load();
    expect(s.status()).toBe('empty');
    expect(s.error()).toBeNull();
  });

  it('isEmpty marca resposta vazia', async () => {
    const s = loadState(() => of([] as number[]), { isEmpty: (l) => l.length === 0 });
    await s.load();
    expect(s.status()).toBe('empty');
  });

  it('reload depois de erro recupera', async () => {
    let fail = true;
    const s = loadState(() =>
      fail ? throwError(() => new HttpErrorResponse({ status: 500 })) : of('ok'),
    );
    await s.load();
    expect(s.status()).toBe('error');
    fail = false;
    await s.load();
    expect(s.status()).toBe('success');
    expect(s.error()).toBeNull();
  });

  it('descarta resposta de chamada antiga', async () => {
    const first = new Subject<string>();
    const second = new Subject<string>();
    const queue = [first, second];
    const s = loadState(() => queue.shift()!);
    const p1 = s.load();
    const p2 = s.load();
    second.next('nova');
    second.complete();
    await p2;
    first.next('velha');
    first.complete();
    await p1;
    expect(s.data()).toBe('nova');
  });

  it('set e reset', async () => {
    const s = loadState(() => of(1));
    s.set(7);
    expect(s.status()).toBe('success');
    expect(s.data()).toBe(7);
    s.reset();
    expect(s.status()).toBe('idle');
    expect(s.data()).toBeNull();
  });

  describe('combineLoad', () => {
    it('erro tem prioridade e o retry refaz só o que falhou', async () => {
      let calls = 0;
      let fail = true;
      const ok = loadState(() => {
        calls++;
        return of('ok');
      });
      const bad = loadState(() =>
        fail ? throwError(() => new HttpErrorResponse({ status: 503 })) : of('ok'),
      );
      const view = combineLoad(ok, bad);
      expect(view.status()).toBe('loading');
      await view.load();
      expect(view.status()).toBe('error');
      expect(view.error()).toContain('instabilidade');
      fail = false;
      await view.retry();
      expect(calls).toBe(1);
      expect(view.status()).toBe('success');
    });

    it('vazio aparece quando nenhuma falhou', async () => {
      const a = loadState(() => of(1));
      const b = loadState(() => throwError(() => new HttpErrorResponse({ status: 404 })), {
        emptyOn404: true,
      });
      const view = combineLoad(a, b);
      await view.load();
      expect(view.status()).toBe('empty');
    });
  });
});
