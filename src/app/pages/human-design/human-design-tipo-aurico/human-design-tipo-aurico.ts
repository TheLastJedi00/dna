import { Component, inject, signal } from '@angular/core';
import { IconTextButton } from '../../../shared/buttons/icon-text-button/icon-text-button';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';
import { TopicListCard } from '../../../shared/cards/topic-list-card/topic-list-card';

@Component({
  selector: 'app-human-design-tipo-aurico',
  imports: [IconTextButton, NgClass, VerticalAccordion, TopicListCard],
  templateUrl: './human-design-tipo-aurico.html',
  styleUrl: './human-design-tipo-aurico.scss',
})
export class HumanDesignTipoAurico {
  router = inject(Router);
  topics = signal([
    {
      titulo: 'Lorem Ipsum Dolor',
      items: [
        'Consectetur adipiscing',
        'Eiusmod tempor',
        'Incididunt ut labore',
        'Dolore magna aliqua',
        'Ut enim ad minim',
        'Quis nostrud exercitation',
        'Ullamco laboris nisi',
        'Ut aliquip ex ea',
        'Commodo consequat',
        'Duis aute irure',
      ],
    },
    {
      titulo: 'Sit Amet Consectetur',
      items: [
        'Reprehenderit in voluptate',
        'Velit esse cillum',
        'Dolore eu fugiat',
        'Nulla pariatur',
        'Excepteur sint occaecat',
        'Cupidatat non proident',
        'Sunt in culpa qui',
        'Officia deserunt mollit',
        'Anim id est laborum',
        'Perspiciatis unde omnis',
      ],
    },
    {
      titulo: 'Iste Natus Error',
      items: [
        'Voluptatem accusantium',
        'Doloremque laudantium',
        'Totam rem aperiam',
        'Eaque ipsa quae',
        'Ab illo inventore',
        'Veritatis et quasi',
        'Architecto beatae vitae',
        'Dicta sunt explicabo',
        'Nemo enim ipsam',
        'Voluptatem quia voluptas',
      ],
    },
    {
      titulo: 'Aspernatur Aut Odit',
      items: [
        'Aut fugit sed quia',
        'Magni dolores eos',
        'Qui ratione voluptatem',
        'Sequi nesciunt neque',
        'Porro quisquam est',
        'Qui dolorem ipsum',
        'Quia dolor sit amet',
        'Consectetur adipisci velit',
        'Sed quia non numquam',
        'Eius modi tempora',
      ],
    },
    {
      titulo: 'Incidunt Ut Labore',
      items: [
        'Magnam aliquam quaerat',
        'Voluptatem ut enim',
        'Ad minima veniam',
        'Quis nostrum exercitationem',
        'Ullam corporis suscipit',
        'Laboriosam nisi ut',
        'Aliquid ex ea commodi',
        'Consequatur autem vel',
        'Iure reprehenderit qui',
        'In ea voluptate velit',
      ],
    },
  ]);
  intro = `Dentro do Sistema do Desenho Humano, você tem acesso
a uma sabedoria energética única que te mostra como flui
a sua energia, qual o seu papel no mundo, como tomar
decisões e como se alinha com a sua essência mais
verdadeira.`;
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
