import { Component, inject, OnInit, signal } from '@angular/core';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { NgClass } from '@angular/common';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-centros',
  imports: [DhIntroCard, VerticalAccordion, ListsCardGrid, NgClass],
  templateUrl: './centros.html',
  styleUrl: './centros.scss',
})
export class Centros implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  readonly centro = signal('');
  topicos = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedCentro = signal<string | null>(null);
  centralCardGridAnimation = signal('slide-in');

  ngOnInit(): void {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    const centro = this.route.snapshot.paramMap.get('centro') ?? '';
    this.userId.set(userId);
    this.centro.set(centro);
    this.selectedCentro.set(centro);

    const moduleKey = `centros-${centro}`;
    this.supplyService.getHumanDesignModule(userId, moduleKey).subscribe({
      next: (supply) => { this.topicos.set(supply.topics); this.isLoading.set(false); },
      error: () => { this.error.set('Conteúdo ainda não disponível.'); this.isLoading.set(false); },
    });
  }

  intro = signal([
    'No Desenho Humano, os Centros Energéticos representam áreas específicas do seu campo energético e do seu corpo físico.',
    'Eles são inspirados pelos centros dos sistemas hindu (chakras), cabalístico (Árvore da Vida) e chinês (I Ching), e compõem o que chamamos de Corpo Gráfico — o mapa único da sua energia.',
    'Existem 9 Centros no Desenho Humano, e cada um está relacionado a: uma função psicoespiritual específica; uma parte biológica do corpo; uma forma de expressão ou percepção energética.',
    'Esses Centros podem aparecer de três formas:',
  ]);

  introDefinidos = signal(`Representam áreas da sua vida onde você é consistente, estável e
    autossuficiente. Você emite energia por esses centros. São seus pontos de firmeza e
    assinatura energética.`);

  introIndefinidos = signal(`Com canais parcialmente ativados, eles representam áreas onde você é
    influenciável, pois absorve, amplia e reflete a energia dos outros. Aqui você aprende por contraste.`);

  introAbertos = signal(`Sem nenhum canal conectado a eles, são espaços de
    extrema sensibilidade e sabedoria potencial — se você aprender a navegar neles com consciência.`);

  changeCardslits(selectedList: string) {
    this.selectedCentro.set(selectedList);
  }

  isHided(centro: string) {
    return centro !== this.selectedCentro() ? 'hide' : '';
  }

  horizontalRuleClass() {
    switch (this.selectedCentro()) {
      case 'definidos': return 'hr-left';
      case 'indefinidos': return 'hr-center';
      case 'abertos': return 'hr-right';
      default: return this.centro();
    }
  }
}
