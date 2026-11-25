import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import type { User } from 'firebase/auth';
import { LoginService } from './login.service';
import { FirebaseAuthClient } from '../firebase/firebase-auth.client';

/** Usuário falso do Firebase: só o que o LoginService lê. */
function fakeUser(partial: Partial<User> = {}): User {
  return { uid: 'uid-1', email: 'ana@dna.com', emailVerified: true, ...partial } as User;
}

/** Mock do FirebaseAuthClient com o callback de onIdTokenChanged exposto. */
function makeFirebaseMock() {
  let listener: (user: User | null) => void = () => undefined;
  const mock = {
    currentUser: null as User | null,
    claims: { roles: ['USER'] } as Record<string, unknown>,
    onIdTokenChanged: jasmine.createSpy('onIdTokenChanged').and.callFake((cb) => {
      listener = cb;
      return () => undefined;
    }),
    ready: jasmine.createSpy('ready').and.resolveTo(undefined),
    signIn: jasmine.createSpy('signIn'),
    signOut: jasmine.createSpy('signOut').and.resolveTo(undefined),
    getIdToken: jasmine.createSpy('getIdToken').and.resolveTo('id-token'),
    getIdTokenResult: jasmine
      .createSpy('getIdTokenResult')
      .and.callFake(() => Promise.resolve({ claims: mock.claims })),
    reload: jasmine.createSpy('reload').and.resolveTo(undefined),
    sendPasswordReset: jasmine.createSpy('sendPasswordReset').and.resolveTo(undefined),
    sendEmailVerification: jasmine.createSpy('sendEmailVerification').and.resolveTo(undefined),
    reauthenticate: jasmine.createSpy('reauthenticate').and.resolveTo(undefined),
    updatePassword: jasmine.createSpy('updatePassword').and.resolveTo(undefined),
    verifyBeforeUpdateEmail: jasmine.createSpy('verifyBeforeUpdateEmail').and.resolveTo(undefined),
    /** Simula o Firebase avisando que a sessão mudou. */
    emit(user: User | null) {
      mock.currentUser = user;
      listener(user);
    },
  };
  return mock;
}

describe('LoginService (Firebase Auth)', () => {
  let service: LoginService;
  let firebase: ReturnType<typeof makeFirebaseMock>;

  beforeEach(() => {
    firebase = makeFirebaseMock();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: FirebaseAuthClient, useValue: firebase },
      ],
    });
    service = TestBed.inject(LoginService);
  });

  it('sem sessão: inválida, sem roles e sem id', async () => {
    await service.whenReady();
    expect(service.isSessionValid()).toBeFalse();
    expect(service.getUserRole()).toBeNull();
    expect(service.userId).toBe('');
  });

  it('sessão restaurada (F5): whenReady espera as claims e expõe roles, id e e-mail', async () => {
    firebase.claims = { roles: ['ANALYST'] };
    firebase.emit(fakeUser());
    await service.whenReady();

    expect(service.isSessionValid()).toBeTrue();
    expect(service.getUserRole()).toEqual(['ANALYST']);
    expect(service.userId).toBe('uid-1');
    expect(service.email).toBe('ana@dna.com');
  });

  it('ignora roles desconhecidas na claim', async () => {
    firebase.claims = { roles: ['USER', 'HACKER'] };
    firebase.emit(fakeUser());
    await service.whenReady();
    expect(service.getUserRole()).toEqual(['USER']);
  });

  it('login entra pelo Firebase e já deixa as roles disponíveis', async () => {
    const user = fakeUser({ emailVerified: false });
    firebase.signIn.and.callFake(() => {
      firebase.currentUser = user;
      return Promise.resolve(user);
    });

    await service.login('ana@dna.com', 'segredo');

    expect(firebase.signIn).toHaveBeenCalledWith('ana@dna.com', 'segredo');
    expect(service.getUserRole()).toEqual(['USER']);
    expect(service.isEmailVerified()).toBeFalse();
  });

  it('logout encerra no Firebase, limpa o estado e avisa quem guarda dados', async () => {
    firebase.emit(fakeUser());
    await service.whenReady();
    let cleared = false;
    service.sessionCleared$.subscribe(() => (cleared = true));

    await service.logout();

    expect(firebase.signOut).toHaveBeenCalled();
    expect(service.isSessionValid()).toBeFalse();
    expect(cleared).toBeTrue();
  });

  it('getIdToken repassa o forceRefresh ao Firebase', async () => {
    firebase.emit(fakeUser());
    await service.getIdToken(true);
    expect(firebase.getIdToken).toHaveBeenCalledWith(firebase.currentUser!, true);
  });

  it('getIdToken sem sessão devolve null', async () => {
    await expectAsync(service.getIdToken()).toBeResolvedTo(null);
  });

  it('"Já confirmei": recarrega o usuário, renova o token e atualiza o estado', async () => {
    const user = fakeUser({ emailVerified: false });
    firebase.emit(user);
    await service.whenReady();
    firebase.reload.and.callFake(() => {
      (user as { emailVerified: boolean }).emailVerified = true;
      return Promise.resolve();
    });

    await expectAsync(service.refreshEmailVerification()).toBeResolvedTo(true);
    expect(firebase.getIdToken).toHaveBeenCalledWith(user, true);
    expect(service.isEmailVerified()).toBeTrue();
  });

  it('trocar senha reautentica antes de atualizar', async () => {
    firebase.emit(fakeUser());
    await service.changePassword('atual', 'nova123');
    expect(firebase.reauthenticate).toHaveBeenCalledWith(firebase.currentUser!, 'atual');
    expect(firebase.updatePassword).toHaveBeenCalledWith(firebase.currentUser!, 'nova123');
  });

  it('trocar e-mail reautentica e só envia o link de confirmação', async () => {
    firebase.emit(fakeUser());
    await service.changeEmail('atual', 'novo@dna.com');
    expect(firebase.reauthenticate).toHaveBeenCalled();
    expect(firebase.verifyBeforeUpdateEmail).toHaveBeenCalledWith(
      firebase.currentUser!,
      'novo@dna.com',
    );
  });
});
