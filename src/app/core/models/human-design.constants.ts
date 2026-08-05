/**
 * Opções dos campos enumerados do Desenho Humano e as derivações entre eles.
 * O backend valida exatamente estas mesmas listas (`@IsIn`), então alterar um
 * valor aqui exige alterar o `human-design.constants.ts` da API.
 */

export const TIPOS_AURICOS = [
  'Geradora',
  'Geradora Manifestante',
  'Projetora',
  'Manifestadora',
  'Refletora',
] as const;

export const QUARTOS_DE_CRUZ = [
  'Quarto 1 - Iniciação',
  'Quarto 2 - Civilização',
  'Quarto 3 - Dualidade',
  'Quarto 4 - Mutação',
] as const;

export const ANGULOS = ['Ângulo Direito', 'Ângulo Esquerdo', 'Justa Posição'] as const;

export type TipoAurico = (typeof TIPOS_AURICOS)[number];
export type Angulo = (typeof ANGULOS)[number];

export interface TipoAuricoDerivado {
  aura: string;
  energia: string;
  palavra_chave: string;
  estrategia: string;
}

/** Campos que o Tipo Áurico preenche sozinho no formulário. */
export const TIPO_AURICO_MAP: Record<TipoAurico, TipoAuricoDerivado> = {
  Geradora: {
    aura: 'Aberta e Envolvente',
    energia: 'Gera Energia',
    palavra_chave: 'Construtora',
    estrategia: 'Responder à Vida',
  },
  'Geradora Manifestante': {
    aura: 'Aberta e Envolvente',
    energia: 'Gera Energia',
    palavra_chave: 'Construtora',
    estrategia: 'Responder à Vida',
  },
  Projetora: {
    aura: 'Focalizada e Absorvente',
    energia: 'Não Energético',
    palavra_chave: 'Guia',
    estrategia: 'Aguardar os Convites',
  },
  Manifestadora: {
    aura: 'Fechada e Repelente',
    energia: 'Inicia Energia',
    palavra_chave: 'Guia',
    estrategia: 'Informar Antes de Agir',
  },
  Refletora: {
    aura: 'Que Tira Amostras',
    energia: 'Não Energético',
    palavra_chave: 'Discernidora',
    estrategia: 'Aguardar o Ciclo Lunar',
  },
};

/** O Ângulo da Cruz define o Grupo de Destino. */
export const ANGULO_GRUPO_MAP: Record<Angulo, string> = {
  'Ângulo Direito': 'Pessoal',
  'Ângulo Esquerdo': 'Transpessoal',
  'Justa Posição': 'Justa Posição',
};
