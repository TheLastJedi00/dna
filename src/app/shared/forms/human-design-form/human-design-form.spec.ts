import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';

import { HumanDesignForm } from './human-design-form';
import { HumanDesignService } from '../../../core/services/human-design.service';
import { DnaStatusService } from '../../../core/services/dna-status.service';
import { SupplyService } from '../../../core/services/supply.service';
import { HumanDesignData } from '../../../core/models/dhdata.model';

/**
 * Cobre a otimização da spec 006: o Tipo Áurico preenche aura, energia,
 * palavra-chave e estratégia; o Ângulo preenche o Grupo de Destino; e ambos
 * chegam ao payload enviado à API.
 */
describe('HumanDesignForm', () => {
  let component: HumanDesignForm;
  let fixture: ComponentFixture<HumanDesignForm>;
  let hdService: jasmine.SpyObj<HumanDesignService>;

  const form = () => component['dhForm'];

  beforeEach(async () => {
    hdService = jasmine.createSpyObj('HumanDesignService', [
      'createHumanDesignByUser',
      'getByUserId',
    ]);
    hdService.createHumanDesignByUser.and.returnValue(of({} as HumanDesignData));
    hdService.getByUserId.and.returnValue(of({} as HumanDesignData));

    await TestBed.configureTestingModule({
      imports: [HumanDesignForm],
      providers: [
        provideZonelessChangeDetection(),
        { provide: HumanDesignService, useValue: hdService },
        {
          provide: DnaStatusService,
          useValue: { getStatusByUserId: () => of(null) },
        },
        {
          provide: SupplyService,
          useValue: {
            isSupplyForThisUser: () => of(false),
            createFullPillar: () => of(null),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ maestraId: 'm1' }) },
          },
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HumanDesignForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const derivados = [
    {
      tipo: 'Geradora',
      aura: 'Aberta e Envolvente',
      energia: 'Gera Energia',
      palavra_chave: 'Construtora',
      estrategia: 'Responder à Vida',
    },
    {
      tipo: 'Geradora Manifestante',
      aura: 'Aberta e Envolvente',
      energia: 'Gera Energia',
      palavra_chave: 'Construtora',
      estrategia: 'Responder à Vida',
    },
    {
      tipo: 'Projetora',
      aura: 'Focalizada e Absorvente',
      energia: 'Não Energético',
      palavra_chave: 'Guia',
      estrategia: 'Aguardar os Convites',
    },
    {
      tipo: 'Manifestadora',
      aura: 'Fechada e Repelente',
      energia: 'Inicia Energia',
      palavra_chave: 'Guia',
      estrategia: 'Informar Antes de Agir',
    },
    {
      tipo: 'Refletora',
      aura: 'Que Tira Amostras',
      energia: 'Não Energético',
      palavra_chave: 'Discernidora',
      estrategia: 'Aguardar o Ciclo Lunar',
    },
  ];

  derivados.forEach(({ tipo, ...esperado }) => {
    it(`preenche aura, energia, palavra e estratégia de ${tipo}`, () => {
      form().controls.tipo_aurico.setValue(tipo);
      expect(form().getRawValue()).toEqual(jasmine.objectContaining(esperado));
    });
  });

  const grupos = [
    { angulo: 'Ângulo Direito', grupo: 'Pessoal' },
    { angulo: 'Ângulo Esquerdo', grupo: 'Transpessoal' },
    { angulo: 'Justa Posição', grupo: 'Justa Posição' },
  ];

  grupos.forEach(({ angulo, grupo }) => {
    it(`preenche o grupo de destino de ${angulo}`, () => {
      form().controls.angulo.setValue(angulo);
      expect(form().controls.grupo_de_destino.value).toBe(grupo);
    });
  });

  it('envia os campos derivados no payload', async () => {
    form().controls.tipo_aurico.setValue('Projetora');
    form().controls.angulo.setValue('Ângulo Esquerdo');
    form().controls.quarto_cruz.setValue('Quarto 2 - Civilização');

    await component.saveHumanDesignData();

    const enviado = hdService.createHumanDesignByUser.calls.mostRecent().args[0] as HumanDesignData;
    expect(enviado.encarnacao.grupo_de_destino).toBe('Transpessoal');
    expect(enviado.encarnacao.quarto_de_cruz).toBe('Quarto 2 - Civilização');
    expect(enviado.tipo_aurico).toBe('Projetora');
    expect(enviado.estrategia).toBe('Aguardar os Convites');
  });
});
