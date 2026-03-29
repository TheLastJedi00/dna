import { Component } from '@angular/core';
import { ElevatedButton } from '../../shared/buttons/elevated-button/elevated-button';
import { BgImageCard } from "../../shared/cards/bg-image-card/bg-image-card";
import { LandingHeader } from "../../shared/headers/landing-header/landing-header"; 

@Component({
  selector: 'app-landing',
  imports: [ElevatedButton, BgImageCard, LandingHeader],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
