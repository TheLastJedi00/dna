import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dna-title-card',
  imports: [],
  templateUrl: './dna-title-card.html',
  styleUrl: './dna-title-card.scss',
})
export class DnaTitleCard {
  imgSrc = input("url")
  imgAlt = input("Texto Alternativo")
  subTitle = input("Subtítulo")
  title = input("Título")
}
