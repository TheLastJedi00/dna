import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';

/**
 * Erro de carregamento exibido **no lugar do skeleton**: diz o que houve e
 * deixa tentar de novo sem recarregar a página. Leituras não abrem o modal
 * global (ver `SHOW_ERROR_MODAL`), então este é o único aviso da falha.
 */
@Component({
  selector: 'app-load-error',
  imports: [IconsSwitch, IconTextButton],
  templateUrl: './load-error.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadError {
  /** Frase pronta (de `httpErrorMessage` / `loadState().error()`). */
  message = input.required<string>();
  /** Título curto acima da mensagem. */
  title = input('Não foi possível carregar');
  /** Versão de uma linha, para espaços apertados (menu lateral). */
  compact = input(false);
  retry = output<void>();
}
