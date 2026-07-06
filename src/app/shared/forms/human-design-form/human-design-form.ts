import { Component, OnInit, inject, signal } from '@angular/core';
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
import { Infinity } from '../../loading/infinity/infinity';
import { DnaStatus } from '../../../core/models/dna-status.model';
import { PillarFormBase } from '../pillar-form.base';

@Component({
  selector: 'app-human-design-form',
  imports: [IconTextButton, ɵInternalFormsSharedModule, ReactiveFormsModule, Infinity],
  templateUrl: './human-design-form.html',
  styleUrl: './human-design-form.scss',
})
export class HumanDesignForm extends PillarFormBase implements OnInit {
  protected readonly pillar = 'human-design' as const;
  private readonly fb = inject(FormBuilder);
  private readonly hdService = inject(HumanDesignService);
  readonly humanDesignData = signal<HumanDesignData | null>(null);

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

  async ngOnInit(): Promise<void> {
    await this.initPillarForm();
  }

  protected hasPillarData(status: DnaStatus | null): boolean {
    return !!status?.human_design;
  }

  protected async loadPillarData(): Promise<void> {
    await this.getHumanDesignData();
  }

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
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async getHumanDesignData() {
    this.isLoading.set(true);
    try {
      this.humanDesignData.set(
        await firstValueFrom(this.hdService.getByUserId(this.maestraId())),
      );
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
