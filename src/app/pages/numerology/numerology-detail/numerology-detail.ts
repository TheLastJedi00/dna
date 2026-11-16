import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { IntroCard } from '../../../shared/cards/intro-card/intro-card';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { loadState } from '../../../core/utils/load-state';
import { fetchSupplyTopics } from '../../../core/utils/supply-topics';
import { PillarLoad } from '../../../shared/feedback/pillar-load/pillar-load';

interface ModuleConfig {
  title: string;
  supplyModules: string[];
}

@Component({
  selector: 'app-numerology-detail',
  imports: [IntroCard, ListsCardGrid, PillarLoad],
  templateUrl: './numerology-detail.html',
  styleUrl: './numerology-detail.scss',
})
export class NumerologyDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  readonly moduleKey = signal('');
  readonly moduleTitle = signal('');
  /** Módulo pedido na URL não existe (vira o estado vazio, sem requisição). */
  private readonly unknownModule = signal(false);
  private supplyModules: string[] = [];
  /** Tópicos do supply: skeleton, erro com "Tentar novamente" ou vazio. */
  readonly content = loadState(
    () =>
      fetchSupplyTopics(
        this.supplyModules.map((m) => () => this.supplyService.getNumerologyModule(this.userId(), m)),
      ),
    { isEmpty: (topics) => topics.length === 0 },
  );
  readonly topics = computed(() => this.content.data());
  readonly emptyMessage = computed(() =>
    this.unknownModule() ? 'Módulo não encontrado.' : 'Conteúdo ainda não disponível.',
  );

  private readonly MODULE_CONFIG: Record<string, ModuleConfig> = {
    'motivacao': { title: 'Motivação', supplyModules: ['motivacao'] },
    'impressao': { title: 'Impressão', supplyModules: ['impressao'] },
    'expressao': { title: 'Expressão', supplyModules: ['expressao'] },
    'destino': { title: 'Destino', supplyModules: ['destino'] },
    'missao': { title: 'Missão', supplyModules: ['missao'] },
    'numero-natalicio': { title: 'Data Natalícia', supplyModules: ['numero-natalicio'] },
    'numero-psiquico': { title: 'Número Psíquico', supplyModules: ['numero-psiquico'] },
    'talento-oculto': { title: 'Talento Oculto', supplyModules: ['talento-oculto'] },
    'ciclos-de-vida': {
      title: 'Ciclos de Vida',
      supplyModules: ['ciclos-de-vida-1-formativo', 'ciclos-de-vida-2-produtivo', 'ciclos-de-vida-3-colheita'],
    },
    'desafios': {
      title: 'Desafios de Vida',
      supplyModules: ['desafios-de-vida-primeiro', 'desafios-de-vida-segundo', 'desafios-de-vida-principal'],
    },
    'momentos-decisivos': {
      title: 'Momentos Decisivos',
      supplyModules: [
        'momentos-desafios-primeiro-decisivo',
        'momentos-desafios-segundo-decisivo',
        'momentos-desafios-terceiro-decisivo',
        'momentos-desafios-quarto-decisivo',
      ],
    },
    'ano-pessoal': {
      title: 'Ano Pessoal',
      supplyModules: ['ano-pessoal-atual', 'ano-pessoal-proximo'],
    },
    'tendencias-ocultas': { title: 'Tendências Ocultas', supplyModules: ['tendencias-ocultas'] },
    'resposta-subconsciente': { title: 'Resposta Subconsciente', supplyModules: ['resposta-subconsciente'] },
    'conclusao': { title: 'Conclusão', supplyModules: ['conclusao'] },
  };

  async ngOnInit() {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    const module = this.route.snapshot.paramMap.get('module') ?? '';
    this.userId.set(userId);
    this.moduleKey.set(module);

    const config = this.MODULE_CONFIG[module];
    if (!config) {
      this.unknownModule.set(true);
      this.content.set([]);
      return;
    }

    this.moduleTitle.set(config.title);
    this.supplyModules = config.supplyModules;
    await this.content.load();
  }
}
