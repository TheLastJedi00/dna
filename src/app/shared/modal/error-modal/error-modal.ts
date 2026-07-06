import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-error-modal',
  imports: [IconTextButton],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorModal {
  private readonly errorService = inject(ErrorService);
  readonly message = this.errorService.message;

  close() {
    this.errorService.clear();
  }
}
