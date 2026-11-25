import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { PanelCard } from './panel-card';
import { LoginService } from '../../../core/services/login.service';
import { FakeLoginService } from '../../../testing/fake-login-service';
import { UserRole } from '../../../types/types';

describe('PanelCard (corpo do dashboard)', () => {
  let fixture: ComponentFixture<PanelCard>;
  let router: jasmine.SpyObj<Router>;

  const render = async (roles: UserRole[]) => {
    const login = new FakeLoginService();
    login.loginAs('u1', 'ana@dna.com', roles);
    router = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [PanelCard],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LoginService, useValue: login },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PanelCard);
    fixture.detectChanges();
  };
  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
  const rowTitled = (title: string) =>
    [...(fixture.nativeElement as HTMLElement).querySelectorAll('app-map-row button')].find((b) =>
      b.textContent?.includes(title),
    ) as HTMLButtonElement;

  it('usuário: três pilares, Plano Perfeito e Meu perfil; sem gestão', async () => {
    await render(['USER']);
    for (const title of ['Desenho Humano', 'Numerologia', 'Astrologia', 'Plano Perfeito', 'Meu perfil']) {
      expect(text()).toContain(title);
    }
    expect(text()).not.toContain('Gestão');
  });

  it('usuário: a linha do pilar leva à página do próprio pilar', async () => {
    await render(['USER']);
    rowTitled('Numerologia').click();
    expect(router.navigate).toHaveBeenCalledWith(['numerology/u1']);
  });

  it('Analista: usuários e análises, com descrição; sem Analistas', async () => {
    await render(['ANALYST']);
    expect(text()).toContain('Usuários');
    expect(text()).toContain('Análises do DNA');
    expect(text()).toContain('Cadastre, edite, envie convites');
    expect(rowTitled('Analistas')).toBeUndefined();
    expect(text()).not.toContain('Seus pilares');
  });

  it('Manager: também gerencia Analistas', async () => {
    await render(['MANAGER']);
    rowTitled('Analistas').click();
    expect(router.navigate).toHaveBeenCalledWith(['analysts']);
  });

  it('todas as roles chegam ao Meu perfil', async () => {
    await render(['ADMIN']);
    rowTitled('Meu perfil').click();
    expect(router.navigate).toHaveBeenCalledWith(['profile']);
  });
});
