import { Component, input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-arrow-left',
  imports: [NgClass],
  templateUrl: './arrow-left.html',
  styleUrl: './arrow-left.scss',
})
export class ArrowLeft {
  customClass = input<string>("")
}
