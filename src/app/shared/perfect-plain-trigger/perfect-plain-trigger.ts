import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IconTextButton } from '../buttons/icon-text-button/icon-text-button';
import { Infinity } from '../loading/infinity/infinity';
import { Skeleton } from '../feedback/skeleton/skeleton';
import { LoadError } from '../feedback/load-error/load-error';
import { SupplyService } from '../../core/services/supply.service';
import { DnaStatusService } from '../../core/services/dna-status.service';
import { loadState } from '../../core/utils/load-state';

interface TriggerState {
  /** Os 3 pilares estão preenchidos (pré-condição D2). */
  ready: boolean;
  /** O Plano Perfeito já foi gerado. */
  isCreated: boolean;
}

/**
 * Gatilho do Plano Perfeito (visão admin). Só habilita a geração quando os 3
 * pilares existem (pré-condição D2); reaproveita `createFullPillar` e
 * `isSupplyForThisUser`. Reusado dentro do modal do painel (Fase 4).
 */
@Component({
  selector: 'app-perfect-plain-trigger',
  imports: [IconTextButton, Infinity, Skeleton, LoadError],
  templateUrl: './perfect-plain-trigger.html',
  styleUrl: './perfect-plain-trigger.scss',
})
export class PerfectPlainTrigger implements OnInit {
  readonly maestraId = input.required<string>();

  private readonly supply = inject(SupplyService);
  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly router = inject(Router);

  /** Checagem (leitura): skeleton no botão e erro inline se falhar. */
  readonly check = loadState(() => this.fetchState());
  readonly ready = computed(() => this.check.data()?.ready ?? false);
  readonly isCreated = computed(() => this.check.data()?.isCreated ?? false);

  /** Geração (ação): overlay de tela cheia com aviso de demora. */
  readonly isLoading = signal(false);
  readonly loadingMessage = signal<string | null>(null);

  async ngOnInit() {
    await this.check.load();
  }

  private async fetchState(): Promise<TriggerState> {
    const status = await firstValueFrom(
      this.dnaStatusService.getStatusByUserId(this.maestraId()),
    ).catch((e) => {
      // Sem status ainda = nenhum pilar preenchido.
      if (e instanceof HttpErrorResponse && e.status === 404) return null;
      throw e;
    });
    const ready = !!(status?.human_design && status?.numerology && status?.astrology);
    const isCreated = ready
      ? await firstValueFrom(this.supply.isSupplyForThisUser(this.maestraId(), 'perfect-plain'))
      : false;
    return { ready, isCreated };
  }

  async generate() {
    this.isLoading.set(true);
    this.loadingMessage.set('Isso pode levar alguns minutos, não feche a página.');
    try {
      await firstValueFrom(this.supply.createFullPillar('perfect-plain', this.maestraId()));
    } catch {
      // erro de ação exibido pelo modal global (errorInterceptor)
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set(null);
      await this.check.load();
    }
  }

  view() {
    this.router.navigate(['perfect-plain', this.maestraId()]);
  }
}
