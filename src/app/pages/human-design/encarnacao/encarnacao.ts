import { Component, inject, OnInit, signal } from '@angular/core';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { FakeApi } from '../../../core/services/fake-api';
import { TopicList } from '../../../core/models/topiclist.model';
import { ListsCardGrid } from "../../../shared/grid/lists-card-grid/lists-card-grid";

@Component({
  selector: 'app-encarnacao',
  imports: [DhIntroCard, VerticalAccordion, ListsCardGrid ],
  templateUrl: './encarnacao.html',
  styleUrl: './encarnacao.scss',
})
export class Encarnacao implements OnInit {
  ngOnInit(): void {
    this.topics.set(this.api.getAllTopicLists());
  }

  api = inject(FakeApi);
  topics = signal<TopicList[] | null>(null);
  intro = signal([
    'A Cruz da Encarnação é a composição energética do seu propósito maior nesta vida.',
    'Ela representa o campo de força que sustenta o seu caminho de alma — aquilo que você naturalmente emana, realiza, transforma e ativa no mundo ao viver alinhada com sua essência.',
    'Ela é formada pela combinação dos 4 Portões ativados pelo Sol e pela Terra na sua Personalidade e no seu Desenho. Ou seja: os dois luminares mais poderosos em cada lado do seu gráfico (consciente e inconsciente). Essa composição cria uma assinatura única — a forma como a sua energia impacta o mundo.',
    'Além disso, cada Cruz pertence a um dos Quartos de Cruz da Mandala do Rave, que indica o campo temático da sua missão de alma, e também a um dos Grupos de Destino, que revelam a forma como sua energia se move no mundo e com os outros.',
  ]);
  grupos = signal(`
  <p>Os Grupos de Destino representam o tipo de jornada que sua alma escolheu viver nesta vida. Existem três:</p>
  <p><b>Ângulo Direito (Destino Pessoal):</b> Você está aqui para depender diretamente de interações cármicas com outras pessoas. Seu propósito se manifesta ao viver a sua verdade, com autenticidade e alinhamento.</p>
  <p><b>Justaposição (Destino Fixo):</b> Você vem com uma energia mais rígida, com um foco específico. Costuma ser um "elo" entre o destino pessoal e o coletivo, com uma forma mais singular de ser e viver.</p>
  <p><b>Ângulo Esquerdo (Destino Transpessoal):</b> Você veio para servir ao coletivo e cumprir contratos cármicos com outras pessoas. Seu propósito se revela através de relacionamentos, trocas e aprendizados que envolvem o outro.</p>
`);
}
