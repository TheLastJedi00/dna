import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-flat-button',
  imports: [NgClass],
  templateUrl: './flat-button.html',
  styleUrl: './flat-button.scss',
})
export class FlatButton {
  text = input<string>('Flat Button');
  classes = input<string>('');
  disabled = input<boolean>(false);
  action = output<void>();

  onClick(){
    this.action.emit();
  }
}
