import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-button',
  imports: [],
  templateUrl: './dashboard-button.html',
  styleUrl: './dashboard-button.scss',
})
export class DashboardButton {
  imgSrc = input<string>('imgSrc');
  title = input<string>('title');
  subtitle = input<string>('subtitle');
  description = input<string>('description');
}
