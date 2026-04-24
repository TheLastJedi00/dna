import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { FakeApi } from '../../../core/services/fake-api';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { TopicList } from '../../../core/models/topiclist.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-centros',
  imports: [DhIntroCard, VerticalAccordion, ListsCardGrid, NgClass],
  templateUrl: './centros.html',
  styleUrl: './centros.scss',
})
export class Centros implements OnInit {
  ngOnInit(): void {
    this.topicos.set(this.api.getAllTopicLists());
  }
  centro = input<'definidos' | 'indefinidos' | 'abertos'>();
  api = inject(FakeApi);
  topicos = signal<TopicList[] | null>(null);
  horizontalRuleClass = signal({});
  selectedCentro = signal<'definidos' | 'indefinidos' | 'abertos'>('definidos');
  centralCardGridAnimation = signal('slide-in');
  intro = signal([
    'No Desenho Humano, os Centros Energéticos representam áreas específicas do seu campo energético e do seu corpo físico.',
    'Eles são inspirados pelos centros dos sistemas hindu (chakras), cabalístico (Árvore da Vida) e chinês (I Ching), e compõem o que chamamos de Corpo Gráfico — o mapa único da sua energia.',
    'Existem 9 Centros no Desenho Humano, e cada um está relacionado a: uma função psicoespiritual específica (decisão, emoção, identidade, etc.); uma parte biológica ou sistema do corpo físico; uma forma de expressão ou percepção energética.',
    'Esses Centros podem aparecer de três formas:',
  ]);
  introDefinidos = signal(`Representam
    áreas da sua vida onde você é consistente, estável e
    autossuficiente. Você emite energia por esses centros. Eles
    mostram o que você naturalmente expressa, sem depender
    de influências externas. São seus pontos de firmeza e
    assinatura energética.`);
  introIndefinidos = signal(`
    Com canais parcialmente
    ativados, eles representam áreas onde você é influenciável,
    pois absorve, amplia e reflete a energia dos outros. Aqui
    você aprende por contraste: não é algo que você seja, mas
    algo que você pode observar, entender e transmutar.`);
  introAbertos = signal(`Sem nenhum
    canal conectado a eles, isso significa que você não tem definição nem influência fixa nessa área. São espaços de
    extrema sensibilidade e sabedoria potencial — se você
    aprender a navegar neles com consciência.`);

  changeCardslits(selectedList: 'definidos' | 'indefinidos' | 'abertos') {
    this.selectedCentro.set(selectedList);
    switch (selectedList) {
      case 'definidos':
        this.horizontalRuleClass.set('transform: translateX(0%)');
        break;
      case 'indefinidos':
        this.horizontalRuleClass.set('transform: translateX(100%)');
        break;
      case 'abertos':
        this.horizontalRuleClass.set('transform: translateX(200%)');
        break;
    }
  }

  isHided(centro: string) {
    if (centro !== this.selectedCentro()) {
      return 'hide';
    }
    return ''
  }
}
