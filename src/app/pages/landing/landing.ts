import { Component, inject } from '@angular/core';
import { AppButton } from '../../shared/buttons/app-button/app-button';
import { BgImageCard } from "../../shared/cards/bg-image-card/bg-image-card";
import { LandingHeader } from "../../shared/headers/landing-header/landing-header"; 
import { LandingFooter } from "../../shared/footers/landing-footer/landing-footer";
import { Router } from '@angular/router';
import { Logo } from "../../shared/logo/logo";

@Component({
  selector: 'app-landing',
  imports: [AppButton, BgImageCard, LandingHeader, LandingFooter, Logo],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  router = inject(Router);

  navigateToUserLogin() {
    this.router.navigate(['/login']);
  }
}
