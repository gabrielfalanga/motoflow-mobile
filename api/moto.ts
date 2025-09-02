import axios from "axios";
import { apiUrl } from "../constants/apiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Moto } from "../interfaces/interfaces";

export async function cadastrarMoto(moto: Moto) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.post(`${apiUrl}/motos`, moto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function cadastrarMotoEAlocarPosicaoAleatoria(moto: Moto, idPatio: number) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.post(
      `${apiUrl}/motos/cadastro-e-alocacao`,
      {
        ...moto,
        idPatio,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function deletarMoto(placa: string) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.delete(`${apiUrl}/motos/${placa}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function buscarPosicaoPorPlaca(placa: string) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.get(`${apiUrl}/motos/posicao?placa=${placa}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function editarStatusMoto(
  placa: string,
  statusMoto: "ALUGADA" | "DISPONIVEL" | "MANUTENCAO"
) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.put(
      `${apiUrl}/motos/${placa}/aluguel`,
      { statusMoto },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function alocarMoto(
  placa: string,
  posicaoHorizontal: string,
  posicaoVertical: number
) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.post(
      `${apiUrl}/motos/alocacao`,
      {
        placa,
        posicaoHorizontal,
        posicaoVertical,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function alocarMotoPosicaoAleatoria(placa: string, idPatio: number) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.post(`${apiUrl}/motos/${placa}/alocacao/${idPatio}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}
