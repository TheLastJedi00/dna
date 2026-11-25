import { inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { loadState } from '../../core/utils/load-state';
import { DnaStatus } from '../../core/models/dna-status.model';
import { DnaStatusService } from '../../core/services/dna-status.service';
import { SupplyService } from '../../core/services/supply.service';

export type Pillar = 'astrology' | 'human-design' | 'numerology';

/**
 * Lógica comum dos formulários de pilar (astrology/human-design/numerology):
 * carrega o status do DNA, checa/gera o supply e controla loading. Cada form
 * concreto informa o pilar, como checar o status e como carregar seus dados.
 *
 * Duas formas de "carregando", de propósito:
 * - **leitura** (`initState`): skeleton no lugar do bloco e erro inline com
 *   "Tentar novamente";
 * - **ação** (`isLoading`: salvar, gerar análise): overlay de tela cheia.
 */
export abstract class PillarFormBase {
  protected abstract readonly pillar: Pillar;
  protected abstract hasPillarData(status: DnaStatus | null): boolean;
  /** Busca os dados do pilar. Deve **propagar** falhas (o `initState` as exibe). */
  protected abstract loadPillarData(): Promise<void>;

  protected readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  /** Leitura inicial: status do DNA → (se cadastrado) dados do pilar + supply. */
  readonly initState = loadState(() => this.fetchPillarState());
  /** Ação em curso (salvar / gerar análise). */
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
    this.userId.set(this.route.snapshot.paramMap.get('userId') ?? '');
    await this.initState.load();
  }

  /** Recarrega tudo (após salvar/gerar, ou no "Tentar novamente"). */
  reload(): Promise<void> {
    return this.initState.load();
  }

  private async fetchPillarState(): Promise<true> {
    const status = await firstValueFrom(
      this.dnaStatusService.getStatusByUserId(this.userId()),
    ).catch((e) => {
      // Usuário recém-cadastrado ainda não tem status: nada preenchido.
      if (e instanceof HttpErrorResponse && e.status === 404) return null;
      throw e;
    });
    this.dnaStatus.set(status);
    if (this.hasPillarData(status)) {
      await Promise.all([this.loadPillarData(), this.fetchSupplyFlag()]);
    }
    return true;
  }

  private async fetchSupplyFlag(): Promise<void> {
    this.isSupplyCreated.set(
      await firstValueFrom(this.supplyService.isSupplyForThisUser(this.userId(), this.pillar)),
    );
  }

  async createAllSupply(): Promise<void> {
    this.isLoading.set(true);
    this.loadingMessage.set(
      'Isso pode levar alguns minutos, não feche a página.',
    );
    try {
      await firstValueFrom(
        this.supplyService.createFullPillar(this.pillar, this.userId()),
      );
      // O conteúdo acabou de ser refeito com os dados atuais: o aviso caduca.
      this.outdatedPillar.set(false);
      alert('Dados Gerados com Sucesso!');
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set(null);
      this.reload();
    }
  }
}
