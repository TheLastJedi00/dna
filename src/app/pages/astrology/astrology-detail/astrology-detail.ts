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
  selector: 'app-astrology-detail',
  imports: [IntroCard, ListsCardGrid, PillarLoad],
  templateUrl: './astrology-detail.html',
  styleUrl: './astrology-detail.scss',
})
export class AstrologyDetail implements OnInit {
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
        this.supplyModules.map((m) => () => this.supplyService.getAstrologyModule(this.userId(), m)),
      ),
    { isEmpty: (topics) => topics.length === 0 },
  );
  readonly topics = computed(() => this.content.data());
  readonly emptyMessage = computed(() =>
    this.unknownModule() ? 'Módulo não encontrado.' : 'Conteúdo ainda não disponível.',
  );

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
      this.unknownModule.set(true);
      this.content.set([]);
      return;
    }

    this.moduleTitle.set(config.title);
    this.supplyModules = config.supplyModules;
    await this.content.load();
  }
}
