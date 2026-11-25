import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModal } from './shared/modal/error-modal/error-modal';
import { Toast } from './shared/feedback/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorModal, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dna-project');
}
