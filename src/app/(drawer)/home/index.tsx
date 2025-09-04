import type { Operador, PatioInfo } from "@/interfaces/interfaces"
import { ActivityIndicator, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"

export default function HomeScreen() {
  const [operador, setOperador] = useState<Operador | null>()
  const [patioInfo, setPatioInfo] = useState<PatioInfo | null>()
  const [loading, setLoading] = useState(true)
  const [erroOperador, setErroOperador] = useState<string>("")
  const [erroPatio, setErroPatio] = useState<string>("")
  const { token, patioId } = useAuth()

  useEffect(() => {
    if (!token) {
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
      return
    }
    const fetchData = async () => {
      try {
        const response = await request<PatioInfo>(
          `/patio/${patioId}`,
          "get",
          null,
          {
            authToken: token,
          }
        )

        setPatioInfo(response)
        setLoading(false)
      } catch (error) {
        console.log(error)

        setErroPatio("Houve um erro ao buscar os dados do pátio")
      }
    }
    fetchData()
  }, [token, patioId])

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
    <SafeAreaView className="flex-1 bg-[#f9f9f9] px-4 dark:bg-[#333]">
      <View className="items-start justify-between">
        {erroOperador && (
          <Text className="mb-2 font-semibold text-red-500">
            {erroOperador}
          </Text>
        )}
        <Text className="mb-2 font-semibold text-2xl text-[#05AF31]">
          Olá, {operador.nome.split(" ")[0]}
        </Text>
        <Text className="text-lg dark:text-white">{patioInfo?.apelido}</Text>
        <Text className="mb-6 text-lg dark:text-white">
          {`${patioInfo?.endereco.logradouro}, `}
          {patioInfo?.endereco.numero}
        </Text>
      </View>

      <View className="gap-4">
        {erroPatio && (
          <Text className="mb-2 font-semibold text-red-500">{erroPatio}</Text>
        )}
        <View className="rounded-xl bg-[#05AF31] p-5 shadow-md">
          <Text className="mb-2 text-white">Motos no Pátio</Text>
          <Text className="font-bold text-2xl text-white">
            {patioInfo?.posicoesOcupadas} / {patioInfo?.capacidadeMax}
          </Text>
        </View>

        <View className="rounded-xl bg-[#05AF31] p-5 shadow-md">
          <Text className="mb-2 text-white">Posições Disponíveis</Text>
          <Text className="font-bold text-2xl text-white">
            {patioInfo?.posicoesDisponiveis}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
