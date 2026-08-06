import { Component, OnInit, inject, signal } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { NumerologyService } from '../../../core/services/numerology.service';
import { NumerologyData } from '../../../core/models/numdata.model';
import { firstValueFrom } from 'rxjs';
import { Infinity } from '../../loading/infinity/infinity';
import { DnaStatus } from '../../../core/models/dna-status.model';
import { PillarFormBase } from '../pillar-form.base';

@Component({
  selector: 'app-numerology-form',
  imports: [IconTextButton, ɵInternalFormsSharedModule, ReactiveFormsModule, Infinity],
  templateUrl: './numerology-form.html',
  styleUrl: './numerology-form.scss',
})
export class NumerologyForm extends PillarFormBase implements OnInit {
  protected readonly pillar = 'numerology' as const;
  private readonly fb = inject(FormBuilder);
  private readonly numService = inject(NumerologyService);
  readonly numerologyData = signal<NumerologyData | null>(null);

  protected numForm = this.fb.nonNullable.group({
    // Perfil
    motivacao: this.fb.control<number | null>(null, [Validators.required]),
    impressao: this.fb.control<number | null>(null, [Validators.required]),
    expressao: this.fb.control<number | null>(null, [Validators.required]),
    destino: this.fb.control<number | null>(null, [Validators.required]),
    missao: this.fb.control<number | null>(null, [Validators.required]),
    data_natalicia: this.fb.control<number | null>(null, [Validators.required]),
    numero_psiquico: this.fb.control<number | null>(null, [Validators.required]),
    talento_oculto: this.fb.control<number | null>(null, [Validators.required]),

    // Ciclos de vida (3 fixos)
    ciclo1_inicio: this.fb.control<number | null>(null, [Validators.required]),
    ciclo1_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    ciclo1_numero: this.fb.control<number | null>(null, [Validators.required]),
    ciclo2_inicio: this.fb.control<number | null>(null, [Validators.required]),
    ciclo2_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    ciclo2_numero: this.fb.control<number | null>(null, [Validators.required]),
    ciclo3_inicio: this.fb.control<number | null>(null, [Validators.required]),
    ciclo3_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    ciclo3_numero: this.fb.control<number | null>(null, [Validators.required]),

    // Desafios (3 fixos)
    desafio1_inicio: this.fb.control<number | null>(null, [Validators.required]),
    desafio1_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    desafio1_numero: this.fb.control<number | null>(null, [Validators.required]),
    desafio2_inicio: this.fb.control<number | null>(null, [Validators.required]),
    desafio2_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    desafio2_numero: this.fb.control<number | null>(null, [Validators.required]),
    desafio3_inicio: this.fb.control<number | null>(null, [Validators.required]),
    desafio3_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    desafio3_numero: this.fb.control<number | null>(null, [Validators.required]),

    // Momentos Decisivos (4 fixos)
    momento1_inicio: this.fb.control<number | null>(null, [Validators.required]),
    momento1_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    momento1_numero: this.fb.control<number | null>(null, [Validators.required]),
    momento2_inicio: this.fb.control<number | null>(null, [Validators.required]),
    momento2_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    momento2_numero: this.fb.control<number | null>(null, [Validators.required]),
    momento3_inicio: this.fb.control<number | null>(null, [Validators.required]),
    momento3_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    momento3_numero: this.fb.control<number | null>(null, [Validators.required]),
    momento4_inicio: this.fb.control<number | null>(null, [Validators.required]),
    momento4_fim: this.fb.control<number | string | null>(null, [Validators.required]),
    momento4_numero: this.fb.control<number | null>(null, [Validators.required]),

    // Ano Pessoal
    ano_atual_numero: this.fb.control<number | null>(null, [Validators.required]),
    ano_atual_validade: this.fb.control('', [Validators.required]),
    ano_proximo_numero: this.fb.control<number | null>(null, [Validators.required]),
    ano_proximo_validade: this.fb.control('', [Validators.required]),

    // Extras
    respostas_subconscientes: this.fb.control<number | null>(null, [Validators.required]),
    tendencias_ocultas: this.fb.nonNullable.array([this.fb.control<number | null>(null, [Validators.required])]),
    numeros_favoraveis: this.fb.nonNullable.array([this.fb.control<number | null>(null, [Validators.required])]),
  });

