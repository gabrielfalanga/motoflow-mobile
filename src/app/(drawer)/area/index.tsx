import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"
import type { PosicaoHorizontalPatio } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
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

export default function AreasScreen() {
  const [posicoes, setPosicoes] = useState<PosicaoHorizontalPatio[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { token, patioId } = useAuth()

  const fetchAreas = useCallback(
    async (isRefresh = false) => {
      if (!token || !patioId) return

      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      try {
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
        Alert.alert("Erro", "Não foi possível carregar as áreas")
      } finally {
        setLoading(false)
        if (isRefresh) setRefreshing(false)
      }
    },
    [token, patioId]
  )

  useFocusEffect(
    useCallback(() => {
      if (token && patioId) {
        fetchAreas()
      }
    }, [token, patioId, fetchAreas])
  )

  const handleAreaPress = (area: PosicaoHorizontalPatio) => {
    Alert.alert(
      `Área ${area.posicaoHorizontal}`,
      "Deseja visualizar os detalhes desta área?",
      [
        {
          text: "Sair",
          style: "cancel",
        },
        {
          text: "Ir para a Área",
          onPress: () => {
            router.push(`/posicao-horizontal/${area.posicaoHorizontal}`)
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-text">Carregando áreas...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header fixo */}
      <View className="px-4 pt-6 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-bold text-2xl text-primary">
              Áreas do Pátio
            </Text>
            <Text className="text-muted">
              Toque em uma área para mais informações
            </Text>
          </View>

          {/* Botão de Cadastrar */}
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center rounded-xl bg-primary"
            onPress={() => router.navigate("/area/cadastro-area")}
            activeOpacity={0.8}
          >
            <Ionicons name="add-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ScrollView ocupando o restante do espaço */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAreas(true)}
            colors={["#05AF31"]}
            tintColor="#05AF31"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Grid de Áreas */}
        <View className="gap-3">
          {posicoes.map(area => {
            return (
              <TouchableOpacity
                key={area.posicaoHorizontal}
                className="rounded-xl border border-secondary bg-card p-4"
                onPress={() => handleAreaPress(area)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between">
                  {/* Info da Área */}
                  <View className="flex-1">
                    <Text className="font-bold text-lg text-text">
                      Área {area.posicaoHorizontal}
                    </Text>
                    <Text className="text-muted text-sm">
                      Toque para ver detalhes
                    </Text>
                  </View>

                  {/* Ícone de Navegação */}
                  <View className="items-center">
                    <Ionicons
                      name="location-outline"
                      size={32}
                      color={"#05AF31"}
                    />
                    <Text
                      className="mt-1 font-semibold text-xs"
                      style={{ color: "#05AF31" }}
                    >
                      Ver área
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Estado vazio */}
        {posicoes.length === 0 && (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="add-circle-outline" size={64} color="#05AF31" />
            <Text className="mt-4 font-semibold text-primary">
              Cadastrar Primeira Área
            </Text>
            <Text className="mb-6 text-center text-muted text-sm">
              Ainda não há áreas configuradas neste pátio
            </Text>

            <TouchableOpacity
              className="h-12 items-center justify-center rounded-xl bg-primary px-6"
              onPress={() => router.navigate("/area/cadastro-area")}
              activeOpacity={0.8}
            >
              <Text className="font-semibold text-white">Cadastrar Área</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View className="items-center pt-6">
          <Text className="text-muted text-xs">
            Total de {posicoes.length} área{posicoes.length !== 1 ? "s" : ""}{" "}
            disponível
            {posicoes.length !== 1 ? "s" : ""}
          </Text>
          <Text className="text-muted text-xs">
            Puxe para baixo para atualizar
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
