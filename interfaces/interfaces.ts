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
    id: number;
    tipo: "Mottu Sport" | "Mottu E" | "Mottu Pop";
    ano: number;
    placa: string;
    status: "Alugada" | "Disponível" | "Manutenção";
}
