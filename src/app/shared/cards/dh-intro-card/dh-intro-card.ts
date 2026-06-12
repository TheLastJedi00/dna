import { Component, inject, input } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { Router } from '@angular/router';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
  selector: 'app-dh-intro-card',
  imports: [IconTextButton],
  templateUrl: './dh-intro-card.html',
  styleUrl: './dh-intro-card.scss',
})
export class DhIntroCard {
  router = inject(Router);
  private readonly userContext = inject(UserContextService);
  userId = this.userContext.userId
  title = input("Título");
  singleIntro = input<string | null>(null);
  intro = input<string[] | null>(null);
}
