export interface NovoOperador {
  nome: string;
  senha: string;
  patioId: number;
}

export interface Operador {
  id: number;
  nome: string;
  role: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface Moto {
  tipoMoto: "MOTTU_SPORT" | "MOTTU_E" | "MOTTU_POP";
  ano: number;
  placa: string;
  codRastreador: string;
  statusMoto: "ALUGADA" | "DISPONIVEL" | "MANUTENCAO";
  dataAlocacao: Date | null;
}

export interface PatioInfo {
  id: number;
  apelido: string;
  capacidade: number;
  area: number;
  capacidadeMax: number;
  quantidadeDisponiveis: number;
  quantidadeOcupadas: number;
  endereco: {
    id: number;
    logradouro: string;
    numero: number;
    bairro: string;
    cidade: string;
    siglaEstado: string;
    cep: string;
  };
}

export interface MotoNaPosicao {
  id: number;
  placa: string;
  tipoMoto: "MOTTU_SPORT" | "MOTTU_E" | "MOTTU_POP";
  ano: number;
  codRastreador: string;
  statusMoto: "ALUGADA" | "DISPONIVEL" | "MANUTENCAO";
  posicaoHorizontal: string;
  posicaoVertical: number;
}

export interface SetorInfo {
  setor: string;
  vagasTotais: number;
  ocupadas: number;
  disponiveis: number;
  motos: (Moto & { id: number })[];
}

export interface Setor {
  setor: string;
}
