import { Component, inject, OnInit, signal } from '@angular/core';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encarnacao',
  imports: [DhIntroCard, VerticalAccordion, ListsCardGrid],
  templateUrl: './encarnacao.html',
  styleUrl: './encarnacao.scss',
})
export class Encarnacao implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  topics = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    this.userId.set(userId);

    this.supplyService.getHumanDesignModule(userId, 'encarnacao').subscribe({
      next: (supply) => { this.topics.set(supply.topics); this.isLoading.set(false); },
      error: () => { this.error.set('Conteúdo ainda não disponível.'); this.isLoading.set(false); },
    });
  }

  intro = signal([
    'A Cruz da Encarnação é a composição energética do seu propósito maior nesta vida.',
    'Ela representa o campo de força que sustenta o seu caminho de alma — aquilo que você naturalmente emana, realiza, transforma e ativa no mundo ao viver alinhada com sua essência.',
    'Ela é formada pela combinação dos 4 Portões ativados pelo Sol e pela Terra na sua Personalidade e no seu Desenho. Essa composição cria uma assinatura única — a forma como a sua energia impacta o mundo.',
    'Além disso, cada Cruz pertence a um dos Quartos de Cruz da Mandala do Rave, que indica o campo temático da sua missão de alma, e também a um dos Grupos de Destino.',
  ]);

  grupos = signal(`
  <p>Os Grupos de Destino representam o tipo de jornada que sua alma escolheu viver nesta vida. Existem três:</p>
  <p><b>Ângulo Direito (Destino Pessoal):</b> Você está aqui para depender diretamente de interações cármicas. Seu propósito se manifesta ao viver a sua verdade.</p>
  <p><b>Justaposição (Destino Fixo):</b> Você vem com um foco específico. Costuma ser um "elo" entre o destino pessoal e o coletivo.</p>
  <p><b>Ângulo Esquerdo (Destino Transpessoal):</b> Você veio para servir ao coletivo. Seu propósito se revela através de relacionamentos e trocas.</p>
`);
}
