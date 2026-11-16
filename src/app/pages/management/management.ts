import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { DetailedList } from '../../shared/list/detailed-list/detailed-list';
import { IconTextButton } from '../../shared/buttons/icon-text-button/icon-text-button';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { NewUserForm } from '../../shared/forms/new-user-form/new-user-form';
import { UserDetailsModal } from '../../shared/modal/user-details-modal/user-details-modal';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { UserService } from '../../core/services/user.service';
import { UserData, UserStatusFilter } from '../../core/models/userdata.model';
import { loadState } from '../../core/utils/load-state';
import { SkeletonList } from '../../shared/feedback/skeleton-list/skeleton-list';
import { LoadError } from '../../shared/feedback/load-error/load-error';

/**
 * Página smart de gestão de Maestras: dona do estado (lista, paginação, busca,
 * filtro de status e o detalhe aberto) e única a falar com o UserService. Os
 * componentes de apresentação recebem dados prontos e devolvem intenções.
 */
@Component({
  selector: 'app-management',
  imports: [
    UserPanelHeader,
    DetailedList,
    IconTextButton,
    UserPanelFooter,
    NewUserForm,
    UserDetailsModal,
    Infinity,
    SkeletonList,
    LoadError,
    FormsModule,
  ],
  templateUrl: './management.html',
  styleUrl: './management.scss',
})
export class Management implements OnInit {
  router = inject(Router);
  private readonly userService = inject(UserService);
  type = input.required<string>();

  /**
   * "Gerir Maestras" para a listagem de Maestras (o "de" era um artefato do
   * template genérico); demais tipos mantêm o formato antigo.
   */
  readonly pageTitle = computed(() =>
    this.type() === 'maestras' ? 'Gerir Maestras' : `Gerir de ${this.type()}`,
  );

  /** Leitura da página atual: skeleton enquanto carrega, erro inline se falhar. */
  readonly list = loadState(() =>
    this.userService.listUsers({
      page: this.page(),
      pageSize: this.pageSize(),
      name: this.search().trim() || undefined,
      status: this.status(),
    }),
  );
  readonly users = computed(() => this.list.data()?.items ?? []);
  readonly totalPages = computed(() => Math.max(1, this.list.data()?.totalPages ?? 1));
  page = signal(1);
  pageSize = signal(9);
  /** Ação em curso (desativar/reativar/senha provisória): overlay de tela cheia. */
  isActionRunning = signal(false);
  search = signal('');
  status = signal<UserStatusFilter>('active');

  /** Maestra aberta no modal (com o detalhe já carregado); null = fechado. */
  selected = signal<UserData | null>(null);
  isLoadingDetails = signal(false);
  isEditing = signal(false);

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
   * Abre o modal com o item da lista (resposta imediata) e busca o detalhe —
   * e-mail e senha provisória só existem no `GET /users/:id`, nunca na listagem.
   */
  async openDetails(user: UserData) {
    this.selected.set(user);
    if (!user.id) return;
    this.isLoadingDetails.set(true);
    try {
      const detail = await firstValueFrom(this.userService.findUserById(user.id));
      // Se o modal já foi fechado (ou trocado), o detalhe em voo não interessa.
      if (this.selected()?.id === user.id) {
        this.selected.set(detail);
      }
    } catch {
      // erro HTTP exibido pelo errorInterceptor global
    } finally {
      this.isLoadingDetails.set(false);
    }
  }

  closeDetails() {
    this.selected.set(null);
  }

  startEdit() {
    this.isEditing.set(true);
  }

  onEditCancelled() {
    this.isEditing.set(false);
  }

  async onEditSaved() {
    this.isEditing.set(false);
    this.closeDetails();
    await this.load();
  }

  openSupply() {
    this.router.navigate([`user-supply/${this.selected()?.id}`]);
  }

  async generateTempPassword(password: string) {
    const user = this.selected();
    if (!user?.id) return;
    this.isLoadingDetails.set(true);
    try {
      await firstValueFrom(this.userService.setTempPassword(user.id, password));
      // Recarrega o detalhe: a senha provisória agora aparece no lugar do botão.
      const detail = await firstValueFrom(this.userService.findUserById(user.id));
      this.selected.set(detail);
    } catch {
      // erro HTTP exibido pelo errorInterceptor global
    } finally {
      this.isLoadingDetails.set(false);
    }
  }

  async disableUser() {
    await this.runAction((id) => this.userService.deleteUser(id));
  }

  async reactivateUser() {
    await this.runAction((id) => this.userService.reactivateUser(id));
  }

  private async runAction(action: (id: string) => Observable<unknown>) {
    const user = this.selected();
    if (!user?.id) return;
    this.isActionRunning.set(true);
    try {
      await firstValueFrom(action(user.id));
      this.closeDetails();
      await this.load();
    } catch {
      // erro de ação exibido pelo modal global (errorInterceptor)
    } finally {
      this.isActionRunning.set(false);
    }
  }
}
