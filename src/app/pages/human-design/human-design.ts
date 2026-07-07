import { Component, inject, input } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { Router, RouterOutlet } from '@angular/router';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { DnaTitleCard } from "../../shared/cards/dna-title-card/dna-title-card";
import { DnaDescriptionCard } from "../../shared/cards/dna-description-card/dna-description-card";
@Component({
  selector: 'app-human-design',
  imports: [UserPanelHeader, UserPanelFooter, DnaTitleCard, DnaDescriptionCard, RouterOutlet],
  templateUrl: './human-design.html',
  styleUrl: './human-design.scss',
})
export class HumanDesign {
  userId = input.required<string>();
  router = inject(Router);

  logout() {
    this.router.navigate(['login']);
  }

  descriptionHtml(){
    return `
      <p>
        O Desenho Humano é conhecido como a Ciência da Diferenciação, canalizada pelo
        <b>Ra Uru Hu</b>, que foi o mensageiro deste Sistema e que, desde esse momento, dedicou a
        sua vida à disseminação desta Ciência da Diferenciação por todo o mundo.
      </p>
      <p>
        O Desenho Humano é um sistema abrangente e integrativo que combina elementos de várias
        disciplinas antigas e modernas para ajudar os indivíduos a entender sua personalidade única,
        seu processo de tomada de decisão e seu propósito de vida.
      </p>
      <p>
        É uma ferramenta de autoconhecimento que se baseia em filosofias milenares como o
        <b>I-Ching</b>, o sistema de <b>Chakras</b>, a <b>Cabala</b> e a <b>Astrologia</b>, e em
        ciências contemporâneas como a <b>Física Quântica</b> ou a <b>Genética</b>.
      </p>
      <p>
        Assim, através do Desenho Humano, você tem um mapa abrangente do seu próprio projeto
        energético como um indivíduo.
      </p>
      <p>
        Para esse mapa que é gerado através da sua data, horário e local de nascimento, chamamos de
        <b>Corpo Gráfico</b> que, em si, é um mapa preciso que te dá acesso a como você é projetada
        geneticamente para interagir com o mundo, tanto de forma Consciente
        <b>(Personalidade)</b> como Inconsciente <b>(Desenho/Alma)</b>.
      </p>
      <p>
        Esse gráfico revela quem você realmente é, como ser você mesma e como trabalhar com sucesso
        num mundo dirigido pelo tempo relógio e sempre mutável.
      </p>
      <p>
        Com ele você tem as ferramentas para uma vida consciente, criativa e autorresponsável,
        eliminando resistências e medos, se alinhando com pessoas que realmente façam sentindo para
        a sua jornada.
      </p>
    `
  }
}
