export interface NovoOperador {
  nome: string
  senha: string
  patioId: number
}

export interface Operador {
  id: number
  nome: string
  role: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface Moto {
  tipoMoto: "MOTTU_SPORT" | "MOTTU_E" | "MOTTU_POP"
  ano: number
  placa: string
  precoAluguel: number
  statusMoto: "ALUGADA" | "DISPONIVEL" | "MANUTENCAO"
  dataAlocacao: Date | null
}

export interface PatioInfo {
  id: number
  apelido: string
  capacidade: number
  area: number
  capacidadeMax: number
  posicoesDisponiveis: number
  posicoesOcupadas: number
  endereco: {
    id: number
    logradouro: string
    numero: number
    bairro: string
    cidade: string
    siglaEstado: string
    cep: string
  }
}
