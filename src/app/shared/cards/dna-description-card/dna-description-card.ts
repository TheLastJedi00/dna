import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dna-description-card',
  imports: [],
  templateUrl: './dna-description-card.html',
  styleUrl: './dna-description-card.scss',
})
export class DnaDescriptionCard {
  title = input("Título")
  innerHtml = input(`<b>Exemplo Html</b>`)
}
