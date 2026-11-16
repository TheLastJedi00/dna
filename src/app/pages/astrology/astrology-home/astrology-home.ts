import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataButton } from '../../../shared/buttons/data-button/data-button';
import { Router, ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { LeituraAstrologica } from '../../../core/models/astrology.model';
import { UserDataCard } from '../../../shared/cards/user-data-card/user-data-card';
import { AstrologyService } from '../../../core/services/astrology.service';
import { UserService } from '../../../core/services/user.service';
import { combineLoad, loadState } from '../../../core/utils/load-state';
import { PillarLoad } from '../../../shared/feedback/pillar-load/pillar-load';

@Component({
  selector: 'app-astrology-home',
  imports: [DataButton, NgClass, UserDataCard, PillarLoad],
  templateUrl: './astrology-home.html',
  styleUrl: './astrology-home.scss',
})
export class AstrologyHome implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly astrologyService = inject(AstrologyService);
  private readonly userService = inject(UserService);
  readonly userId = signal('');
  /** Dados do pilar; 404 = ainda não cadastrado (vazio, não erro). */
  readonly pillar = loadState(() => this.astrologyService.getByUserId(this.userId()), {
    emptyOn404: true,
  });
  readonly user = loadState(() => this.userService.findMe(this.userId()));
  /** Um skeleton, um erro e um "Tentar novamente" para as duas leituras. */
  readonly view = combineLoad(this.pillar, this.user);
  readonly astrologyData = computed(() => this.pillar.data());
  readonly userData = computed(() => this.user.data());
  buttonGroupClasses = 'p-3 text-center gradient-primary-to-secondary-85 rounded-xl';
  titleButtonGroupClasses = 'text-primary font-merriweather font-normal text-xl';
  gridButtonGroupClasses = 'grid grid-cols-1 auto-rows-fr gap-2 mt-3';

  async ngOnInit() {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    this.userId.set(userId);
    await this.view.load();
  }

  navigateTo(path: string) {
    this.router.navigate([`astrology/${this.userId()}/${path}`]);
  }

  pontoToStringArray(ponto: any): string[] {
    let stringList: string[] = [];
    stringList.push(`Signo: ${ponto.signo}`);
    stringList.push(`Casa: ${ponto.casaAstrologica}`);
    if (ponto.planetas) {
      stringList.push(`Planeta: ${ponto.planetas}`);
    }
    return stringList;
  }

  elementosToStringArray(): string[] {
    const el = this.astrologyData()!.elementos;
    return [
      `Fogo: ${el.fogo}`,
      `Terra: ${el.terra}`,
      `Ar: ${el.ar}`,
      `Água: ${el.agua}`,
    ];
  }
}
