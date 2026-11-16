import { Component, computed, inject, OnInit } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AppButton } from '../../buttons/app-button/app-button';
import { LogoutButton } from '../../buttons/logout-button/logout-button';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { Skeleton } from '../../feedback/skeleton/skeleton';
import { LoadError } from '../../feedback/load-error/load-error';

@Component({
  selector: 'app-user-header-menu',
  imports: [NgClass, NgTemplateOutlet, AppButton, LogoutButton, Skeleton, LoadError],
  templateUrl: './user-header-menu.html',
  styleUrl: './user-header-menu.scss',
})
export class UserHeaderMenu implements OnInit {
  hrItems = Array(3).fill(0);
  loginService = inject(LoginService);
  currentUser = inject(CurrentUserService);
  router = inject(Router);
  toggle = false;

  /** Primeiro nome em destaque; o restante na linha de baixo (visual do cartão). */
  private nameParts = computed(() => (this.currentUser.displayName() ?? '').trim().split(/\s+/));
  firstName = computed(() => this.nameParts()[0] ?? '');
  restOfName = computed(() => this.nameParts().slice(1).join(' '));

  ngOnInit() {
    // Dispara já ao montar o cabeçalho: quando o menu abrir, o nome costuma
    // estar pronto. O serviço não repete a chamada se o dashboard já a fez.
    this.currentUser.ensureLoaded();
  }

  toggleMenu() {
    this.toggle = !this.toggle;
  }
}
