import { Component, inject } from '@angular/core';
import { AppButton } from '../../buttons/app-button/app-button';
import { Router } from '@angular/router';
import { Logo } from "../../logo/logo";

@Component({
  selector: 'app-landing-header',
  imports: [AppButton, Logo],
  templateUrl: './landing-header.html',
  styleUrl: './landing-header.scss',
})
export class LandingHeader {
  router = inject(Router);

  navigateToHome() {
    this.router.navigate(['']);
  }

  navigateToUserLogin() {
    this.router.navigate(['/login']);
  }
}
