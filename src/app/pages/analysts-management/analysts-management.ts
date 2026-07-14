import { Component, inject, OnInit, signal } from '@angular/core';
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
import { Infinity } from '../../shared/loading/infinity/infinity';
import { AnalystService } from '../../core/services/analyst.service';
import { AnalystData } from '../../core/models/analyst.model';
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
    FormsModule,
  ],
  templateUrl: './analysts-management.html',
})
export class AnalystsManagement implements OnInit {
  readonly router = inject(Router);
  private readonly analystService = inject(AnalystService);

  analysts = signal<AnalystData[]>([]);
  isLoading = signal(false);
  total = signal(0);
  page = signal(1);
  pageSize = signal(9);
  totalPages = signal(1);
  search = signal('');
  status = signal<UserStatusFilter>('active');

  /** Analista aberto no modal de detalhes; null = modal fechado. */
  selected = signal<AnalystData | null>(null);
  /** Analista em edição; null = o form está em modo criação. */
  editing = signal<AnalystData | null>(null);
  isFormOpen = signal(false);

  private searchDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.load();
  }

  async load() {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.analystService.listAnalysts({
          page: this.page(),
          pageSize: this.pageSize(),
          name: this.search().trim() || undefined,
          status: this.status(),
        }),
      );
      this.analysts.set(res.items);
      this.total.set(res.total);
      this.totalPages.set(Math.max(1, res.totalPages));
      this.page.set(res.page);
    } finally {
      this.isLoading.set(false);
    }
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

  openDetails(analyst: AnalystData) {
    this.selected.set(analyst);
  }

  closeDetails() {
    this.selected.set(null);
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
    this.isLoading.set(true);
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
      // erro HTTP exibido pelo errorInterceptor global
      this.isLoading.set(false);
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
    this.isLoading.set(true);
    try {
      await firstValueFrom(action(analyst.id));
      this.closeDetails();
      await this.load();
    } catch {
      // erro HTTP exibido pelo errorInterceptor global
      this.isLoading.set(false);
    }
  }
}
