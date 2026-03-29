import { Component, input, output } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-text-button',
  imports: [NgClass],
  templateUrl: './text-button.html',
  styleUrl: './text-button.scss',
})
export class TextButton {
  textColor = input<string>('text-black');
  text = input<string>('Text Button');
  action = output<void>();

  buttonClicked(){
    this.action.emit();
  }
}
