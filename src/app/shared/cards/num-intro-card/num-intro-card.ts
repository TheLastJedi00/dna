import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';

@Component({
  selector: 'app-num-intro-card',
  imports: [IconTextButton],
  templateUrl: './num-intro-card.html',
  styleUrl: './num-intro-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumIntroCard {
  title = input('Título');
  singleIntro = input<string | null>(null);
  intro = input<string[] | null>(null);
}
