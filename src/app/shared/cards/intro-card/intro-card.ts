import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';

@Component({
  selector: 'app-intro-card',
  imports: [IconTextButton],
  templateUrl: './intro-card.html',
  styleUrl: './intro-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntroCard {
  title = input('Título');
  singleIntro = input<string | null>(null);
  intro = input<string[] | null>(null);
  /** Destino do botão "Voltar". Padrão sobe um nível na rota atual. */
  backLink = input<string>('../');
}
