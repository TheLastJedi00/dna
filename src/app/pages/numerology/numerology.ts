import { Component, inject, input } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { DnaTitleCard } from '../../shared/cards/dna-title-card/dna-title-card';
import { DnaDescriptionCard } from "../../shared/cards/dna-description-card/dna-description-card";
import { Router, RouterOutlet } from '@angular/router';
import { UserPanelFooter } from "../../shared/footers/user-panel-footer/user-panel-footer";

@Component({
  selector: 'app-numerology',
  imports: [UserPanelHeader, DnaTitleCard, DnaDescriptionCard, RouterOutlet, UserPanelFooter],
  templateUrl: './numerology.html',
  styleUrl: './numerology.scss',
})
export class Numerology {
  userId = input.required<string>();
  router = inject(Router);

  descriptionHtml() {
    return `
  <p><b>Numerologia:</b> É uma ciência milenar que estuda os números com o simbolismo profundo da Kabbalah (ou Cabala) Hebraica, oferecendo uma leitura precisa sobre a jornada da alma, os dons, desafios e propósitos de vida de uma pessoa.</p>
  <p>A <b>Numerologia Cabalística</b> se deriva da <b>Gematria</b> – uma parte da Cabala que estuda os números. A Gematria é um sistema de interpretação mística dos textos sagrados hebraicos que associa valores numéricos às letras do alfabeto hebraico.</p>
  <p>Essa prática surgiu no seio da <b>Kabbalah Judaica</b> como uma forma de revelar mensagens ocultas, relações espirituais e verdades divinas por trás das palavras e nomes sagrados. Na essência, a Gematria transforma letras em números e revela conexões simbólicas entre palavras diferentes que compartilham a mesma vibração numérica.</p>
  <p>A <b>Cabala</b> é uma tradição espiritual milenar considerada uma ciência da alma. A palavra Kabbalah significa literalmente <b>"recebimento"</b>. Na visão da Kabbalah:</p>
  <ul class="grid gap-2 list-disc list-inside">
    <li>O Universo foi criado a partir de <b>Leis Espirituais</b> organizadas e precisas.</li>
    <li>Cada alma nasce com um <b>propósito específico</b> e uma missão divina.</li>
    <li>A realidade material é apenas uma parte de um sistema muito mais amplo e invisível.</li>
    <li>Tudo no Universo é <b>energia vibracional</b>, incluindo letras, palavras, números e nomes.</li>
  </ul>
  <p>É justamente por isso que o nome de uma pessoa é considerado sagrado: ele carrega a frequência vibracional que codifica o propósito da alma. Registros históricos mostram a existência dessa ciência com mais de <b>8 mil anos</b>.</p>
  <p>A Numerologia Cabalística se fundamenta nos valores da <b>Tabela Hebraica</b>, o que confere a ela uma precisão refinada, tratando o nome de nascimento como um <b>"Código Sagrado"</b> da alma. Vamos analisar o seu Mapa?</p>
`;
  }
}