  get tendenciasOcultas() {
    return this.numForm.get('tendencias_ocultas') as FormArray;
  }

  get numerosFavoraveis() {
    return this.numForm.get('numeros_favoraveis') as FormArray;
  }

  addTendencia() {
    this.tendenciasOcultas.push(this.fb.control<number | null>(null, [Validators.required]));
  }

  removeTendencia(index: number) {
    this.tendenciasOcultas.removeAt(index);
  }

  addNumeroFavoravel() {
    this.numerosFavoraveis.push(this.fb.control<number | null>(null, [Validators.required]));
  }

  removeNumeroFavoravel(index: number) {
    this.numerosFavoraveis.removeAt(index);
  }

  async ngOnInit(): Promise<void> {
    await this.initPillarForm();
  }

  protected hasPillarData(status: DnaStatus | null): boolean {
    return !!status?.numerology;
  }

  protected async loadPillarData(): Promise<void> {
    await this.getNumerologyData();
  }

  /** Repõe no formulário os dados já cadastrados, para a reedição. */
  protected prefillForm(): void {
    const data = this.numerologyData();
    if (!data) return;

    // Os três blocos de período são arrays no model e controls achatados no
    // formulário (ciclo1_*, ciclo2_*, ...), daí o mapeamento por índice.
    const [ciclo1, ciclo2, ciclo3] = data.ciclos_de_vida ?? [];
    const [desafio1, desafio2, desafio3] = data.desafios ?? [];
    const [momento1, momento2, momento3, momento4] = data.momentos_decisivos ?? [];

    this.numForm.patchValue({
      motivacao: data.perfil?.motivacao,
      impressao: data.perfil?.impressao,
      expressao: data.perfil?.expressao,
      destino: data.perfil?.destino,
      missao: data.perfil?.missao,
      data_natalicia: data.perfil?.data_natalicia,
      numero_psiquico: data.perfil?.numero_psiquico,
      talento_oculto: data.perfil?.talento_oculto,

      ciclo1_inicio: ciclo1?.inicio,
      ciclo1_fim: ciclo1?.fim,
      ciclo1_numero: ciclo1?.numero,
      ciclo2_inicio: ciclo2?.inicio,
      ciclo2_fim: ciclo2?.fim,
      ciclo2_numero: ciclo2?.numero,
      ciclo3_inicio: ciclo3?.inicio,
      ciclo3_fim: ciclo3?.fim,
      ciclo3_numero: ciclo3?.numero,

      desafio1_inicio: desafio1?.inicio,
      desafio1_fim: desafio1?.fim,
      desafio1_numero: desafio1?.numero,
      desafio2_inicio: desafio2?.inicio,
      desafio2_fim: desafio2?.fim,
      desafio2_numero: desafio2?.numero,
      desafio3_inicio: desafio3?.inicio,
      desafio3_fim: desafio3?.fim,
      desafio3_numero: desafio3?.numero,

      momento1_inicio: momento1?.inicio,
      momento1_fim: momento1?.fim,
      momento1_numero: momento1?.numero,
      momento2_inicio: momento2?.inicio,
      momento2_fim: momento2?.fim,
      momento2_numero: momento2?.numero,
      momento3_inicio: momento3?.inicio,
      momento3_fim: momento3?.fim,
      momento3_numero: momento3?.numero,
      momento4_inicio: momento4?.inicio,
      momento4_fim: momento4?.fim,
      momento4_numero: momento4?.numero,

      ano_atual_numero: data.ano_pessoal?.atual?.numero,
      ano_atual_validade: data.ano_pessoal?.atual?.validade,
      ano_proximo_numero: data.ano_pessoal?.proximo?.numero,
      ano_proximo_validade: data.ano_pessoal?.proximo?.validade,

      respostas_subconscientes: data.extras?.respostas_subconscientes,
    });

    // FormArrays reconstruídos: a quantidade de itens varia por Maestra.
    this.fillNumberArray(this.tendenciasOcultas, data.extras?.tendencias_ocultas);
    this.fillNumberArray(this.numerosFavoraveis, data.extras?.numeros_favoraveis);
  }

