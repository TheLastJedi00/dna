import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { IntroCard } from '../../../shared/cards/intro-card/intro-card';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { Infinity } from '../../../shared/loading/infinity/infinity';
import { HttpErrorResponse } from '@angular/common/http';

interface ModuleConfig {
  title: string;
  supplyModules: string[];
}

@Component({
  selector: 'app-numerology-detail',
  imports: [IntroCard, ListsCardGrid, Infinity],
  templateUrl: './numerology-detail.html',
  styleUrl: './numerology-detail.scss',
})
export class NumerologyDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  readonly moduleKey = signal('');
  readonly moduleTitle = signal('');
  topics = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

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
      this.error.set('Módulo não encontrado.');
      this.isLoading.set(false);
      return;
    }

    this.moduleTitle.set(config.title);
    await this.loadTopics(userId, config.supplyModules);
  }

  private async loadTopics(userId: string, supplyModules: string[]) {
    const allTopics: Topic[] = [];

    for (const supplyModule of supplyModules) {
      try {
        const supply = await firstValueFrom(
          this.supplyService.getNumerologyModule(userId, supplyModule),
        );
        allTopics.push(...supply.topics);
      } catch (e) {
        console.error(`Erro ao carregar módulo ${supplyModule}:`, e);
      }
    }

    if (allTopics.length > 0) {
      this.topics.set(allTopics);
    } else {
      this.error.set('Conteúdo ainda não disponível.');
    }

    this.isLoading.set(false);
  }
}
