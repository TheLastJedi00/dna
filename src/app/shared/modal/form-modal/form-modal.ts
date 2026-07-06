import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Modal genérico no padrão visual dos modais existentes (user-details/error).
 * Projeta o conteúdo via <ng-content>; o conteúdo só é instanciado enquanto
 * aberto (o form roda seu ngOnInit ao abrir).
 */
@Component({
  selector: 'app-form-modal',
  imports: [],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModal {
  isOpen = input(false);
  title = input('');
  close = output<void>();

  onClose() {
    this.close.emit();
  }
}
