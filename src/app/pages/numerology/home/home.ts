import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NumerologyService } from '../../../core/services/numerology.service';
import { NumerologyData } from '../../../core/models/numdata.model';
import { NumDataButton } from '../../../shared/buttons/num-data-button/num-data-button';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { combineLoad, loadState } from '../../../core/utils/load-state';
import { PillarLoad } from '../../../shared/feedback/pillar-load/pillar-load';

@Component({
  selector: 'app-home',
  imports: [NumDataButton, PillarLoad],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly numerologyService = inject(NumerologyService);
  private readonly userService = inject(UserService);
  readonly userId = signal('');
  /** Dados do pilar; 404 = ainda não cadastrado (vazio, não erro). */
  readonly pillar = loadState(() => this.numerologyService.getByUserId(this.userId()), {
    emptyOn404: true,
  });
  readonly user = loadState(() => this.userService.findMe(this.userId()));
  /** Um skeleton, um erro e um "Tentar novamente" para as duas leituras. */
  readonly view = combineLoad(this.pillar, this.user);
  readonly numData = computed(() => this.pillar.data());
  readonly userData = computed(() => this.user.data());

  async ngOnInit() {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    this.userId.set(userId);
    await this.view.load();
  }

  navigateTo(path: string) {
    this.router.navigate([`numerology/${this.userId()}/${path}`]);
  }
}
