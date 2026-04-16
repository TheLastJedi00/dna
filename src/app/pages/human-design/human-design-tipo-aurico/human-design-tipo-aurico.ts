import { Component, inject, OnInit, signal } from '@angular/core';
import { IconTextButton } from '../../../shared/buttons/icon-text-button/icon-text-button';
import { Router } from '@angular/router';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { FakeApi } from '../../../core/services/fake-api';
import { ListsCardGrid } from "../../../shared/grid/lists-card-grid/lists-card-grid";

@Component({
  selector: 'app-human-design-tipo-aurico',
  imports: [IconTextButton, VerticalAccordion, DhIntroCard, ListsCardGrid],
  templateUrl: './human-design-tipo-aurico.html',
  styleUrl: './human-design-tipo-aurico.scss',
})
export class HumanDesignTipoAurico implements OnInit {
  async ngOnInit() {
    const topicLists = await this.api.getAllTopicLists();
    this.topics.set(topicLists);
  }
  router = inject(Router);
  api = inject(FakeApi);
  topics = signal<any[] | null>(null);
  intro = signal(`Dentro do Sistema do Desenho Humano, você tem acesso
a uma sabedoria energética única que te mostra como flui
a sua energia, qual o seu papel no mundo, como tomar
decisões e como se alinha com a sua essência mais
verdadeira.`);
  introTipoAurico = `<p>
          É como se fosse o seu "estilo de ser energia" no mundo. Ele representa como a sua aura
          funciona, como você impacta os outros e como os outros te percebem.
        </p>
        <ol class="grid gap-2 mt-2 pl-2">
          <p>Existem 4 tipos principais:</p>
          <li>
            <b>Geradora:</b> Aura aberta e envolvente. Aqui para gerar energia, trabalhar com prazer
            e responder à vida.
          </li>
          <li>
            <b>Projetora:</b> Aura focada e penetrante. Aqui para guiar, enxergar os outros com
            profundidade e ser reconhecida.
          </li>
          <li>
            <b>Manifestadora:</b> Aura fechada e impactante. Aqui para iniciar, liderar movimentos e
            agir com liberdade.
          </li>
          <li>
            <b>Refletora:</b> Aura espelhada e sensível. Aqui para refletir o ambiente, oferecer
            sabedoria e viver com ciclos lunares.
          </li>
        </ol>
        <p class="mt-4 text-black/70">
          Além disso, há também uma variação do Tipo Geradora que é a <b>Geradora Manifestante</b>.
        </p>`;
  introEstrategia = `<p>É o seu modo natural de interagir com a vida. Cada Tipo
        tem uma Estratégia que, quando respeitada, abre caminhos
        e evita resistência.</p>`;
  titleClass = 'text-secondary font-merriweather font-normal text-xl';
  introAssinatura = `<p>É o sentimento que te mostra que você está vivendo
alinhada com a sua energia. É a sua sensação de paz
    interna e coerência com o seu propósito.</p>`;
  introNaoSer = `<p>É o sinal de alerta: aquele sentimento desconfortável que
surge quando você está fora do seu caminho, tentando ser
quem não é, ou cedendo a pressões externas.<br/><br/>
Saber esses quatro elementos e vivê-los com consciência é
como ter uma bússola energética para tudo na sua vida e
    no seu negócio.</p>`;
  navigateTo(path: string) {
    this.router.navigate([`human-design/${path}`]);
  }
}
