export interface Canal {
  id: string;
  nome: string;
}

export interface CentrosEnergeticos {
  definidos: string[] | string;
  indefinidos: string[] | string;
  abertos: string[] | string;
}

export interface PontosAtivacao {
  sol: string | number;
  terra: string | number;
  lua: string | number;
}

export interface Ativacoes {
  personalidade: PontosAtivacao;
  desenho: PontosAtivacao;
}

export interface CruzEncarnacao {
  angulo: string;
  cruz: string;
  portoes: string;
  quarto_de_cruz: string;
}

export interface HumanDesignData {
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
  canais: string[] | Canal[];
  ativacoes: Ativacoes;
  encarnacao: CruzEncarnacao;
}