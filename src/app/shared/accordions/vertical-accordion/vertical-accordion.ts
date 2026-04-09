import { Component, input, signal } from '@angular/core';
import { IconsSwitch } from "../../icons/icons-switch/icons-switch";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-vertical-accordion',
  imports: [IconsSwitch, NgClass],
  templateUrl: './vertical-accordion.html',
  styleUrl: './vertical-accordion.scss',
})
export class VerticalAccordion {
  title = input("Título")
  cardContent = input("Conteúdo")
  titleClass = input("text-primary")
  contentClass = input("")
  isExpanded = signal(false)

  accordionAction(){
    this.isExpanded.update(v => !v)
  }
}
