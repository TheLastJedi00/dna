import { Component, inject, input } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-num-intro-card',
  imports: [IconTextButton],
  templateUrl: './num-intro-card.html',
  styleUrl: './num-intro-card.scss',
})
export class NumIntroCard {
  router = inject(Router);
  userId = input.required<string>();
  title = input("Título");
  singleIntro = input<string | null>(null);
  intro = input<string[] | null>(null);

  navigateTo(path: string) {
    this.router.navigate([`numerology/${this.userId()}/${path}`]);
  }
}
