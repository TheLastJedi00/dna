import { Component, inject, OnInit, signal } from '@angular/core';
import { AstroDataButton } from '../../../shared/buttons/astro-data-button/astro-data-button';
import { Router, ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { LeituraAstrologica } from '../../../core/models/astrology.model';
import { UserDataCard } from '../../../shared/cards/user-data-card/user-data-card';
import { AstrologyService } from '../../../core/services/astrology.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../core/services/user.service';
import { UserData } from '../../../core/models/userdata.model';
import { Infinity } from "../../../shared/loading/infinity/infinity";

@Component({
  selector: 'app-astrology-home',
  imports: [AstroDataButton, NgClass, UserDataCard, Infinity],
  templateUrl: './astrology-home.html',
  styleUrl: './astrology-home.scss',
})
export class AstrologyHome implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly astrologyService = inject(AstrologyService);
  private readonly userService = inject(UserService);
  readonly userId = signal('');
  isLoading = signal(false);
  astrologyData = signal<LeituraAstrologica | null>(null);
  userData = signal<UserData | null>(null);
  buttonGroupClasses = 'p-3 text-center gradient-primary-to-secondary-85 rounded-xl';
  titleButtonGroupClasses = 'text-primary font-merriweather font-normal text-xl';
  gridButtonGroupClasses = 'grid grid-cols-1 auto-rows-fr gap-2 mt-3';

  async ngOnInit() {
    const userId = this.route.snapshot.parent!.paramMap.get('userId') ?? '';
    this.userId.set(userId);
    await this.getAstrologyData();
    await this.getUserData();
  }

  navigateTo(path: string) {
    this.router.navigate([`astrology/${this.userId()}/${path}`]);
  }

  async getAstrologyData() {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.astrologyService.getByUserId(this.userId()));
      this.astrologyData.set(data);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getUserData() {
    this.isLoading.set(true);
    try {
      const user = await firstValueFrom(this.userService.findMe(this.userId()));
      this.userData.set(user);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
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
