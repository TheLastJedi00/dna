import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { IconTextButton } from '../../shared/buttons/icon-text-button/icon-text-button';
import { AnalystList } from '../../shared/list/analyst-list/analyst-list';
import {
  AnalystForm,
  AnalystFormValue,
} from '../../shared/forms/analyst-form/analyst-form';
import { AnalystDetailsModal } from '../../shared/modal/analyst-details-modal/analyst-details-modal';
import { loadState } from '../../core/utils/load-state';
import { SkeletonList } from '../../shared/feedback/skeleton-list/skeleton-list';
import { LoadError } from '../../shared/feedback/load-error/load-error';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { AnalystService } from '../../core/services/analyst.service';
import { AnalystData, LinkedMaestra } from '../../core/models/analyst.model';
import { UserStatusFilter } from '../../core/models/userdata.model';

/**
 * Página smart de gestão de Analistas (ADMIN/MANAGER). Espelha a page de
 * Maestras: dona do estado (lista, busca, filtro de status e paginação) e única
 * a falar com o AnalystService — os componentes de apresentação recebem dados
 * prontos e devolvem intenções.
 */
@Component({
  selector: 'app-analysts-management',
  imports: [
    UserPanelHeader,
    UserPanelFooter,
    IconTextButton,
    AnalystList,
    AnalystForm,
    AnalystDetailsModal,
    Infinity,
    SkeletonList,
    LoadError,
    FormsModule,
  ],
  templateUrl: './analysts-management.html',
})
export class AnalystsManagement implements OnInit {
  readonly router = inject(Router);
  private readonly analystService = inject(AnalystService);

  /** Leitura da página atual: skeleton enquanto carrega, erro inline se falhar. */
  readonly list = loadState(() =>
    this.analystService.listAnalysts({
      page: this.page(),
      pageSize: this.pageSize(),
      name: this.search().trim() || undefined,
      status: this.status(),
    }),
  );
  readonly analysts = computed(() => this.list.data()?.items ?? []);
  readonly total = computed(() => this.list.data()?.total ?? 0);
  readonly totalPages = computed(() => Math.max(1, this.list.data()?.totalPages ?? 1));
  page = signal(1);
  pageSize = signal(9);
  /** Ação em curso (criar/editar/desativar/reativar/senha): overlay de tela cheia. */
  isActionRunning = signal(false);
  search = signal('');
  status = signal<UserStatusFilter>('active');

  /** Analista aberto no modal de detalhes; null = modal fechado. */
  selected = signal<AnalystData | null>(null);
  /** Detalhe do Analista aberto (e-mail e senha provisória só vêm daqui). */
  readonly detail = loadState(() => this.analystService.findAnalystById(this.selected()!.id!), {
    initial: 'idle',
  });
  /** Carteira do Analista aberto (supervisão), carregada sob demanda. */
  readonly maestrasState = loadState(
    () => this.analystService.findLinkedMaestras(this.selected()!.id!),
    { initial: 'idle' },
  );
  readonly linkedMaestras = computed(() => this.maestrasState.data() ?? []);
  /** Analista em edição; null = o form está em modo criação. */
  editing = signal<AnalystData | null>(null);
  isFormOpen = signal(false);

  private searchDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.load();
  }

  load() {
    return this.list.load();
  }

  onSearchChange(value: string) {
    this.search.set(value);
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.page.set(1);
      this.load();
    }, 350);
  }

  setStatus(status: UserStatusFilter) {
    if (this.status() === status) return;
    this.status.set(status);
    this.page.set(1);
    this.load();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.page.set(page);
    this.load();
  }

  /**
   * Abre o detalhe e busca, sob demanda e em paralelo, o próprio detalhe —
   * e-mail e senha provisória só existem no `GET /analysts/:id`, nunca na
   * listagem — e a carteira do Analista. Cada parte tem skeleton e erro próprios.
   */
  async openDetails(analyst: AnalystData) {
    this.selected.set(analyst);
    if (!analyst.id) return;
    await Promise.all([this.loadDetail(), this.maestrasState.load()]);
  }

  /** Busca o detalhe do Analista aberto (também é o "Tentar novamente"). */
  async loadDetail() {
    const id = this.selected()?.id;
    if (!id) return;
    await this.detail.load();
    const detail = this.detail.data();
    // Se o Manager fechou o modal enquanto a busca estava em voo, o resultado
    // já não interessa (e reabriria a supervisão do analista errado).
    if (detail && this.selected()?.id === id) {
      this.selected.set(detail);
    }
  }

  /** Gera a senha provisória e recarrega o detalhe para exibi-la. */
  async generateTempPassword(password: string) {
    const analyst = this.selected();
    if (!analyst?.id) return;
    this.isActionRunning.set(true);
    try {
      await firstValueFrom(this.analystService.setTempPassword(analyst.id, password));
    } catch {
      return; // erro de ação exibido pelo modal global (errorInterceptor)
    } finally {
      this.isActionRunning.set(false);
    }
    await this.loadDetail();
  }

  closeDetails() {
    this.selected.set(null);
    this.detail.reset();
    this.maestrasState.reset();
  }

  /** Detalhes → Editar: fecha o modal e reabre o form já preenchido. */
  startEdit() {
    this.editing.set(this.selected());
    this.selected.set(null);
    this.isFormOpen.set(true);
  }

  onFormClosed() {
    this.isFormOpen.set(false);
    this.editing.set(null);
  }

  /** Um único ponto de escrita: cria ou edita conforme o modo do form. */
  async onFormSaved(value: AnalystFormValue) {
    const editing = this.editing();
    this.isActionRunning.set(true);
    try {
      if (editing) {
        await firstValueFrom(
          this.analystService.updateAnalyst(editing.id!, {
            fullName: value.fullName,
          }),
        );
      } else {
        await firstValueFrom(this.analystService.createAnalyst(value));
      }
      this.onFormClosed();
      await this.load();
    } catch {
      // erro de ação exibido pelo modal global (errorInterceptor)
    } finally {
      this.isActionRunning.set(false);
    }
  }

  async disableAnalyst() {
    await this.runAction((id) => this.analystService.disableAnalyst(id));
  }

  async reactivateAnalyst() {
    await this.runAction((id) => this.analystService.reactivateAnalyst(id));
  }

  private async runAction(action: (id: string) => Observable<unknown>) {
    const analyst = this.selected();
    if (!analyst?.id) return;
    this.isActionRunning.set(true);
    try {
      await firstValueFrom(action(analyst.id));
      this.closeDetails();
      await this.load();
    } catch {
      // erro de ação exibido pelo modal global (errorInterceptor)
    } finally {
      this.isActionRunning.set(false);
    }
  }
}
