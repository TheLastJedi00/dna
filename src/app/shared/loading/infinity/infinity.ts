import { Component, input } from '@angular/core';
import { NgStyle } from "@angular/common";

@Component({
  selector: 'app-infinity',
  imports: [NgStyle],
  templateUrl: './infinity.html',
  styleUrl: './infinity.scss',
})
export class Infinity {
  scale = input('1');
}
