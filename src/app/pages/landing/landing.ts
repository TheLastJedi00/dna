import { Component, inject } from '@angular/core';
import { ElevatedButton } from '../../shared/buttons/elevated-button/elevated-button';
import { BgImageCard } from "../../shared/cards/bg-image-card/bg-image-card";
import { LandingHeader } from "../../shared/headers/landing-header/landing-header"; 
import { LandingFooter } from "../../shared/footers/landing-footer/landing-footer";
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [ElevatedButton, BgImageCard, LandingHeader, LandingFooter],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  router = inject(Router);

  navigateToUserLogin() {
    this.router.navigate(['/login']);
  }
}
