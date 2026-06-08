import { Component, inject, input, OnInit, signal } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { HumanDesignService } from '../../../core/services/human-design.service';
import { Canal, HumanDesignData } from '../../../core/models/dhdata.model';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from '../../loading/infinity/infinity';
import { DnaStatusService } from '../../../core/services/dna-status.service';
import { DnaStatus } from '../../../core/models/dna-status.model';
import { SupplyService } from '../../../core/services/supply.service';
import { response } from 'express';
import { sign } from 'crypto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-human-design-form',
  imports: [IconTextButton, ɵInternalFormsSharedModule, ReactiveFormsModule, Infinity],
  templateUrl: './human-design-form.html',
  styleUrl: './human-design-form.scss',
})
export class HumanDesignForm implements OnInit {
  async ngOnInit(): Promise<void> {
    await this.getDnaStatus();
    if (this.dnaStatus()?.human_design) {
      await this.getHumanDesignData();
      await this.checkSupplyByMaestraId();
    }
  }

  maestraId = input.required<string>();
  isLoading = signal(false);
  loadingMessage = signal<string | null>(null);
  dnaStatus = signal<DnaStatus | null>(null);
  humanDesignData = signal<HumanDesignData | null>(null);
  isSupplyCreated = signal<boolean>(false);
  router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly hdService = inject(HumanDesignService);
  private readonly dnaStatusService = inject(DnaStatusService);
  private readonly supplyService = inject(SupplyService);

  protected dhForm = this.fb.nonNullable.group({
    tipo_aurico: this.fb.control('', [Validators.required]),
    aura: this.fb.control('', [Validators.required]),
    energia: this.fb.control('', [Validators.required]),
    palavra_chave: this.fb.control('', [Validators.required]),
    estrategia: this.fb.control('', [Validators.required]),
    assinatura: this.fb.control('', [Validators.required]),
    nao_ser: this.fb.control('', [Validators.required]),
    autoridade: this.fb.control('', [Validators.required]),
    perfil: this.fb.control('', [Validators.required]),
    centros_definidos: this.fb.control('', [Validators.required]),
    centros_indefinidos: this.fb.control('', [Validators.required]),
    centros_abertos: this.fb.control('', [Validators.required]),
    canais: this.fb.nonNullable.array([
      this.fb.nonNullable.group({
        id: ['', Validators.required],
        nome: ['', Validators.required],
      }),
    ]),
    personalidade_sol: this.fb.control('', [Validators.required]),
    personalidade_terra: this.fb.control('', [Validators.required]),
    personalidade_lua: this.fb.control('', [Validators.required]),
    desenho_sol: this.fb.control('', [Validators.required]),
    desenho_terra: this.fb.control('', [Validators.required]),
    desenho_lua: this.fb.control('', [Validators.required]),
    angulo: this.fb.control('', [Validators.required]),
    cruz: this.fb.control('', [Validators.required]),
    portoes: this.fb.control('', [Validators.required]),
    quarto_cruz: this.fb.control('', [Validators.required]),
  });

  get canais() {
    return this.dhForm.get('canais') as FormArray;
  }

  addCanal() {
    this.canais.push(
      this.fb.nonNullable.group({
        id: ['', Validators.required],
        nome: ['', Validators.required],
      }),
    );
  }

  removeCanal(index: number) {
    this.canais.removeAt(index);
  }

  //HTTP Requests

  async saveHumanDesignData() {
    this.isLoading.set(true);
    const form = this.dhForm.getRawValue();
    try {
      const dhData: HumanDesignData = {
        userId: this.maestraId(),
        tipo_aurico: form.tipo_aurico!,
        aura: form.aura!,
        energia: form.energia!,
        palavra_chave: form.palavra_chave!,
        estrategia: form.estrategia!,
        assinatura: form.assinatura!,
        tema_do_nao_ser: form.nao_ser!,
        autoridade: form.autoridade!,
        perfil: form.perfil!,
        centros_energeticos: {
          definidos: form.centros_definidos!,
          indefinidos: form.centros_indefinidos!,
          abertos: form.centros_abertos!,
        },
        ativacoes: {
          personalidade: {
            sol: Number(form.personalidade_sol),
            terra: Number(form.personalidade_terra),
            lua: Number(form.personalidade_lua),
          },
          desenho: {
            sol: Number(form.desenho_sol),
            terra: Number(form.desenho_terra),
            lua: Number(form.desenho_lua),
          },
        },
        encarnacao: {
          angulo: form.angulo!,
          cruz: form.cruz!,
          portoes: form.portoes!,
          quarto_de_cruz: form.quarto_cruz!,
        },
        canais: form.canais as Canal[],
      };
      await firstValueFrom(this.hdService.createHumanDesignByUser(dhData));
      this.dhForm.reset();
      this.getDnaStatus();
      this.getHumanDesignData();
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

  async getHumanDesignData() {
    this.isLoading.set(true);
    try {
      this.humanDesignData.set(await firstValueFrom(this.hdService.getByUserId(this.maestraId())));
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
        this.supplyService.isSupplyForThisUser(this.maestraId(), 'human-design'),
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
      await firstValueFrom(this.supplyService.createFullPillar('human-design', this.maestraId()));
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
