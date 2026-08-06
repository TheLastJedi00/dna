export interface PontoAstrologico {
  signo: string;
  casaAstrologica: number;
  planetas: string | null;
}

export interface Elementos {
  fogo: number;
  terra: number;
  ar: number;
  agua: number;
}

export interface TriadeAstrologica {
  sol: PontoAstrologico;
  ascendente: PontoAstrologico;
  lua: PontoAstrologico;
}

export interface LeituraAstrologica {
  /** Id do documento; vem no GET e é a chave do PATCH de edição. */
  id?: string;
  userId?: string;
  triadeAstrologica: TriadeAstrologica;
  meioDoCeu: PontoAstrologico;
  dinheiro: PontoAstrologico;
  comunicacao: PontoAstrologico;
  elementos: Elementos;
}