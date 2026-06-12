import { Component, input, output } from '@angular/core';
import { IconsSwitch } from "../../icons/icons-switch/icons-switch";
import { NgClass } from "@angular/common"
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-icon-text-button',
  imports: [IconsSwitch, NgClass, RouterLink],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.scss',
})
export class IconTextButton {
  disabled = input(false)
  icon = input("heart")
  text = input("Text")
  click = output<void>()
  class = input<string>('')
  type = input('button')
  routerLink = input<string|null>(null)

  onClick(event: Event){
    event.stopPropagation()
    this.click.emit();
  }
}
