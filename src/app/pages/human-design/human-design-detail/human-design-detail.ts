import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserContextService } from '../../../core/services/user-context.service';
import { firstValueFrom } from 'rxjs';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { DhIntroCard } from '../../../shared/cards/dh-intro-card/dh-intro-card';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { Infinity } from '../../../shared/loading/infinity/infinity';
import { HttpErrorResponse } from '@angular/common/http';
import { VerticalAccordion } from '../../../shared/accordions/vertical-accordion/vertical-accordion';

interface AccordionConfig {
  title: string;
  content: string;
}

interface ModuleConfig {
  title: string;
  supplyModule: string;
  singleIntro?: string;
  arrayIntro?: string[];
  accordions?: AccordionConfig[];
  paragraphsAfter?: string[];
}

@Component({
  selector: 'app-human-design-detail',
  imports: [DhIntroCard, ListsCardGrid, Infinity, VerticalAccordion],
  templateUrl: './human-design-detail.html',
  styleUrl: './human-design-detail.scss',
})
export class HumanDesignDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userContext = inject(UserContextService);
  private readonly supplyService = inject(SupplyService);
  readonly userId = signal('');
  readonly moduleKey = signal('');
  topics = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  config = signal<ModuleConfig | null>(null);

  private readonly MODULE_CONFIG: Record<string, ModuleConfig> = {
    'tipo-aurico': {
      title: 'Tipo Áurico, Estratégia, Assinatura e Não-Ser',
      supplyModule: 'tipo-aurico',
      singleIntro: `Dentro do Sistema do Desenho Humano, você tem acesso
a uma sabedoria energética única que te mostra como flui
a sua energia, qual o seu papel no mundo, como tomar
decisões e como se alinha com a sua essência mais
verdadeira.`,
      accordions: [
        {
          title: 'Tipo Áurico',
          content: `<p>
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
        </p>`
        },
        {
          title: 'Estratégia',
          content: `<p>É o seu modo natural de interagir com a vida. Cada Tipo
        tem uma Estratégia que, quando respeitada, abre caminhos
        e evita resistência.</p>`
        },
        {
          title: 'Assinatura',
          content: `<p>É o sentimento que te mostra que você está vivendo
alinhada com a sua energia. É a sua sensação de paz
    interna e coerência com o seu propósito.</p>`
        },
        {
          title: 'Tema do Não-Ser',
          content: `<p>É o sinal de alerta: aquele sentimento desconfortável que
surge quando você está fora do seu caminho, tentando ser
quem não é, ou cedendo a pressões externas.<br/><br/>
Saber esses quatro elementos e vivê-los com consciência é
como ter uma bússola energética para tudo na sua vida e
    no seu negócio.</p>`
        }
      ]
    },
    'autoridade': {
      title: 'Autoridade',
      supplyModule: 'autoridade',
      arrayIntro: [
        'Dentro do Desenho Humano, a Autoridade representa o seu centro interno de tomada de decisão, o lugar da sua energia (não da mente) onde mora a sua verdade.',
        'Quando você toma decisões a partir da sua Autoridade, você age em alinhamento com a sua energia, e a vida começa a fluir com menos resistência.',
        'Quando você ignora sua Autoridade Interna e decide com base em pressões externas, medos ou mente racional, geralmente o resultado é desconforto, frustração ou arrependimento.',
        'É importante entender que, segundo o Desenho Humano, a mente nunca deve ser usada para tomar decisões pessoais. Ela é ótima para observar, aprender, ensinar, planejar e comunicar — mas quando colocamos a mente no trono das decisões, acabamos nos desconectando da nossa sabedoria corporal.',
        'Cada pessoa tem uma Autoridade específica, baseada na configuração dos seus centros energéticos.',
        'Isso quer dizer que não existe uma fórmula universal: cada corpo tem um tipo de sabedoria própria, e é isso que torna cada jornada tão única.'
      ],
      accordions: [
        {
          title: 'Quais são os tipos de Autoridade?',
          content: `<p><b>Plexo Solar / Emocional:</b> Decisões devem ser feitas após o tempo necessário para ganhar clareza emocional. Não decida no calor da emoção.</p>
  <p><b>Sacral:</b> A decisão é sentida no corpo, de forma instintiva e imediata. Se for um "aham", vá. Se for um "não sei", espere.</p>
  <p><b>Esplênica:</b> A decisão vem como um sussurro intuitivo e rápido. Confie no primeiro impulso corporal.</p>
  <p><b>Ego (Centro do Coração):</b> A decisão correta é aquela que afirma seu valor pessoal e desejo genuíno.</p>
  <p><b>Auto-Projetada:</b> Você acessa sua verdade ao escutar a si mesma falando. Decisões vêm pela verbalização do que ressoa.</p>
  <p><b>Caixa de Ressonância / Mental / Ambiental:</b> Mais comum em Projetores com Centro Ajna definido e Centro da Autoridade indefinido. A decisão se dá ao falar com outras pessoas e observar como certas ideias ressoam no ambiente.</p>
  <p><b>Ciclo Lunar (Refletores):</b> As decisões devem ser feitas em ciclos completos de 28 dias. A clareza vem com o tempo e os ciclos.</p>
`
        }
      ]
    },
    'perfil': {
      title: 'Perfil',
      supplyModule: 'perfil',
      arrayIntro: [
        'No Desenho Humano, o Perfil é uma das peças mais importantes do seu mapa. Ele revela como você vive a sua experiência humana, como aprende, como se conecta com os outros e como constrói sua identidade no mundo.',
        'Se o Tipo Áurico fala sobre a sua energia e forma de agir, o Perfil mostra o papel que você representa nessa vida — a sua "roupagem de alma".',
        'Cada pessoa nasce com um Perfil composto por duas Linhas — a primeira vem da posição do Sol na sua Personalidade (consciente) e a segunda vem do Sol no seu Desenho (inconsciente). Essa combinação forma um arco narrativo da sua jornada: como você se enxerga + como o mundo te enxerga + como você age no mundo.',
        'Existem 12 Perfis possíveis no Desenho Humano, cada um formado por combinações entre as 6 Linhas de base. Cada linha representa uma frequência arquetípica, um modo de ser e se mover.'
      ],
      accordions: [
        {
          title: 'Tipos possíveis de Perfil:',
          content: `<p><b>Linha 1 – O Investigador:</b> Precisa de segurança, base sólida e conhecimento profundo.</p>
  <p><b>Linha 2 – O Natural / Eremita:</b> Tem dons inatos e precisa de espaço e tempo para si.</p>
  <p><b>Linha 3 – O Martir / Experimentador:</b> Aprende pela tentativa e erro, precisa liberdade para testar.</p>
  <p><b>Linha 4 – O Influenciador / Amigo:</b> Cresce por meio das suas conexões próximas e redes de apoio.</p>
  <p><b>Linha 5 – O Herói / Solucionador:</b> Resolve problemas dos outros, tem aura projetada e magnética.</p>
  <p><b>Linha 6 – O Exemplo / Modelo de Vida:</b> Vive em três fases e se torna um guia sábio depois dos 50 anos.</p>`
        }
      ],
      paragraphsAfter: [
        'O Perfil é como o "caminho da sua atuação no palco da vida" — e quando você vive de acordo com ele, sente-se coerente, leve e potente. Quando ignora ou tenta viver o Perfil de outra pessoa, sente-se deslocada, drenada ou desconectada.'
      ]
    },
    'encarnacao': {
      title: 'Cruz Da Encarnação',
      supplyModule: 'encarnacao',
      arrayIntro: [
        'A Cruz da Encarnação é a composição energética do seu propósito maior nesta vida.',
        'Ela representa o campo de força que sustenta o seu caminho de alma — aquilo que você naturalmente emana, realiza, transforma e ativa no mundo ao viver alinhada com sua essência.',
        'Ela é formada pela combinação dos 4 Portões ativados pelo Sol e pela Terra na sua Personalidade e no seu Desenho. Essa composição cria uma assinatura única — a forma como a sua energia impacta o mundo.',
        'Além disso, cada Cruz pertence a um dos Quartos de Cruz da Mandala do Rave, que indica o campo temático da sua missão de alma, e também a um dos Grupos de Destino.'
      ],
      accordions: [
        {
          title: 'Grupos de Destino',
          content: `<p>Os Grupos de Destino representam o tipo de jornada que sua alma escolheu viver nesta vida. Existem três:</p>
  <p><b>Ângulo Direito (Destino Pessoal):</b> Você está aqui para depender diretamente de interações cármicas. Seu propósito se manifesta ao viver a sua verdade.</p>
  <p><b>Justaposição (Destino Fixo):</b> Você vem com um foco específico. Costuma ser um "elo" entre o destino pessoal e o coletivo.</p>
  <p><b>Ângulo Esquerdo (Destino Transpessoal):</b> Você veio para servir ao coletivo. Seu propósito se revela através de relacionamentos e trocas.</p>`
        }
      ]
    },
    'centros-definidos': {
      title: 'Centros Definidos',
      supplyModule: 'centros-definidos',
      arrayIntro: [
        'No Desenho Humano, os Centros Energéticos representam áreas específicas do seu campo energético e do seu corpo físico.',
        'Eles são inspirados pelos centros dos sistemas hindu (chakras), cabalístico (Árvore da Vida) e chinês (I Ching), e compõem o que chamamos de Corpo Gráfico — o mapa único da sua energia.',
        'Existem 9 Centros no Desenho Humano, e cada um está relacionado a: uma função psicoespiritual específica; uma parte biológica do corpo; uma forma de expressão ou percepção energética.',
        'Esses Centros podem aparecer de três formas: Definidos, Indefinidos ou Abertos.'
      ],
      accordions: [
        {
          title: 'Centros Definidos',
          content: `Representam áreas da sua vida onde você é consistente, estável e autossuficiente. Você emite energia por esses centros. São seus pontos de firmeza e assinatura energética.`
        }
      ],
      paragraphsAfter: [
        'Compreender seus Centros é fundamental para entender como você opera energeticamente, onde você tem estabilidade, onde você pode se perder, e onde você tem sabedoria natural ao observar os outros.'
      ]
    },
    'centros-indefinidos': {
      title: 'Centros Indefinidos',
      supplyModule: 'centros-indefinidos',
      arrayIntro: [
        'No Desenho Humano, os Centros Energéticos representam áreas específicas do seu campo energético e do seu corpo físico.',
        'Eles são inspirados pelos centros dos sistemas hindu (chakras), cabalístico (Árvore da Vida) e chinês (I Ching), e compõem o que chamamos de Corpo Gráfico — o mapa único da sua energia.',
        'Existem 9 Centros no Desenho Humano, e cada um está relacionado a: uma função psicoespiritual específica; uma parte biológica do corpo; uma forma de expressão ou percepção energética.',
        'Esses Centros podem aparecer de três formas: Definidos, Indefinidos ou Abertos.'
      ],
      accordions: [
        {
          title: 'Centros Indefinidos',
          content: `Com canais parcialmente ativados, eles representam áreas onde você é influenciável, pois absorve, amplia e reflete a energia dos outros. Aqui você aprende por contraste.`
        }
      ],
      paragraphsAfter: [
        'Compreender seus Centros é fundamental para entender como você opera energeticamente, onde você tem estabilidade, onde você pode se perder, e onde você tem sabedoria natural ao observar os outros.'
      ]
    },
    'centros-abertos': {
      title: 'Centros Abertos',
      supplyModule: 'centros-abertos',
      arrayIntro: [
        'No Desenho Humano, os Centros Energéticos representam áreas específicas do seu campo energético e do seu corpo físico.',
        'Eles são inspirados pelos centros dos sistemas hindu (chakras), cabalístico (Árvore da Vida) e chinês (I Ching), e compõem o que chamamos de Corpo Gráfico — o mapa único da sua energia.',
        'Existem 9 Centros no Desenho Humano, e cada um está relacionado a: uma função psicoespiritual específica; uma parte biológica do corpo; uma forma de expressão ou percepção energética.',
        'Esses Centros podem aparecer de três formas: Definidos, Indefinidos ou Abertos.'
      ],
      accordions: [
        {
          title: 'Centros Abertos',
          content: `Sem nenhum canal conectado a eles, são espaços de extrema sensibilidade e sabedoria potencial — se você aprender a navegar neles com consciência.`
        }
      ],
      paragraphsAfter: [
        'Compreender seus Centros é fundamental para entender como você opera energeticamente, onde você tem estabilidade, onde você pode se perder, e onde você tem sabedoria natural ao observar os outros.'
      ]
    }
  };

  async ngOnInit() {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    const module = this.route.snapshot.paramMap.get('module') ?? '';
    this.userId.set(userId);
    this.moduleKey.set(module);

    const config = this.MODULE_CONFIG[module];
    if (!config) {
      this.error.set('Módulo não encontrado.');
      this.isLoading.set(false);
      return;
    }

    this.config.set(config);
    await this.loadTopics(userId, config.supplyModule);
  }

  private async loadTopics(userId: string, supplyModule: string) {
    try {
      const supply = await firstValueFrom(
        this.supplyService.getHumanDesignModule(userId, supplyModule),
      );
      if (supply.topics && supply.topics.length > 0) {
        this.topics.set(supply.topics);
      } else {
        this.error.set('Conteúdo ainda não disponível.');
      }
    } catch (e) {
      console.error(`Erro ao carregar módulo ${supplyModule}:`, e);
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      this.error.set('Conteúdo ainda não disponível.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
