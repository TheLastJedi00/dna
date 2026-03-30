import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {
  scale = input<number>(1);

  titleSize = computed(() => `${this.scale() * 8}rem`);
  subtitleSize = computed(() => `${this.scale() * 3}rem`);
  spanSize = computed(() => `${this.scale() * 0.8}rem`);
}
