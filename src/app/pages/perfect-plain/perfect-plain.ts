import { Component, inject, input } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { DnaTitleCard } from '../../shared/cards/dna-title-card/dna-title-card';
import { DnaDescriptionCard } from "../../shared/cards/dna-description-card/dna-description-card";
import { Router, RouterOutlet } from '@angular/router';
import { UserPanelFooter } from "../../shared/footers/user-panel-footer/user-panel-footer";

@Component({
  selector: 'app-perfect-plain',
  imports: [UserPanelHeader, DnaTitleCard, DnaDescriptionCard, RouterOutlet, UserPanelFooter],
  templateUrl: './perfect-plain.html',
  styleUrl: './perfect-plain.scss',
})
export class PerfectPlain {
  userId = input.required<string>();
  router = inject(Router);

  descriptionHtml() {
    return `
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
`;
  }
}
