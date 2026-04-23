import { Component, inject, OnInit, signal } from '@angular/core';
import { UserDataCard } from '../../../shared/cards/user-data-card/user-data-card';
import { FakeApi } from '../../../core/services/fake-api';
import { NumerologyData } from '../../../core/models/numdata.model';
import { NumDataButton } from '../../../shared/buttons/num-data-button/num-data-button';

@Component({
  selector: 'app-home',
  imports: [UserDataCard, NumDataButton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  ngOnInit(): void {
    this.numData.set(this.api.getNumerologyData());
  }

  readonly api = inject(FakeApi);
  numData = signal<NumerologyData | null>(null);
}
