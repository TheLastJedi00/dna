import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';
import { MapRow } from '../../list/map-row/map-row';
import { DashboardButton } from '../../buttons/dashboard-button/dashboard-button';

/** Imagens dos pilares (as mesmas das páginas de cada pilar). */
export const PILLAR_IMAGES = {
  humanDesign: 'https://i.imgur.com/U4xU7Hj.png',
  numerology: 'https://i.imgur.com/hYZJdpD.png',
  astrology: 'https://i.imgur.com/Wh3IKVb.png',
} as const;

/**
 * Corpo do dashboard (spec 010): o mesmo esqueleto para todas as roles —
 * um painel em linhas ("mapa") e, no fim, "Sua conta" com o Meu Perfil.
 * - Usuário: os três pilares e o Plano Perfeito como fechamento que une os três.
 * - Gestão: usuários, análises e (Manager/Admin) analistas, todos com descrição.
 * Mesmas rotas e permissões de antes.
 */
@Component({
  selector: 'app-panel-card',
  imports: [MapRow, DashboardButton],
  templateUrl: './panel-card.html',
  styleUrl: './panel-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelCard {
  readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  readonly images = PILLAR_IMAGES;
  private readonly roles = computed(() => this.loginService.roles());

  readonly isClient = computed(() => this.roles().includes('USER'));

  /** Gestão de usuários: Analista também cadastra e acompanha os seus. */
  readonly canManageMaestras = computed(() => this.roles().some((role) => role !== 'USER'));

  /** Gestão de Analistas: só ADMIN e MANAGER (espelha o managerGuard). */
  readonly canManageAnalysts = computed(() =>
    this.roles().some((role) => role === 'ADMIN' || role === 'MANAGER'),
  );

  go(path: string) {
    this.router.navigate([path]);
  }

  goToPillar(pillar: string) {
    this.router.navigate([`${pillar}/${this.loginService.userId}`]);
  }
}
