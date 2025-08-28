import { LoginPayload } from './../interfaces/interfaces';
import axios from "axios";
import { apiUrl } from "../constants/apiUrl";
import { Operador } from "../interfaces/interfaces";
import AsyncStorage from '@react-native-async-storage/async-storage';


export async function login(LoginPayload: LoginPayload) {
    const response = await axios.post(`${apiUrl}/operador/login`, LoginPayload);
    const token = response.data.token;
    await AsyncStorage.setItem("tokenOperador", token);
    return response.data;
}

export async function cadastrarOperador(novoOperador: Operador) {
    const response = await axios.post(`${apiUrl}/operador/cadastrar`)
    return response.data;
}

export async function editarOperador(dadosAtualizados: Operador) {
    const token = await AsyncStorage.getItem("tokenOperador");
    const response = await axios.put(`${apiUrl}/operador/me/${token}`, dadosAtualizados);
    return response.data;
}