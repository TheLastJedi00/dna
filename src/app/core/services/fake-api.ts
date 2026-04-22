import { Injectable } from '@angular/core';
import { TopicList } from '../models/topiclist.model';
import { HumanDesignData } from '../models/dhdata.model';
import { UserData } from '../models/userdata.model';

@Injectable({
  providedIn: 'root',
})
export class FakeApi {
  getAllTopicLists(): TopicList[] {
    return [
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
    ];
  }

  getHumanDesignData(): HumanDesignData {
    return {
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
  }

  getUserData():UserData {
    return {
      fullName: 'Bárbara Farias da Cruz',
      birthDate: '12/08/2000',
      birthPlace: 'Belém/PA',
      birthTime: '18h25'
    }
  }
}
