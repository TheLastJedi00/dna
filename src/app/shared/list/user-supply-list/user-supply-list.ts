import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { loadState } from '../../../core/utils/load-state';
import { UserSupplyItem } from '../user-supply-item/user-supply-item';
import { SkeletonList } from '../../feedback/skeleton-list/skeleton-list';
import { LoadError } from '../../feedback/load-error/load-error';

@Component({
  selector: 'app-user-supply-list',
  imports: [UserSupplyItem, SkeletonList, LoadError],
  templateUrl: './user-supply-list.html',
  styleUrl: './user-supply-list.scss',
})
export class UserSupplyList implements OnInit {
  private readonly service = inject(UserService);
  router = inject(Router);

  /** Maestras ativas, em ordem alfabética (mesma consulta da antiga `getAllActiveUsers`). */
  readonly list = loadState(() =>
    this.service.listUsers({ orderBy: 'fullName', direction: 'asc', status: 'active' }),
  );
  readonly usersList = computed(() => this.list.data()?.items ?? []);

  ngOnInit() {
    this.list.load();
  }
}
