import { Component, inject } from '@angular/core';
import { TextButton } from '../../buttons/text-button/text-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  imports: [TextButton],
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
