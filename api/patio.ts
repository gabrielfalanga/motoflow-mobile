import axios from "axios";
import { apiUrl } from "../constants/apiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function buscarTodosPatios() {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.get(`${apiUrl}/patios`, {
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

export async function buscarPatioPorId(id: number) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.get(`${apiUrl}/patios/${id}`, {
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

export async function cadastrarPosicoesPatio(
  posicoes: { posicaoVerticalMax: number; posicaoHorizontal: string; idPatio: number }[]
) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.post(`${apiUrl}/posicoes`, posicoes, {
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
