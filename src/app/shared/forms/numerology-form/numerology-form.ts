import { Component, inject, input, OnInit, signal } from '@angular/core';
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
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from '../../loading/infinity/infinity';
import { DnaStatusService } from '../../../core/services/dna-status.service';
import { DnaStatus } from '../../../core/models/dna-status.model';
import { SupplyService } from '../../../core/services/supply.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-numerology-form',
  imports: [IconTextButton, ɵInternalFormsSharedModule, ReactiveFormsModule, Infinity],
  templateUrl: './numerology-form.html',
  styleUrl: './numerology-form.scss',
})
export class NumerologyForm implements OnInit {
  async ngOnInit(): Promise<void> {
    await this.getDnaStatus();
    if (this.dnaStatus()?.numerology) {
      await this.getNumerologyData();
      await this.checkSupplyByMaestraId();
    }
  }

  maestraId = input.required<string>();
  isLoading = signal(false);
  loadingMessage = signal<string | null>(null);
  dnaStatus = signal<DnaStatus | null>(null);
  numerologyData = signal<NumerologyData | null>(null);
  isSupplyCreated = signal<boolean>(false);
  router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly numService = inject(NumerologyService);
  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly supplyService = inject(SupplyService);

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

  //HTTP Requests

  async saveNumerologyData() {
    this.isLoading.set(true);
    const form = this.numForm.getRawValue();
    try {
      const numData: NumerologyData = {
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
      await firstValueFrom(this.numService.createNumerologyByUser(numData));
      this.numForm.reset();
      this.getDnaStatus();
      this.getNumerologyData();
    } catch (error) {
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        alert(error.error.message);
      }
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
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async getNumerologyData() {
    this.isLoading.set(true);
    try {
      this.numerologyData.set(await firstValueFrom(this.numService.getByUserId(this.maestraId())));
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async checkSupplyByMaestraId() {
    this.isLoading.set(true);
    try {
      const reponse = await firstValueFrom(
        this.supplyService.isSupplyForThisUser(this.maestraId(), 'numerology'),
      );
      this.isSupplyCreated.set(reponse);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  async createAllSupply() {
    this.isLoading.set(true);
    this.loadingMessage.set('Isso pode levar alguns minutos, não feche a página.');
    try {
      await firstValueFrom(this.supplyService.createFullPillar('numerology', this.maestraId()));
      alert("Dados Gerados com Sucesso!")
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
      this.loadingMessage.set(null);
      this.checkSupplyByMaestraId();
    }
  }
}
