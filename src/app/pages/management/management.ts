import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { DetailedList } from '../../shared/list/detailed-list/detailed-list';
import { IconTextButton } from '../../shared/buttons/icon-text-button/icon-text-button';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { NewUserForm } from '../../shared/forms/new-user-form/new-user-form';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { UserService } from '../../core/services/user.service';
import { UserData, UserStatusFilter } from '../../core/models/userdata.model';

/**
 * Página smart de gestão de Maestras: dona do estado (lista, paginação, busca e
 * filtro de status) e única a falar com o UserService. Os componentes de
 * apresentação (detailed-list/detailed-item) recebem dados prontos.
 */
@Component({
  selector: 'app-management',
  imports: [
    UserPanelHeader,
    DetailedList,
    IconTextButton,
    UserPanelFooter,
    NewUserForm,
    Infinity,
    FormsModule,
  ],
  templateUrl: './management.html',
  styleUrl: './management.scss',
})
export class Management implements OnInit {
  router = inject(Router);
  private readonly userService = inject(UserService);
  type = input.required<string>();

  users = signal<UserData[]>([]);
  isLoading = signal(false);
  total = signal(0);
  page = signal(1);
  pageSize = signal(9);
  totalPages = signal(1);
  search = signal('');
  status = signal<UserStatusFilter>('active');

  private searchDebounce?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.load();
  }

  async load() {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.userService.listUsers({
          page: this.page(),
          pageSize: this.pageSize(),
          name: this.search().trim() || undefined,
          status: this.status(),
        }),
      );
      this.users.set(res.items);
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
}
