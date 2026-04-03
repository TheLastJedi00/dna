import { Component } from '@angular/core';
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";
import { DnaDataCard } from '../../shared/cards/dna-data-card/dna-data-card';

@Component({
  selector: 'app-human-design',
  imports: [UserPanelHeader, DnaDataCard],
  templateUrl: './human-design.html',
  styleUrl: './human-design.scss',
})
export class HumanDesign {
  
}
