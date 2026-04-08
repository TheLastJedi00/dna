import { Component, inject } from '@angular/core';
import { DhDataButton } from '../../../shared/buttons/dh-data-button/dh-data-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-human-design-home',
  imports: [DhDataButton],
  templateUrl: './human-design-home.html',
  styleUrl: './human-design-home.scss',
})
export class HumanDesignHome {
  router = inject(Router);

  humanDesignData = {
    tipo_aurico: 'Projetora',
    aura: 'Focalizada e Absorvente',
    energia: 'Não Energético',
    palavra_chave: 'Guia',
    estrategia: 'Aguardar Pelo Convite',
    assinatura: 'Sucesso',
    tema_do_nao_ser: 'Amargura',
    autoridade: 'Autoprojetada',
    perfil: '2/4',
    centros_energeticos: {
      definidos: ['Centro G', 'Garganta', 'Ajna'],
      indefinidos: ['Cabeça', 'Ego/Coração', 'Plexo Solar', 'Raiz', 'Sacral'],
      abertos: ['Esplênico'],
    },
    canais: [
      {
        id: '33-13',
        nome: 'Canal do Prodígio',
      },
      {
        id: '43-23',
        nome: 'Canal da Estruturação',
      },
    ],
    ativacoes: {
      personalidade: {
        sol: 4,
        terra: 49,
        lua: 61,
      },
      desenho: {
        sol: 23,
        terra: 43,
        lua: 47,
      },
    },
    encarnacao: {
      angulo: 'Direito',
      cruz: 'Cruz da Explicação 3',
      portoes: '4/49 | 23/43',
      quarto_de_cruz: '3 - Dualidade',
    },
  };

  navigateTo(path: string) {
    this.router.navigate([`human-design/${path}`]);
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
