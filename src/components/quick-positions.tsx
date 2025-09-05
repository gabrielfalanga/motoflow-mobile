import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"
import { Ionicons } from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

interface PosicaoPatio {
  posicaoHorizontal: string
}

export function QuickPositions() {
  const [posicoes, setPosicoes] = useState<PosicaoPatio[]>([])
  const [loading, setLoading] = useState(true)
  const { token, patioId } = useAuth()

  const fetchPositions = useCallback(async () => {
    if (!token || !patioId) return

    try {
      const response = await request<PosicaoPatio[]>(
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
    fetchPositions()
  }, [fetchPositions])

  const handlePositionPress = (posicao: string) => {
    Alert.alert(
      "Posição Selecionada",
      `Posição: ${posicao}\n\nO que você gostaria de fazer?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Ver Detalhes", onPress: () => console.log("Ver detalhes") },
        {
          text: "Marcar/Desmarcar",
          onPress: () => console.log("Toggle ocupação"),
        },
      ]
    )
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
    <View className="rounded-xl bg-card p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="grid-outline" size={20} color="#05AF31" />
          <Text className="ml-2 font-bold text-text">Áreas do Pátio</Text>
        </View>
        <Text className="text-muted text-xs">{posicoes.length} posições</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-2"
        contentContainerStyle={{ gap: 8 }}
      >
        {posicoes.map(posicao => (
          <TouchableOpacity
            key={posicao.posicaoHorizontal}
            className="rounded-lg bg-primary px-4 py-3 shadow-sm"
            onPress={() => handlePositionPress(posicao.posicaoHorizontal)}
            activeOpacity={0.7}
          >
            <Text className="text-center font-semibold text-white">
              {posicao.posicaoHorizontal}
            </Text>
            <View className="mt-1 items-center">
              <Ionicons name="checkmark-circle" size={12} color="white" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="mt-3 flex-row items-center justify-center">
        <Ionicons name="information-circle-outline" size={12} color="#666" />
        <Text className="ml-1 text-muted text-xs">Toque para ver opções</Text>
      </View>
    </View>
  )
}
