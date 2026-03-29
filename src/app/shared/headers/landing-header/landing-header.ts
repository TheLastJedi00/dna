import { Component, input } from '@angular/core';
import { TextButton } from '../../buttons/text-button/text-button';

@Component({
  selector: 'app-landing-header',
  imports: [TextButton],
  templateUrl: './landing-header.html',
  styleUrl: './landing-header.scss',
})
export class LandingHeader {
}
