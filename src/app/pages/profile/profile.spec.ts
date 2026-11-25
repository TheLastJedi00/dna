import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Profile } from './profile';
import { LoginService } from '../../core/services/login.service';
import { FakeLoginService } from '../../testing/fake-login-service';
import { environment } from '../../../environments/environment';

describe('Profile (Meu Perfil)', () => {
  let fixture: ComponentFixture<Profile>;
  let http: HttpTestingController;
  let login: FakeLoginService;
  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  const setup = async (emailVerified: boolean) => {
    login = new FakeLoginService();
    login.loginAs('u1', 'ana@dna.com', ['USER'], emailVerified);
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: LoginService, useValue: login },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Profile);
    fixture.detectChanges();
  };

  afterEach(() => http.verify());

  it('mostra o nome, o e-mail e o selo de e-mail confirmado', async () => {
    await setup(true);
    http.expectOne(`${environment.apiUrl}/users/me/u1`).flush({ fullName: 'Ana Duarte' });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text()).toContain('Meu perfil');
    expect(text()).toContain('Ana Duarte');
    expect(text()).toContain('ana@dna.com');
    expect(text()).toContain('E-mail confirmado');
  });

  it('e-mail não confirmado aparece no selo', async () => {
    await setup(false);
    http.expectOne(`${environment.apiUrl}/users/me/u1`).flush({ fullName: 'Ana' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(text()).toContain('E-mail não confirmado');
  });

  it('perfil não carregou: o e-mail ocupa o lugar do nome', async () => {
    await setup(true);
    http
      .expectOne(`${environment.apiUrl}/users/me/u1`)
      .flush(null, { status: 500, statusText: 'Erro' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.displayName()).toBe('ana@dna.com');
  });
});
