import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SupplyService } from '../../../core/services/supply.service';
import { Topic } from '../../../core/models/supply.model';
import { NumIntroCard } from '../../../shared/cards/num-intro-card/num-intro-card';
import { ListsCardGrid } from '../../../shared/grid/lists-card-grid/lists-card-grid';
import { Infinity } from '../../../shared/loading/infinity/infinity';
import { HttpErrorResponse } from '@angular/common/http';

interface ModuleConfig {
  title: string;
  supplyModules: string[];
}

@Component({
  selector: 'app-astrology-detail',
  imports: [NumIntroCard, ListsCardGrid, Infinity],
  templateUrl: './astrology-detail.html',
  styleUrl: './astrology-detail.scss',
})
export class AstrologyDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplyService = inject(SupplyService);

  readonly userId = signal('');
  readonly moduleKey = signal('');
  readonly moduleTitle = signal('');
  topics = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  private readonly MODULE_CONFIG: Record<string, ModuleConfig> = {
    'sol': { title: 'Sol', supplyModules: ['sol'] },
    'ascendente': { title: 'Ascendente', supplyModules: ['ascendente'] },
    'lua': { title: 'Lua', supplyModules: ['lua'] },
    'meio-ceu': { title: 'Meio do Céu', supplyModules: ['meio-ceu'] },
    'casa-dinheiro': { title: 'Casa do Dinheiro', supplyModules: ['casa-dinheiro'] },
    'casa-comunicacao': { title: 'Casa da Comunicação', supplyModules: ['casa-comunicacao'] },
    'elemento-fogo': { title: 'Elemento Fogo', supplyModules: ['elemento-fogo'] },
    'elemento-terra': { title: 'Elemento Terra', supplyModules: ['elemento-terra'] },
    'elemento-ar': { title: 'Elemento Ar', supplyModules: ['elemento-ar'] },
    'elemento-agua': { title: 'Elemento Água', supplyModules: ['elemento-agua'] },
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
          this.supplyService.getAstrologyModule(userId, supplyModule),
        );
        allTopics.push(...supply.topics);
      } catch (e) {
        console.error(`Erro ao carregar módulo ${supplyModule}:`, e);
        if(e instanceof HttpErrorResponse){
          alert(e.error.message)
        }
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
