import type { Operador, PatioInfoPosicoes } from "@/interfaces/interfaces"
import { ActivityIndicator, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"

export default function HomeScreen() {
  const [operador, setOperador] = useState<Operador | null>()
  const [patioInfo, setPatioInfo] = useState<PatioInfoPosicoes | null>()
  const [loading, setLoading] = useState(true)
  const [erroOperador, setErroOperador] = useState<string>("")
  const [erroPatio, setErroPatio] = useState<string>("")
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      console.error("Token não encontrado. Usuário não está autenticado.")
      return
    }

    const fetchData = async () => {
      try {
        const response = await request<Operador>("/operador/me", "get", null, {
          authToken: token,
        })

        setOperador(response)
      } catch (error) {
        setErroOperador("Houve um erro ao buscar os dados do operador")
      }
    }
    fetchData()
  }, [token])

  useEffect(() => {
    if (!token) {
      console.error("Token não encontrado. Usuário não está autenticado.")
      return
    }
    if (!operador) return
    const fetchData = async () => {
      try {
        const response = await request<PatioInfoPosicoes>(
          `/patio/${operador.patio.id}`,
          "get",
          null,
          {
            authToken: token,
          }
        )

        setPatioInfo(response)
        setLoading(false)
      } catch (error) {
        console.log("deu erro aonde?")
        console.log(error)

        setErroPatio("Houve um erro ao buscar os dados do pátio")
      }
    }
    fetchData()
  }, [token, operador])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f9f9f9] dark:bg-[#333]">
        <ActivityIndicator size="large" color="#05AF31" />
      </View>
    )
  }

  if (!operador) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f9f9f9] dark:bg-[#333]">
        <Text className="text-red-600">Operador não encontrado.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f9f9f9] px-5 pt-[100px] dark:bg-[#333]">
      <View className="flex-row items-start justify-between">
        <View>
          {erroOperador && (
            <Text className="mb-2 font-semibold text-red-500">
              {erroOperador}
            </Text>
          )}
          <Text className="mb-2 font-semibold text-[#05AF31] text-[24px]">
            Olá, {operador.nome.split(" ")[0]}
          </Text>
          <Text className="text-[#333] text-[18px] dark:text-[#ccc]">
            {operador.patio.apelido}
          </Text>
          <Text className="mb-6 text-[#333] text-[16px] dark:text-[#ccc]">
            {`${operador.patio.logradouro}, `}
            {operador.patio.numero}
          </Text>
        </View>
        <View className="flex-row items-center gap-8">
          <Ionicons
            name={theme === "light" ? "moon-outline" : "sunny-outline"}
            size={theme === "light" ? 30 : 35}
            color={theme === "light" ? "#333" : "#ccc"}
            onPress={toggleTheme}
          />
        </View>
      </View>

      <View className="mt-6 mb-6 gap-5">
        {erroPatio && (
          <Text className="mb-2 font-semibold text-red-500">{erroPatio}</Text>
        )}
        <View className="rounded-xl bg-[#05AF31] p-5 shadow-md">
          <Text className="mb-2 text-[16px] text-white dark:text-[#ddd]">
            Motos no Pátio
          </Text>
          <Text className="font-bold text-[24px] text-white dark:text-[#ddd]">
            {patioInfo?.posicoesOcupadas} / {patioInfo?.capacidadeMax}
          </Text>
        </View>

        <View className="rounded-xl bg-[#05AF31] p-5 shadow-md">
          <Text className="mb-2 text-[16px] text-white dark:text-[#ddd]">
            Posições Disponíveis
          </Text>
          <Text className="font-bold text-[24px] text-white dark:text-[#ddd]">
            {patioInfo?.posicoesDisponiveis}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
