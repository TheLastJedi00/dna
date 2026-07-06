import { Component, OnInit, inject, signal } from '@angular/core';
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
import { Infinity } from '../../loading/infinity/infinity';
import { DnaStatus } from '../../../core/models/dna-status.model';
import { PillarFormBase } from '../pillar-form.base';

@Component({
  selector: 'app-astrology-form',
  imports: [IconTextButton, ɵInternalFormsSharedModule, ReactiveFormsModule, Infinity],
  templateUrl: './astrology-form.html',
  styleUrl: './astrology-form.scss',
})
export class AstrologyForm extends PillarFormBase implements OnInit {
  protected readonly pillar = 'astrology' as const;
  private readonly fb = inject(FormBuilder);
  private readonly astrologyService = inject(AstrologyService);
  readonly astrologyData = signal<LeituraAstrologica | null>(null);

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

  async ngOnInit(): Promise<void> {
    await this.initPillarForm();
  }

  protected hasPillarData(status: DnaStatus | null): boolean {
    return !!status?.astrology;
  }

  protected async loadPillarData(): Promise<void> {
    await this.getAstrologyData();
  }

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
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async getAstrologyData() {
    this.isLoading.set(true);
    try {
      this.astrologyData.set(
        await firstValueFrom(this.astrologyService.getByUserId(this.maestraId())),
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
