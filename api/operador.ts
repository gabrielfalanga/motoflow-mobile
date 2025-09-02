import { LoginPayload } from "./../interfaces/interfaces";
import axios from "axios";
import { apiUrl } from "../constants/apiUrl";
import { Operador } from "../interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function login(loginPayload: LoginPayload) {
  try {
    const response = await axios.post(`${apiUrl}/login`, loginPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const token = response.data.token;
    await AsyncStorage.setItem("tokenOperador", token);
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function cadastrarOperador(novoOperador: Operador) {
  try {
    const response = await axios.post(`${apiUrl}/operador`, novoOperador);
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}

export async function editarOperador(dadosAtualizados: Operador) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.put(`${apiUrl}/operador/me`, dadosAtualizados);
    return { data: response.data, status: response.status, error: null };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    };
  }
}
