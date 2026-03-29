import { Component, input } from '@angular/core';

@Component({
  selector: 'app-bg-image-card',
  imports: [],
  templateUrl: './bg-image-card.html',
  styleUrl: './bg-image-card.scss',
})
export class BgImageCard {
  title = input<string>();
  description = input<string>();
  backgroundImageUrl = input.required<string>();
  minHeight = input<string>('400px');

  bgImageProperty(){
    return `url('${this.backgroundImageUrl()}')`;
  }

  textDivHeight(){
    return `calc(${this.minHeight()} * 0.65)`;
  }
}
