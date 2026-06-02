import { Component, inject, input } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { DnaTitleCard } from '../../shared/cards/dna-title-card/dna-title-card';
import { DnaDescriptionCard } from "../../shared/cards/dna-description-card/dna-description-card";
import { Router, RouterOutlet } from '@angular/router';
import { UserPanelFooter } from "../../shared/footers/user-panel-footer/user-panel-footer";

@Component({
  selector: 'app-astrology',
  imports: [UserPanelHeader, DnaTitleCard, DnaDescriptionCard, RouterOutlet, UserPanelFooter],
  templateUrl: './astrology.html',
  styleUrl: './astrology.scss',
})
export class Astrology {
  userId = input.required<string>();
  router = inject(Router);

  descriptionHtml() {
    return `
  <p><b>Astrologia:</b> É uma linguagem simbólica milenar que observa os ciclos celestes para compreender os ciclos da vida na Terra. Muito além de adivinhações ou estereótipos de signos, a astrologia é uma ferramenta profunda de autoconhecimento, orientação e reconexão com a natureza cíclica da existência.</p>
  <p>Na vertente Ocidental — a mais conhecida no Brasil — o estudo parte do momento exato do seu nascimento: data, hora e local, que determinam o posicionamento dos planetas no céu naquele instante. A partir daí, é desenhada a chamada <b>mandala astrológica</b> ou <b>mapa natal</b>, um "retrato cósmico" do céu no exato momento em que você chegou ao mundo.</p>
  <p>Esse mapa não define quem você deve ser, mas revela com grande precisão quem você é em essência, seus potenciais, aprendizados, desafios e caminhos de realização.</p>
  <p>Mais a frente, você vai se deparar com os seguintes elementos que compõe o seu Mapa:</p>
  <ul class="grid gap-2 list-disc list-inside">
    <li><b>Os Signos:</b> mostram a qualidade da energia que você expressa.</li>
    <li><b>Os Planetas:</b> representam aspectos da sua psique.</li>
    <li><b>As Casas:</b> áreas da vida onde essa energia se manifesta.</li>
  </ul>
  <p>Além disso, aspectos entre os planetas mostram como essas partes de você se comunicam internamente, indicando talentos, conflitos, repetições e potencial de crescimento.</p>
  <p>A astrologia é conhecida como a <b>bússola de alma</b>. Ela serve para te lembrar do seu propósito, trazer clareza sobre seus ciclos e escolhas, e te ajudar a alinhar quem você é com o que você faz no mundo.</p>
  <p>Quando você conhece seu mapa, tem a oportunidade de viver com mais <b>autenticidade</b>, <b>consciência</b> e <b>propósito</b>.</p>
  <p>Aqui, no <b>DNA da Empresária</b>, vamos dar ênfase na sua <b>Tríade Astrológica</b> (Sol, Ascendente e Lua), que representa metade do seu Mapa Natal Astrológico; e, também, na Casas da <b>Missão</b>, <b>Dinheiro</b> e <b>Comunicação</b>.</p>
  <p>Vamos analisar o seu Mapa?</p>
`;
  }
}
