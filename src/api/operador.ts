import type { LoginPayload, NovoOperador } from "@/interfaces/interfaces"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

export async function login(loginPayload: LoginPayload) {
  try {
    const response = await axios.post(`oi/login`, loginPayload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    const token = response.data.token
    await AsyncStorage.setItem("tokenOperador", token)
    return { data: response.data, status: response.status, error: null }
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    }
  }
}

export async function logout() {
  const router = useRouter()

  try {
    await AsyncStorage.removeItem("tokenOperador")
    router.push("/auth/login")
    return { status: 200, error: null }
  } catch (error: any) {
    return {
      status: 500,
      error: error.message,
    }
  }
}

export async function buscarDadosOperadorLogado() {
  try {
    const token = await AsyncStorage.getItem("tokenOperador")
    const response = await axios.get(`oi/operador/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return { data: response.data, status: response.status, error: null }
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    }
  }
}

export async function cadastrarOperador(novoOperador: NovoOperador) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador")
    const response = await axios.post(`oi/operador`, novoOperador, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return { data: response.data, status: response.status, error: null }
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    }
  }
}

export async function editarOperador(dadosAtualizados: NovoOperador) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador")
    const response = await axios.put(`oi/operador/me`, dadosAtualizados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return { data: response.data, status: response.status, error: null }
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    }
  }
}

export async function deletarOperador(id: number) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador")
    const response = await axios.delete(`oi/operador/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return { data: response.data, status: response.status, error: null }
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    }
  }
}

export async function promoverOperadorParaAdmin(id: number) {
  try {
    const token = await AsyncStorage.getItem("tokenOperador")
    const response = await axios.put(`oi/operador/${id}/admin`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return { data: response.data, status: response.status, error: null }
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      error: error.message,
    }
  }
}
