import { Component, inject, OnInit, signal } from '@angular/core';
import { DhDataButton } from '../../../shared/buttons/dh-data-button/dh-data-button';
import { Router } from '@angular/router';
import { NgClass } from "@angular/common";
import { HumanDesignData } from '../../../core/models/dhdata.model';
import { FakeApi } from '../../../core/services/fake-api';

@Component({
  selector: 'app-human-design-home',
  imports: [DhDataButton, NgClass],
  templateUrl: './human-design-home.html',
  styleUrl: './human-design-home.scss',
})
export class HumanDesignHome implements OnInit{
  ngOnInit(): void {
   this.humanDesignData.set(this.api.getHumanDesignData())
  }

  isAlive = signal(false);
  router = inject(Router);
  readonly api = inject(FakeApi)

  buttonGroupClasses = "p-3 text-center gradient-primary-to-secondary-85 rounded-xl"
  titleButtonGroupClasses = "text-primary font-merriweather font-normal text-xl"
  gridButtonGroupClasses = "grid grid-cols-1 auto-rows-fr gap-2 mt-3"

  humanDesignData = signal<HumanDesignData | null>(null);

  navigateTo(path: string) {
    this.router.navigate([`human-design/${path}`]);
  }

  tipoAuricoData() {
    let data = this.humanDesignData()
    let stringList: string[] = []
    stringList.push(
      `Tipo Áurico: ${data?.tipo_aurico}`,
      `Estratégia: ${data?.estrategia}`,
      `Assinatura: ${data?.assinatura}`,
      `Tema do Não-Ser: ${data?.tema_do_nao_ser}`
    )
    return stringList
  }

  listToString(list: string[]) {
    let centrosDefinidosString: string = '';
    let counter = 0;
    list.forEach((c) => {
      if (counter < list.length - 1) {
        centrosDefinidosString += `${c}, `;
      } else {
        centrosDefinidosString += `${c}`;
      }
      counter += 1;
    });
    centrosDefinidosString = centrosDefinidosString;
    return centrosDefinidosString;
  }

  canaisToStringArray(list: any[]) {
    let stringList: string[] = [];
    list.forEach((c) => {
      let string = `${c.id}: ${c.nome}`;
      stringList.push(string);
    });
    return stringList;
  }

  portoesToStringArray(portao: any) {
    let stringList: string[] = [];
    let sol = `Sol: ${portao.sol}`;
    let terra = `Terra: ${portao.terra}`;
    let lua = `Lua: ${portao.lua}`;
    stringList.push(sol, terra, lua);
    return stringList;
  }

  encarnacaoToStringArray(encarnacao: any) {
    let stringList: string[] = [];
    let angulo = `Ângulo: ${encarnacao.angulo}`;
    let cruz = `${encarnacao.cruz}`;
    let portoes = `(${encarnacao.portoes})`;
    let quarto = `Quarto de Cruz: ${encarnacao.quarto_de_cruz}`;
    stringList.push(angulo, cruz, portoes, quarto);
    return stringList;
  }

  descriptionHtml() {
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
    `;
  }
}
