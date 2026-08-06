import { inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DnaStatus } from '../../core/models/dna-status.model';
import { DnaStatusService } from '../../core/services/dna-status.service';
import { SupplyService } from '../../core/services/supply.service';

export type Pillar = 'astrology' | 'human-design' | 'numerology';

/**
 * Lógica comum dos formulários de pilar (astrology/human-design/numerology):
 * carrega o status do DNA, checa/gera o supply e controla loading. Cada form
 * concreto informa o pilar, como checar o status e como carregar seus dados.
 */
export abstract class PillarFormBase {
  protected abstract readonly pillar: Pillar;
  protected abstract hasPillarData(status: DnaStatus | null): boolean;
  protected abstract loadPillarData(): Promise<void>;

  protected readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly supplyService = inject(SupplyService);

  readonly maestraId = signal('');
  readonly isLoading = signal(false);
  readonly loadingMessage = signal<string | null>(null);
  readonly dnaStatus = signal<DnaStatus | null>(null);
  readonly isSupplyCreated = signal(false);

  /** true enquanto o analista reedita os dados já cadastrados do pilar. */
  readonly isEditing = signal(false);
  /**
   * Avisa que os dados do pilar mudaram depois do conteúdo ter sido gerado.
   * É efêmero de propósito (spec 007): vale para a sessão em que a edição
   * aconteceu e não é persistido.
   */
  readonly outdatedPillar = signal(false);

  /** Entra em edição; cada form concreto preenche o formulário com os dados. */
  startEdit(): void {
    this.prefillForm();
    this.isEditing.set(true);
  }

  /** Sai da edição sem salvar. */
  cancelEdit(): void {
    this.isEditing.set(false);
  }

  /** Preenche o formulário reativo com os dados já carregados do pilar. */
  protected abstract prefillForm(): void;

  protected async initPillarForm(): Promise<void> {
    this.maestraId.set(this.route.snapshot.paramMap.get('maestraId') ?? '');
    await this.getDnaStatus();
    if (this.hasPillarData(this.dnaStatus())) {
      await this.loadPillarData();
      await this.checkSupplyByMaestraId();
    }
  }

  async getDnaStatus(): Promise<void> {
    this.isLoading.set(true);
    try {
      this.dnaStatus.set(
        await firstValueFrom(
          this.dnaStatusService.getStatusByUserId(this.maestraId()),
        ),
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async checkSupplyByMaestraId(): Promise<void> {
    this.isLoading.set(true);
    try {
      this.isSupplyCreated.set(
        await firstValueFrom(
          this.supplyService.isSupplyForThisUser(this.maestraId(), this.pillar),
        ),
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async createAllSupply(): Promise<void> {
    this.isLoading.set(true);
    this.loadingMessage.set(
      'Isso pode levar alguns minutos, não feche a página.',
    );
    try {
      await firstValueFrom(
        this.supplyService.createFullPillar(this.pillar, this.maestraId()),
      );
      // O conteúdo acabou de ser refeito com os dados atuais: o aviso caduca.
      this.outdatedPillar.set(false);
      alert('Dados Gerados com Sucesso!');
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set(null);
      this.checkSupplyByMaestraId();
    }
  }
}
