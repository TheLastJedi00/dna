import { Component, input, output } from '@angular/core';
import { IconsSwitch } from "../../icons/icons-switch/icons-switch";

@Component({
  selector: 'app-icon-text-button',
  imports: [IconsSwitch],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.scss',
})
export class IconTextButton {
  icon = input("heart")
  text = input("Text")
  click = output<void>()

  onClick(){
    this.click.emit();
  }
}
