export interface PeriodoNumerologico {
  inicio: number;
  fim: number | string;
  numero: number;
}

export interface AnoPessoal {
    numero: number,
    validade: string
}

export interface NumerologyData {
  perfil: {
    motivacao: number;
    impressao: number;
    expressao: number;
    destino: number;
    missao: number;
    data_natalicia: number;
    numero_psiquico: number;
    talento_oculto: number;
  };
  ciclos_de_vida: PeriodoNumerologico[];
  desafios: PeriodoNumerologico[];
  momentos_decisivos: PeriodoNumerologico[];
  ano_pessoal: {
    atual: AnoPessoal;
    proximo: AnoPessoal;
  };
  extras: {
    tendencias_ocultas: number[];
    respostas_subconscientes: number;
    numeros_favoraveis: number[];
  };
}