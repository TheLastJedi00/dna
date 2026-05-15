import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-infinity',
  imports: [NgStyle],
  templateUrl: './infinity.html',
  styleUrl: './infinity.scss',
})
export class Infinity {
  scale = input('1')
  message = input<string|null>()
}
