import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"
import type { PatioInfo } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface PosicaoPatio {
  posicaoHorizontal: string
}

export default function PatioScreen() {
  const [patioInfo, setPatioInfo] = useState<PatioInfo | null>(null)
  const [posicoes, setPosicoes] = useState<PosicaoPatio[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [erroPatio, setErroPatio] = useState<string>("")
  const { token, patioId } = useAuth()

  const fetchPatioData = useCallback(
    async (isRefresh = false) => {
      if (!token) return

      if (isRefresh) setRefreshing(true)

      try {
        setLoading(true)
        const [patioResponse, posicoesResponse] = await Promise.all([
          request<PatioInfo>(`/patio/${patioId}`, "get", null, {
            authToken: token,
          }),
          request<PosicaoPatio[]>(`/posicoes/${patioId}`, "get", null, {
            authToken: token,
          }),
        ])
        setPatioInfo(patioResponse)
        setPosicoes(posicoesResponse)

        setErroPatio("")
      } catch (error) {
        console.log("Erro ao buscar dados do pátio:", error)
        setErroPatio("Houve um erro ao buscar os dados do pátio")
      } finally {
        setLoading(false)
        if (isRefresh) setRefreshing(false)
      }
    },
    [token, patioId]
  )

  useEffect(() => {
    if (token && patioId) {
      fetchPatioData()
    }
  }, [token, patioId, fetchPatioData])

  const onRefresh = () => {
    fetchPatioData(true)
  }

  const handlePosicaoClick = (posicao: string) => {
    Alert.alert("Posição Selecionada", `Você clicou na posição: ${posicao}`, [
      { text: "OK" },
    ])
  }

  const calculateOccupancyPercentage = () => {
    if (!patioInfo) return 0
    return Math.round(
      (patioInfo.posicoesOcupadas / patioInfo.capacidadeMax) * 100
    )
  }

  const getOccupancyStatus = () => {
    const percentage = calculateOccupancyPercentage()
    if (percentage >= 90) return { status: "Crítico", color: "#ef4444" }
    if (percentage >= 70) return { status: "Alto", color: "#f59e0b" }
    if (percentage >= 40) return { status: "Médio", color: "#05AF31" }
    return { status: "Baixo", color: "#05AF31" }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f9f9f9] dark:bg-[#333]">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-[#333] dark:text-[#ccc]">
          Carregando informações do pátio...
        </Text>
      </View>
    )
  }

  const occupancyData = getOccupancyStatus()

  return (
    <SafeAreaView className="flex-1 bg-[#f9f9f9] dark:bg-[#333]">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#05AF31"]}
            tintColor="#05AF31"
          />
        }
      >
        {/* Header com nome do pátio */}
        <View className="mt-4 mb-6">
          <Text className="mb-2 font-bold text-2xl text-[#05AF31]">
            {patioInfo?.apelido || "Pátio"}
          </Text>
          <Text className="text-[#666] text-base dark:text-[#ccc]">
            {patioInfo?.endereco.logradouro}, {patioInfo?.endereco.numero}
          </Text>
          <Text className="text-[#666] text-base dark:text-[#ccc]">
            {patioInfo?.endereco.cidade} - {patioInfo?.endereco.siglaEstado}
          </Text>
        </View>

        {/* Mensagem de erro */}
        {erroPatio && (
          <View className="mb-4 rounded-xl bg-red-100 p-4 dark:bg-red-900/30">
            <Text className="font-semibold text-red-600 dark:text-red-400">
              {erroPatio}
            </Text>
          </View>
        )}

        {/* Cards principais */}
        <View className="mb-6 gap-4">
          {/* Card de ocupação geral */}
          <View className="rounded-xl bg-white p-5 shadow-sm dark:bg-[#222]">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-semibold text-[#333] text-lg dark:text-[#ccc]">
                Ocupação Atual
              </Text>
              <Ionicons name="analytics-outline" size={24} color="#05AF31" />
            </View>

            <View className="flex-row items-end justify-between">
              <View>
                <Text className="font-bold text-3xl text-[#05AF31]">
                  {patioInfo?.posicoesOcupadas || 0}
                </Text>
                <Text className="text-[#666] dark:text-[#ccc]">
                  de {patioInfo?.capacidadeMax || 0} posições
                </Text>
              </View>

              <View className="items-end">
                <Text
                  className="font-bold text-2xl"
                  style={{ color: occupancyData.color }}
                >
                  {calculateOccupancyPercentage()}%
                </Text>
                <Text className="text-[#666] dark:text-[#ccc]">
                  {occupancyData.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Cards de estatísticas */}
          <View className="flex-row gap-4">
            <View className="flex-1 rounded-xl bg-[#05AF31] p-4 shadow-sm">
              <View className="mb-2 flex-row items-center justify-between">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="white"
                />
                <Text className="font-bold text-2xl text-white">
                  {patioInfo?.posicoesDisponiveis || 0}
                </Text>
              </View>
              <Text className="font-medium text-white/90">Posições Livres</Text>
            </View>

            <View className="flex-1 rounded-xl bg-[#1e40af] p-4 shadow-sm">
              <View className="mb-2 flex-row items-center justify-between">
                <Ionicons name="bicycle-outline" size={24} color="white" />
                <Text className="font-bold text-2xl text-white">
                  {patioInfo?.posicoesOcupadas || 0}
                </Text>
              </View>
              <Text className="font-medium text-white/90">Motos no Pátio</Text>
            </View>
          </View>
        </View>

        {/* Informações detalhadas */}
        <View className="mb-6 rounded-xl bg-white p-5 shadow-sm dark:bg-[#222]">
          <View className="mb-4 flex-row items-center">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#05AF31"
            />
            <Text className="ml-2 font-semibold text-[#333] text-lg dark:text-[#ccc]">
              Detalhes do Pátio
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[#666] dark:text-[#ccc]">
                Capacidade Total
              </Text>
              <Text className="font-semibold text-[#333] dark:text-white">
                {patioInfo?.capacidadeMax || 0} posições
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#666] dark:text-[#ccc]">
                Área do Pátio
              </Text>
              <Text className="font-semibold text-[#333] dark:text-white">
                {patioInfo?.area || 0} m²
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#666] dark:text-[#ccc]">CEP</Text>
              <Text className="font-semibold text-[#333] dark:text-white">
                {patioInfo?.endereco.cep || "N/A"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-[#666] dark:text-[#ccc]">
                Taxa de Ocupação
              </Text>
              <Text className="font-semibold text-[#333] dark:text-white">
                {calculateOccupancyPercentage()}%
              </Text>
            </View>
          </View>
        </View>

        {/* Lista de Posições */}
        {posicoes && posicoes.length > 0 && (
          <View className="mb-6 rounded-xl bg-white p-5 shadow-sm dark:bg-[#222]">
            <View className="mb-4 flex-row items-center">
              <Ionicons name="grid-outline" size={24} color="#05AF31" />
              <Text className="ml-2 font-semibold text-[#333] text-lg dark:text-[#ccc]">
                Posições do Pátio
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              {posicoes.map(posicao => (
                <TouchableOpacity
                  key={posicao.posicaoHorizontal}
                  className="min-w-20 rounded-lg bg-[#05AF31] p-3 shadow-sm"
                  onPress={() => handlePosicaoClick(posicao.posicaoHorizontal)}
                  activeOpacity={0.7}
                >
                  <Text className="text-center font-semibold text-white">
                    {posicao.posicaoHorizontal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Indicador de atualização */}
        <View className="items-center pb-8">
          <Text className="text-[#999] text-sm dark:text-[#666]">
            Puxe para baixo para atualizar
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
