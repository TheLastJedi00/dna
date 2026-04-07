import { Component, inject } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { Router } from '@angular/router';
import { DhDataButton } from '../../shared/buttons/dh-data-button/dh-data-button';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
@Component({
  selector: 'app-human-design',
  imports: [UserPanelHeader, DhDataButton, UserPanelFooter],
  templateUrl: './human-design.html',
  styleUrl: './human-design.scss',
})
export class HumanDesign {
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

  logout() {
    this.router.navigate(['login']);
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

  canaisToStringArray(list: any[]){
    let stringList: string[] = []
    list.forEach((c) => {
      let string = `${c.id}: ${c.nome}`
      stringList.push(string);
    })
    return stringList;
  }

  portoesToStringArray(portao: any){
    let stringList: string[] = []
    let sol = `Sol: ${portao.sol}`
    let terra = `Terra: ${portao.terra}`
    let lua = `Lua: ${portao.lua}`
    stringList.push(sol, terra, lua)
    return stringList;
  }

  encarnacaoToStringArray(encarnacao: any){
    let stringList: string[] = [];
    let angulo = `Ângulo: ${encarnacao.angulo}`
    let cruz = `${encarnacao.cruz}`
    let portoes = `(${encarnacao.portoes})`
    let quarto = `Quarto de Cruz: ${encarnacao.quarto_de_cruz}`;
    stringList.push(angulo, cruz, portoes, quarto)
    return stringList;
  }
}
