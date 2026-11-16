import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UserHeaderMenu } from './user-header-menu';
import { environment } from '../../../../environments/environment';

function fakeJwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64({ alg: 'HS256' })}.${b64(payload)}.sig`;
}

describe('UserHeaderMenu', () => {
  let fixture: ComponentFixture<UserHeaderMenu>;
  let http: HttpTestingController;
  const me = `${environment.apiUrl}/users/me/u1`;

  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem(
      'access_token',
      fakeJwt({ id: 'u1', email: 'maria@x.com', roles: ['USER'] }),
    );
    await TestBed.configureTestingModule({
      imports: [UserHeaderMenu],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserHeaderMenu);
    fixture.componentInstance.toggle = true;
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  it('mostra skeleton enquanto carrega e nunca o placeholder antigo', async () => {
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeTruthy();
    expect(text()).not.toMatch(/B[áa]rbara|Farias/);
    http.expectOne(me).flush({ fullName: 'Maria Clara Silva' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(text()).not.toMatch(/B[áa]rbara|Farias/);
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Maria');
    expect(fixture.nativeElement.querySelector('h2').textContent.trim()).toBe('Clara Silva');
  });

  it('sem perfil mostra o e-mail do token', async () => {
    http.expectOne(me).flush(null, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(text()).toContain('maria@x.com');
  });

  it('em erro mostra a mensagem e tenta de novo', async () => {
    http.expectOne(me).error(new ProgressEvent('error'), { status: 0 });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(text()).toContain('Sem conexão');
    const retry = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLElement) =>
      b.textContent?.includes('Tentar novamente'),
    ) as HTMLButtonElement;
    retry.click();
    http.expectOne(me).flush({ fullName: 'Maria' });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Maria');
    expect(fixture.nativeElement.querySelector('h2')).toBeNull();
  });
});
