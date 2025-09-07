import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"
import type { PosicaoHorizontalPatio } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"

interface PatioPosicoesHorizontaisGridProps {
  posicoes?: PosicaoHorizontalPatio[]
}

export function PatioPosicoesHorizontaisGrid({
  posicoes: posicoesProp,
}: PatioPosicoesHorizontaisGridProps) {
  const [posicoes, setPosicoes] = useState<PosicaoHorizontalPatio[]>(
    posicoesProp || []
  )
  const [loading, setLoading] = useState(false)
  const { token, patioId } = useAuth()

  const fetchPositions = useCallback(async () => {
    if (!token || !patioId) return

    try {
      setLoading(true)
      const response = await request<PosicaoHorizontalPatio[]>(
        `/posicoes/${patioId}`,
        "get",
        null,
        {
          authToken: token,
        }
      )
      setPosicoes(response || [])
    } catch (error) {
      console.log("Erro ao buscar posições:", error)
    } finally {
      setLoading(false)
    }
  }, [token, patioId])

  useEffect(() => {
    if (!posicoesProp) {
      fetchPositions()
    }
  }, [fetchPositions, posicoesProp])

  const handlePositionPress = (posicao: string) => {
    router.navigate(`/posicao-horizontal/${posicao}`)
  }

  if (!posicoes || posicoes.length === 0) {
    return null
  }

  if (loading) {
    return (
      <View className="rounded-xl bg-card p-5 shadow-sm">
        <View className="mb-4 flex-row items-center">
          <Ionicons name="grid-outline" size={20} color="#05AF31" />
          <Text className="ml-2 font-bold text-text">Áreas do Pátio</Text>
        </View>
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#05AF31" />
        </View>
      </View>
    )
  }

  return (
    <View className="mb-6 rounded-xl bg-card p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="grid-outline" size={24} color="#05AF31" />
          <Text className="ml-2 font-semibold text-lg text-text">
            Áreas do Pátio
          </Text>
        </View>
        <View className="rounded-full bg-primary/10 px-3 py-1">
          <Text className="font-medium text-primary text-sm">
            {posicoes.length} {posicoes.length > 1 ? "áreas" : "área"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {posicoes.map(area => {
          return (
            <TouchableOpacity
              key={area.posicaoHorizontal}
              className="min-w-20 rounded-lg bg-primary p-3 shadow-sm"
              onPress={() => handlePositionPress(area.posicaoHorizontal)}
              activeOpacity={0.7}
            >
              <Text className="text-center font-semibold text-white">
                {area.posicaoHorizontal}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
