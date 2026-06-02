import { Injectable } from '@angular/core';
import { TopicList } from '../models/topiclist.model';
import { HumanDesignData } from '../models/dhdata.model';
import { UserData } from '../models/userdata.model';
import { NumerologyData } from '../models/numdata.model';
import { LeituraAstrologica } from '../models/astrology.model';

@Injectable({
  providedIn: 'root',
})
export class FakeApi {
  getAllTopicLists(): TopicList[] {
    return [
      {
        title: 'Lorem Ipsum Dolor',
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
        title: 'Sit Amet Consectetur',
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
        title: 'Iste Natus Error',
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
        title: 'Aspernatur Aut Odit',
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
        title: 'Incidunt Ut Labore',
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

  getNumerologyData(): NumerologyData {
    return {
      userId: "1234",
      perfil: {
        motivacao: 6,
        impressao: 1,
        expressao: 7,
        destino: 4,
        missao: 11,
        data_natalicia: 12,
        numero_psiquico: 3,
        talento_oculto: 4,
      },
      ciclos_de_vida: [
        { inicio: 2000, fim: 2033, numero: 8 },
        { inicio: 2033, fim: 2060, numero: 3 },
        { inicio: 2060, fim: '∞', numero: 2 },
      ],
      desafios: [
        { inicio: 2000, fim: 2033, numero: 5 },
        { inicio: 2033, fim: 2060, numero: 1 },
        { inicio: 2060, fim: '∞', numero: 4 },
      ],
      momentos_decisivos: [
        { inicio: 2000, fim: 2033, numero: 11 },
        { inicio: 2033, fim: 2042, numero: 5 },
        { inicio: 2042, fim: 2051, numero: 7 },
        { inicio: 2051, fim: '∞', numero: 1 },
      ],
      ano_pessoal: {
        atual: { numero: 2, validade: 'até 11/08/26' },
        proximo: { numero: 3, validade: 'de 12/08/26 até 11/08/27' },
      },
      extras: {
        tendencias_ocultas: [1, 2],
        respostas_subconscientes: 7,
        numeros_favoraveis: [1, 6, 12, 13, 19, 20, 26, 27],
      },
    };
  }

  getAstrologyData(): LeituraAstrologica {
    return {
      triadeAstrologica: {
        sol: { signo: 'Leão', casaAstrologica: 5, planetas: 'Sol' },
        ascendente: { signo: 'Escorpião', casaAstrologica: 1, planetas: null },
        lua: { signo: 'Peixes', casaAstrologica: 4, planetas: 'Lua' },
      },
      meioDoCeu: { signo: 'Leão', casaAstrologica: 10, planetas: 'Sol' },
      dinheiro: { signo: 'Sagitário', casaAstrologica: 2, planetas: 'Júpiter' },
      comunicacao: { signo: 'Virgem', casaAstrologica: 3, planetas: 'Mercúrio' },
      elementos: { fogo: 4, terra: 2, ar: 3, agua: 3 },
    };
  }

  getUserData(): UserData {
    return {
      fullName: 'Bárbara Farias da Cruz',
      birthDate: '12/08/2000',
      birthPlace: 'Belém/PA',
      birthTime: '18h25',
      role: 'MANAGER',
      
    };
  }
}
