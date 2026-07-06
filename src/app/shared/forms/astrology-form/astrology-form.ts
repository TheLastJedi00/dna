import { Component, inject, OnInit, signal } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { AstrologyService } from '../../../core/services/astrology.service';
import { LeituraAstrologica } from '../../../core/models/astrology.model';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from '../../loading/infinity/infinity';
import { DnaStatusService } from '../../../core/services/dna-status.service';
import { DnaStatus } from '../../../core/models/dna-status.model';
import { SupplyService } from '../../../core/services/supply.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-astrology-form',
  imports: [IconTextButton, ɵInternalFormsSharedModule, ReactiveFormsModule, Infinity],
  templateUrl: './astrology-form.html',
  styleUrl: './astrology-form.scss',
})
export class AstrologyForm implements OnInit {
  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('maestraId') ?? '';
    this.maestraId.set(id);
    await this.getDnaStatus();
    if (this.dnaStatus()?.astrology) {
      await this.getAstrologyData();
      await this.checkSupplyByMaestraId();
    }
  }

  maestraId = signal('');
  isLoading = signal(false);
  loadingMessage = signal<string | null>(null);
  dnaStatus = signal<DnaStatus | null>(null);
  astrologyData = signal<LeituraAstrologica | null>(null);
  isSupplyCreated = signal<boolean>(false);
  router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly astrologyService = inject(AstrologyService);
  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly supplyService = inject(SupplyService);

  protected astroForm = this.fb.nonNullable.group({
    // Tríade Astrológica
    triade_sol_signo: this.fb.control('', [Validators.required]),
    triade_sol_casa: this.fb.control<number | null>(null, [Validators.required]),
    triade_sol_planetas: this.fb.control<string | null>(null),
    
    triade_ascendente_signo: this.fb.control('', [Validators.required]),
    triade_ascendente_casa: this.fb.control<number | null>(null, [Validators.required]),
    triade_ascendente_planetas: this.fb.control<string | null>(null),

    triade_lua_signo: this.fb.control('', [Validators.required]),
    triade_lua_casa: this.fb.control<number | null>(null, [Validators.required]),
    triade_lua_planetas: this.fb.control<string | null>(null),

    // Casas Importantes
    meio_ceu_signo: this.fb.control('', [Validators.required]),
    meio_ceu_casa: this.fb.control<number | null>(null, [Validators.required]),
    meio_ceu_planetas: this.fb.control<string | null>(null),

    dinheiro_signo: this.fb.control('', [Validators.required]),
    dinheiro_casa: this.fb.control<number | null>(null, [Validators.required]),
    dinheiro_planetas: this.fb.control<string | null>(null),

    comunicacao_signo: this.fb.control('', [Validators.required]),
    comunicacao_casa: this.fb.control<number | null>(null, [Validators.required]),
    comunicacao_planetas: this.fb.control<string | null>(null),

    // Elementos
    elementos_fogo: this.fb.control<number | null>(null, [Validators.required]),
    elementos_terra: this.fb.control<number | null>(null, [Validators.required]),
    elementos_ar: this.fb.control<number | null>(null, [Validators.required]),
    elementos_agua: this.fb.control<number | null>(null, [Validators.required]),
  });

  //HTTP Requests
  async saveAstrologyData() {
    this.isLoading.set(true);
    const form = this.astroForm.getRawValue();
    try {
      const astroData: LeituraAstrologica = {
        userId: this.maestraId(),
        triadeAstrologica: {
          sol: {
            signo: form.triade_sol_signo!,
            casaAstrologica: form.triade_sol_casa!,
            planetas: form.triade_sol_planetas,
          },
          ascendente: {
            signo: form.triade_ascendente_signo!,
            casaAstrologica: form.triade_ascendente_casa!,
            planetas: form.triade_ascendente_planetas,
          },
          lua: {
            signo: form.triade_lua_signo!,
            casaAstrologica: form.triade_lua_casa!,
            planetas: form.triade_lua_planetas,
          },
        },
        meioDoCeu: {
          signo: form.meio_ceu_signo!,
          casaAstrologica: form.meio_ceu_casa!,
          planetas: form.meio_ceu_planetas,
        },
        dinheiro: {
          signo: form.dinheiro_signo!,
          casaAstrologica: form.dinheiro_casa!,
          planetas: form.dinheiro_planetas,
        },
        comunicacao: {
          signo: form.comunicacao_signo!,
          casaAstrologica: form.comunicacao_casa!,
          planetas: form.comunicacao_planetas,
        },
        elementos: {
          fogo: form.elementos_fogo!,
          terra: form.elementos_terra!,
          ar: form.elementos_ar!,
          agua: form.elementos_agua!,
        },
      };
      await firstValueFrom(this.astrologyService.createAstrologyByUser(astroData));
      this.astroForm.reset();
      this.getDnaStatus();
      this.getAstrologyData();
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getDnaStatus() {
    this.isLoading.set(true);
    try {
      this.dnaStatus.set(
        await firstValueFrom(this.dnaStatusService.getStatusByUserId(this.maestraId())),
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getAstrologyData() {
    this.isLoading.set(true);
    try {
      this.astrologyData.set(await firstValueFrom(this.astrologyService.getByUserId(this.maestraId())));
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async checkSupplyByMaestraId() {
    this.isLoading.set(true);
    try {
      const reponse = await firstValueFrom(
        this.supplyService.isSupplyForThisUser(this.maestraId(), 'astrology'),
      );
      this.isSupplyCreated.set(reponse);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async createAllSupply() {
    this.isLoading.set(true);
    this.loadingMessage.set('Isso pode levar alguns minutos, não feche a página.');
    try {
      await firstValueFrom(this.supplyService.createFullPillar('astrology', this.maestraId()));
      alert("Dados Gerados com Sucesso!")
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set(null);
      this.checkSupplyByMaestraId();
    }
  }
}
