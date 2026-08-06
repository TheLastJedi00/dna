export interface Canal {
  id: string;
  nome: string;
}

export interface CentrosEnergeticos {
  definidos: string;
  indefinidos: string;
  abertos: string;
}

export interface PontosAtivacao {
  sol: number;
  terra: number;
  lua: number;
}

export interface Ativacoes {
  personalidade: PontosAtivacao;
  desenho: PontosAtivacao;
}

export interface CruzEncarnacao {
  angulo: string;
  grupo_de_destino: string;
  cruz: string;
  portoes: string;
  quarto_de_cruz: string;
}

export interface HumanDesignData {
  /** Id do documento; vem no GET e é a chave do PATCH de edição. */
  id?: string;
  userId?: string;
  tipo_aurico: string;
  aura: string;
  energia: string;
  palavra_chave: string;
  estrategia: string;
  assinatura: string;
  tema_do_nao_ser: string;
  autoridade: string;
  perfil: string;
  centros_energeticos: CentrosEnergeticos;
  canais: Canal[];
  ativacoes: Ativacoes;
  encarnacao: CruzEncarnacao;
}