  private fillNumberArray(array: FormArray, values?: number[]) {
    array.clear();
    for (const value of values ?? []) {
      array.push(this.fb.control<number | null>(value, [Validators.required]));
    }
    if (array.length === 0) {
      array.push(this.fb.control<number | null>(null, [Validators.required]));
    }
  }

  async saveNumerologyData() {
    this.isLoading.set(true);
    const form = this.numForm.getRawValue();
    try {
      const numData: NumerologyData = {
        userId: this.maestraId(),
        perfil: {
          motivacao: form.motivacao!,
          impressao: form.impressao!,
          expressao: form.expressao!,
          destino: form.destino!,
          missao: form.missao!,
          data_natalicia: form.data_natalicia!,
          numero_psiquico: form.numero_psiquico!,
          talento_oculto: form.talento_oculto!,
        },
        ciclos_de_vida: [
          { inicio: form.ciclo1_inicio!, fim: form.ciclo1_fim!, numero: form.ciclo1_numero! },
          { inicio: form.ciclo2_inicio!, fim: form.ciclo2_fim!, numero: form.ciclo2_numero! },
          { inicio: form.ciclo3_inicio!, fim: form.ciclo3_fim!, numero: form.ciclo3_numero! },
        ],
        desafios: [
          { inicio: form.desafio1_inicio!, fim: form.desafio1_fim!, numero: form.desafio1_numero! },
          { inicio: form.desafio2_inicio!, fim: form.desafio2_fim!, numero: form.desafio2_numero! },
          { inicio: form.desafio3_inicio!, fim: form.desafio3_fim!, numero: form.desafio3_numero! },
        ],
        momentos_decisivos: [
          { inicio: form.momento1_inicio!, fim: form.momento1_fim!, numero: form.momento1_numero! },
          { inicio: form.momento2_inicio!, fim: form.momento2_fim!, numero: form.momento2_numero! },
          { inicio: form.momento3_inicio!, fim: form.momento3_fim!, numero: form.momento3_numero! },
          { inicio: form.momento4_inicio!, fim: form.momento4_fim!, numero: form.momento4_numero! },
        ],
        ano_pessoal: {
          atual: { numero: form.ano_atual_numero!, validade: form.ano_atual_validade! },
          proximo: { numero: form.ano_proximo_numero!, validade: form.ano_proximo_validade! },
        },
        extras: {
          tendencias_ocultas: form.tendencias_ocultas as number[],
          respostas_subconscientes: form.respostas_subconscientes!,
          numeros_favoraveis: form.numeros_favoraveis as number[],
        },
      };
      const docId = this.numerologyData()?.id;
      if (this.isEditing() && docId) {
        // `id` só na URL: o ValidationPipe do backend recusa campos fora do DTO.
        await firstValueFrom(this.numService.updateNumerology(docId, numData));
        this.isEditing.set(false);
        this.outdatedPillar.set(true);
      } else {
        await firstValueFrom(this.numService.createNumerologyByUser(numData));
      }
      this.numForm.reset();
      this.getDnaStatus();
      this.getNumerologyData();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async getNumerologyData() {
    this.isLoading.set(true);
    try {
      this.numerologyData.set(
        await firstValueFrom(this.numService.getByUserId(this.maestraId())),
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
