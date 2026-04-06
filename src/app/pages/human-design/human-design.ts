import { Component, inject } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { Heart } from "../../shared/icons/heart/heart";
import { Shield } from "../../shared/icons/shield/shield";
import { Bolt } from "../../shared/icons/bolt/bolt";
import { ChatBubble } from "../../shared/icons/chat-bubble/chat-bubble";
import { ChartPie } from "../../shared/icons/chart-pie/chart-pie";
import { Pencil } from "../../shared/icons/pencil/pencil";
import { Users } from "../../shared/icons/users/users";
import { Flag } from "../../shared/icons/flag/flag";
import { UserCircle } from "../../shared/icons/user-circle/user-circle";
import { Router } from '@angular/router';
@Component({
  selector: 'app-human-design',
  imports: [UserPanelHeader, Heart, Shield, Bolt, ChatBubble, ChartPie, Pencil, Users, Flag, UserCircle],
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
      cruz: 'Ângulo Direito Cruz da Explicação 3',
      portoes: '4/49 | 23/43',
      quarto_de_cruz: '3 - Dualidade',
    },
  };

  logout(){
    this.router.navigate(['login']);
  }

}
