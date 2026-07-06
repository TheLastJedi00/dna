import { Component, input } from '@angular/core';
import { AnoPessoal, PeriodoNumerologico } from '../../../core/models/numdata.model';
import { NgClass } from "@angular/common";
import { IconsSwitch } from "../../icons/icons-switch/icons-switch";

interface AnosPessoais {
  atual: AnoPessoal,
  proximo: AnoPessoal
}

@Component({
  selector: 'app-num-data-button',
  imports: [NgClass, IconsSwitch],
  templateUrl: './num-data-button.html',
  styleUrl: './num-data-button.scss',
})
export class NumDataButton {
  title = input<string>("Título")
  data = input<number|null>(null)
  dataArray = input<number[]|null>(null)
  periodTitle = input<string|null>(null)
  periods = input<PeriodoNumerologico[]|null>(null)
  cols = input<number>(3)
  isAnoPessoal = input<boolean>(false)
  anoPessoalData = input<AnosPessoais|null>(null)
  anoPessoalNumberClass = "text-xl text-center mb-5 mt-2 flex items-end justify-center"
}
