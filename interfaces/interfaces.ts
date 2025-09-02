export interface Operador {
  nome: string;
  senha: string;
  patioId: number;
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
