import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IconTextButton } from '../buttons/icon-text-button/icon-text-button';
import { Infinity } from '../loading/infinity/infinity';
import { SupplyService } from '../../core/services/supply.service';
import { DnaStatusService } from '../../core/services/dna-status.service';

/**
 * Gatilho do Plano Perfeito (visão admin). Só habilita a geração quando os 3
 * pilares existem (pré-condição D2); reaproveita `createFullPillar` e
 * `isSupplyForThisUser`. Reusado dentro do modal do painel (Fase 4).
 */
@Component({
  selector: 'app-perfect-plain-trigger',
  imports: [IconTextButton, Infinity],
  templateUrl: './perfect-plain-trigger.html',
  styleUrl: './perfect-plain-trigger.scss',
})
export class PerfectPlainTrigger implements OnInit {
  readonly maestraId = input.required<string>();

  private readonly supply = inject(SupplyService);
  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly router = inject(Router);

  readonly ready = signal(false);
  readonly isCreated = signal(false);
  readonly isLoading = signal(false);
  readonly loadingMessage = signal<string | null>(null);

  async ngOnInit() {
    await this.refresh();
  }

  private async refresh() {
    this.isLoading.set(true);
    try {
      const status = await firstValueFrom(
        this.dnaStatusService.getStatusByUserId(this.maestraId()),
      );
      this.ready.set(
        !!(status?.human_design && status?.numerology && status?.astrology),
      );
      if (this.ready()) {
        this.isCreated.set(
          await firstValueFrom(
            this.supply.isSupplyForThisUser(this.maestraId(), 'perfect-plain'),
          ),
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async generate() {
    this.isLoading.set(true);
    this.loadingMessage.set(
      'Isso pode levar alguns minutos, não feche a página.',
    );
    try {
      await firstValueFrom(
        this.supply.createFullPillar('perfect-plain', this.maestraId()),
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingMessage.set(null);
      await this.refresh();
    }
  }

  view() {
    this.router.navigate(['perfect-plain', this.maestraId()]);
  }
}
