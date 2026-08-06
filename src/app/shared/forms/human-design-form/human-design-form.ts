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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ANGULOS,
  ANGULO_GRUPO_MAP,
  Angulo,
  QUARTOS_DE_CRUZ,
  TIPOS_AURICOS,
  TIPO_AURICO_MAP,
  TipoAurico,
} from '../../../core/models/human-design.constants';

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
    grupo_de_destino: this.fb.control('', [Validators.required]),
    cruz: this.fb.control('', [Validators.required]),
    portoes: this.fb.control('', [Validators.required]),
    quarto_cruz: this.fb.control('', [Validators.required]),
  });

  protected readonly tiposAuricos = TIPOS_AURICOS;
  protected readonly quartosDeCruz = QUARTOS_DE_CRUZ;
  protected readonly angulos = ANGULOS;

  constructor() {
    super();
    this.dhForm.controls.tipo_aurico.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((tipo) => this.applyTipoAurico(tipo as TipoAurico));
    this.dhForm.controls.angulo.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((angulo) => this.applyAngulo(angulo as Angulo));
  }

  /** Tipo Áurico preenche aura, energia, palavra-chave e estratégia. */
  private applyTipoAurico(tipo: TipoAurico) {
    const derivados = TIPO_AURICO_MAP[tipo];
    this.dhForm.patchValue(
      {
        aura: derivados?.aura ?? '',
        energia: derivados?.energia ?? '',
        palavra_chave: derivados?.palavra_chave ?? '',
        estrategia: derivados?.estrategia ?? '',
      },
      { emitEvent: false },
    );
  }

  /** Ângulo da Cruz preenche o Grupo de Destino. */
  private applyAngulo(angulo: Angulo) {
    this.dhForm.controls.grupo_de_destino.setValue(ANGULO_GRUPO_MAP[angulo] ?? '', {
      emitEvent: false,
    });
  }

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

  /** Repõe no formulário os dados já cadastrados, para a reedição. */
  protected prefillForm(): void {
    const data = this.humanDesignData();
    if (!data) return;

    // O FormArray de canais é reconstruído: a quantidade varia por Maestra.
    this.canais.clear();
    for (const canal of data.canais ?? []) {
      this.canais.push(
        this.fb.nonNullable.group({
          id: [canal.id, Validators.required],
          nome: [canal.nome, Validators.required],
        }),
      );
    }
    if (this.canais.length === 0) this.addCanal();

    this.dhForm.patchValue({
      tipo_aurico: data.tipo_aurico,
      aura: data.aura,
      energia: data.energia,
      palavra_chave: data.palavra_chave,
      estrategia: data.estrategia,
      assinatura: data.assinatura,
      nao_ser: data.tema_do_nao_ser,
      autoridade: data.autoridade,
      perfil: data.perfil,
      centros_definidos: data.centros_energeticos?.definidos,
      centros_indefinidos: data.centros_energeticos?.indefinidos,
      centros_abertos: data.centros_energeticos?.abertos,
      personalidade_sol: String(data.ativacoes?.personalidade?.sol ?? ''),
      personalidade_terra: String(data.ativacoes?.personalidade?.terra ?? ''),
      personalidade_lua: String(data.ativacoes?.personalidade?.lua ?? ''),
      desenho_sol: String(data.ativacoes?.desenho?.sol ?? ''),
      desenho_terra: String(data.ativacoes?.desenho?.terra ?? ''),
      desenho_lua: String(data.ativacoes?.desenho?.lua ?? ''),
      angulo: data.encarnacao?.angulo,
      grupo_de_destino: data.encarnacao?.grupo_de_destino,
      cruz: data.encarnacao?.cruz,
      portoes: data.encarnacao?.portoes,
      quarto_cruz: data.encarnacao?.quarto_de_cruz,
    });
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
          grupo_de_destino: form.grupo_de_destino!,
          cruz: form.cruz!,
          portoes: form.portoes!,
          quarto_de_cruz: form.quarto_cruz!,
        },
        canais: form.canais as Canal[],
      };
      const docId = this.humanDesignData()?.id;
      if (this.isEditing() && docId) {
        // `id` só na URL: o ValidationPipe do backend recusa campos fora do DTO.
        await firstValueFrom(this.hdService.updateHumanDesign(docId, dhData));
        this.isEditing.set(false);
        this.outdatedPillar.set(true);
      } else {
        await firstValueFrom(this.hdService.createHumanDesignByUser(dhData));
      }
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
      this.humanDesignData.set(await firstValueFrom(this.hdService.getByUserId(this.maestraId())));
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
