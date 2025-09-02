export interface NovoOperador {
  nome: string;
  senha: string;
  patioId: number;
}

export interface Operador {
  id: number;
  nome: string;
  role: string;
  patio: {
    id: number;
    apelido: string;
    capacidade: number;
    area: number;
    logradouro: string;
    cidade: string;
    estado: string;
    cep: string;
    numero: number;
  };
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface Moto {
  tipoMoto: "MOTTU_SPORT" | "MOTTU_E" | "MOTTU_POP";
  ano: number;
  placa: string;
  precoAluguel: number;
  statusMoto: "ALUGADA" | "DISPONIVEL" | "MANUTENCAO";
  dataAlocacao: Date | null;
}

export interface PatioInfoPosicoes {
  capacidadeMax: number;
  posicoesDisponiveis: number;
  posicoesOcupadas: number;
}
