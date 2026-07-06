import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';

@Component({
  selector: 'app-dh-intro-card',
  imports: [IconTextButton],
  templateUrl: './dh-intro-card.html',
  styleUrl: './dh-intro-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhIntroCard {
  title = input('Título');
  singleIntro = input<string | null>(null);
  intro = input<string[] | null>(null);
}
