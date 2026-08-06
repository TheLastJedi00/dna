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

  /** Repõe no formulário os dados já cadastrados, para a reedição. */
  protected prefillForm(): void {
    const data = this.astrologyData();
    if (!data) return;

    this.astroForm.patchValue({
      triade_sol_signo: data.triadeAstrologica?.sol?.signo,
      triade_sol_casa: data.triadeAstrologica?.sol?.casaAstrologica,
      triade_sol_planetas: data.triadeAstrologica?.sol?.planetas,

      triade_ascendente_signo: data.triadeAstrologica?.ascendente?.signo,
      triade_ascendente_casa: data.triadeAstrologica?.ascendente?.casaAstrologica,
      triade_ascendente_planetas: data.triadeAstrologica?.ascendente?.planetas,

      triade_lua_signo: data.triadeAstrologica?.lua?.signo,
      triade_lua_casa: data.triadeAstrologica?.lua?.casaAstrologica,
      triade_lua_planetas: data.triadeAstrologica?.lua?.planetas,

      meio_ceu_signo: data.meioDoCeu?.signo,
      meio_ceu_casa: data.meioDoCeu?.casaAstrologica,
      meio_ceu_planetas: data.meioDoCeu?.planetas,

      dinheiro_signo: data.dinheiro?.signo,
      dinheiro_casa: data.dinheiro?.casaAstrologica,
      dinheiro_planetas: data.dinheiro?.planetas,

      comunicacao_signo: data.comunicacao?.signo,
      comunicacao_casa: data.comunicacao?.casaAstrologica,
      comunicacao_planetas: data.comunicacao?.planetas,

      elementos_fogo: data.elementos?.fogo,
      elementos_terra: data.elementos?.terra,
      elementos_ar: data.elementos?.ar,
      elementos_agua: data.elementos?.agua,
    });
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
      const docId = this.astrologyData()?.id;
      if (this.isEditing() && docId) {
        // `id` só na URL: o ValidationPipe do backend recusa campos fora do DTO.
        await firstValueFrom(this.astrologyService.updateAstrology(docId, astroData));
        this.isEditing.set(false);
        this.outdatedPillar.set(true);
      } else {
        await firstValueFrom(this.astrologyService.createAstrologyByUser(astroData));
      }
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
