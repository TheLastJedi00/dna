import { Component, inject, input, OnInit, signal } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { DnaTitleCard } from '../../shared/cards/dna-title-card/dna-title-card';
import { DnaDescriptionCard } from '../../shared/cards/dna-description-card/dna-description-card';
import { Router } from '@angular/router';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { ListsCardGrid } from '../../shared/grid/lists-card-grid/lists-card-grid';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { SupplyService } from '../../core/services/supply.service';
import { Topic } from '../../core/models/supply.model';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-perfect-plain',
  imports: [
    UserPanelHeader,
    DnaTitleCard,
    DnaDescriptionCard,
    UserPanelFooter,
    ListsCardGrid,
    Infinity,
  ],
  templateUrl: './perfect-plain.html',
  styleUrl: './perfect-plain.scss',
})
export class PerfectPlain implements OnInit {
  private static readonly PILLAR = 'perfect-plain';

  userId = input.required<string>();
  router = inject(Router);
  private readonly supplyService = inject(SupplyService);

  topics = signal<Topic[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadTopics();
  }

  private async loadTopics() {
    try {
      const supply = await firstValueFrom(
        this.supplyService.getPerfectPlainModule(
          this.userId(),
          PerfectPlain.PILLAR
        ),
      );
      if (supply.topics && supply.topics.length > 0) {
        this.topics.set(supply.topics);
      } else {
        this.error.set('Conteúdo ainda não disponível.');
      }
    } catch (e) {
      console.error('Erro ao carregar o Plano Perfeito:', e);
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      this.error.set('Conteúdo ainda não disponível.');
    } finally {
      this.isLoading.set(false);
    }
  }

  descriptionHtml() {
    return `
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
`;
  }
}
