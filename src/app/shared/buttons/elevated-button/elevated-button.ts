import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-elevated-button',
  imports: [NgClass],
  templateUrl: './elevated-button.html',
  styleUrl: './elevated-button.scss',
})
export class ElevatedButton {
  text = input.required<string>();
  buttonClass = input<string>();
  action = output<void>();

  onActivated() {
    this.action.emit();
  }
}
