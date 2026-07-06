import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModal } from './shared/modal/error-modal/error-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorModal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dna-project');
}
