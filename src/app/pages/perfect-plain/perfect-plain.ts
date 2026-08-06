import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SupplyService } from '../../core/services/supply.service';
import { LoginService } from '../../core/services/login.service';
import { Topic } from '../../core/models/supply.model';
import { IntroCard } from '../../shared/cards/intro-card/intro-card';
import { ListsCardGrid } from '../../shared/grid/lists-card-grid/lists-card-grid';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { DnaTitleCard } from "../../shared/cards/dna-title-card/dna-title-card";
import { DnaDescriptionCard } from "../../shared/cards/dna-description-card/dna-description-card";

@Component({
  selector: 'app-perfect-plain',
  imports: [
    IntroCard,
    ListsCardGrid,
    Infinity,
    UserPanelHeader,
    UserPanelFooter,
    DnaTitleCard,
    DnaDescriptionCard
],
  templateUrl: './perfect-plain.html',
  styleUrl: './perfect-plain.scss',
})
export class PerfectPlain implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);
  private readonly loginService = inject(LoginService);

  readonly userId = signal('');
  readonly topics = signal<Topic[] | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  /**
   * Destino do "Voltar": o admin volta para o painel do usuário (user-supply);
   * o próprio usuário volta para o seu dashboard. Absoluto de propósito — a rota
   * `perfect-plain/:userId` é plana, então o "../" padrão iria para a landing.
   */
  readonly backLink = computed(() => {
    const roles = this.loginService.getUserRole() ?? [];
    const isAdmin = roles.includes('ADMIN') || roles.includes('MANAGER');
    return isAdmin ? `/user-supply/${this.userId()}` : '/dashboard';
  });

  async ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId') ?? '';
    this.userId.set(userId);
    await this.load(userId);
  }

  private async load(userId: string) {
    try {
      const supply = await firstValueFrom(
        this.supplyService.getPerfectPlain(userId),
      );
      if (supply?.topics?.length) {
        this.topics.set(supply.topics);
      } else {
        this.error.set('Conteúdo ainda não disponível.');
      }
    } catch (e) {
      console.error(e);
      this.error.set('Conteúdo ainda não disponível.');
    } finally {
      this.isLoading.set(false);
    }
  }

  perfectPlainIntro(){
    return `
      Agora você tem em mãos, de forma clara e detalhada, a sua
Bússola Interna que vai servir como sua fonte de direção ao
longo de toda a sua vida — e para todos os seus projetos.
Com o seu DNA da Empresária, e se permitindo ser guiada
por ele, você vai ver na prática:
A sua produtividade e lucratividade vital aumentar
O aumento em até 3x seus resultados, sem que você
tenha que se sobrecarregar nesse processo
A real conciliação dos seus papéis, vendo a sua vida
pessoal e profissional “se conversando”
E isso acontece quando o seu modelo de trabalho, rotina e
estratégia de crescimento estão totalmente alinhados à sua
dinâmica energética única, que foi desvendada aqui no seu
DNA da Empresária.
A partir de agora, seu plano prático perfeito é:
    `
  }
}
