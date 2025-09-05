import { MotoDetailsModal } from "@/components/moto-details-modal"
import { NotificationCard } from "@/components/notification-card"
import { VagaPosicao } from "@/components/vaga-posicao"
import { usePosicaoHorizontalData } from "@/hooks/use-posicao-horizontal-data"
import type { MotoNaPosicao } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function PosicaoHorizontalScreen() {
  const { posicaoHorizontal } = useLocalSearchParams<{
    posicaoHorizontal: string
  }>()

  if (!posicaoHorizontal) {
    router.back()
  }

  const {
    data,
    loading,
    refreshing,
    error,
    refresh,
    getMotoPorPosicao,
    getEstatisticas,
  } = usePosicaoHorizontalData(posicaoHorizontal)

  const [selectedMoto, setSelectedMoto] = useState<MotoNaPosicao | undefined>()
  const [selectedPosition, setSelectedPosition] = useState<number | undefined>()
  const [modalVisible, setModalVisible] = useState(false)

  const handleVagaPress = (posicaoVertical: number, moto?: MotoNaPosicao) => {
    setSelectedMoto(moto)
    setSelectedPosition(posicaoVertical)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedMoto(undefined)
    setSelectedPosition(undefined)
  }

  const renderVagas = () => {
    if (!data) return null

    const vagas = []
    for (let i = 1; i <= data.vagasTotais; i++) {
      const moto = getMotoPorPosicao(i)
      vagas.push(
        <VagaPosicao
          key={i}
          posicaoVertical={i}
          moto={moto}
          onPress={handleVagaPress}
        />
      )
    }

    return vagas
  }

  const stats = getEstatisticas()

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-text">
          Carregando posições da fileira {posicaoHorizontal}...
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#05AF31"]}
            tintColor="#05AF31"
          />
        }
      >
        {/* Header */}
        <View className="mt-4 mb-6">
          <View className="mb-3 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 rounded-full bg-card p-2"
            >
              <Ionicons name="arrow-back" size={24} color="#05AF31" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-bold text-2xl text-primary">
                Fileira {posicaoHorizontal}
              </Text>
              <Text className="text-muted">
                {stats.ocupadas} de {stats.vagas} vagas ocupadas
              </Text>
            </View>
          </View>
        </View>

        {/* Error */}
        {error && (
          <View className="mb-4">
            <NotificationCard title="Erro" message={error} type="error" />
          </View>
        )}

        {/* Estatísticas */}
        {data && (
          <View className="mb-6">
            <Text className="mb-4 font-bold text-lg text-text">Resumo</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-xl bg-primary p-4">
                <View className="mb-2 flex-row items-center justify-between">
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text className="font-bold text-white text-xl">
                    {stats.disponiveis}
                  </Text>
                </View>
                <Text className="font-medium text-white/90">Disponíveis</Text>
              </View>

              <View className="flex-1 rounded-xl bg-blue-500 p-4">
                <View className="mb-2 flex-row items-center justify-between">
                  <Ionicons name="analytics" size={20} color="white" />
                  <Text className="font-bold text-white text-xl">
                    {stats.taxaOcupacao}%
                  </Text>
                </View>
                <Text className="font-medium text-white/90">Ocupação</Text>
              </View>
            </View>
          </View>
        )}

        {/* Legenda */}
        <View className="mb-6 rounded-xl bg-card p-4">
          <Text className="mb-3 font-bold text-text">Legenda</Text>
          <View className="gap-2">
            <View className="flex-row items-center">
              <View className="mr-3 size-4 rounded bg-primary" />
              <Text className="text-muted">Disponível</Text>
            </View>
            <View className="flex-row items-center">
              <View className="mr-3 size-4 rounded bg-gray-300" />
              <Text className="text-muted">Vaga vazia</Text>
            </View>
          </View>
        </View>

        {/* Grid de Vagas */}
        <View className="mb-6">
          <Text className="mb-4 font-bold text-lg text-text">
            Mapa da Fileira {posicaoHorizontal}
          </Text>
          <View className="rounded-xl bg-card p-4">
            <View className="flex-row flex-wrap justify-center">
              {renderVagas()}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-muted text-sm">
            Toque em uma vaga para ver detalhes
          </Text>
          <Text className="text-muted text-xs">
            Última atualização: {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>

      {/* Modal de Detalhes */}
      <MotoDetailsModal
        visible={modalVisible}
        moto={selectedMoto}
        posicaoVertical={selectedPosition}
        posicaoHorizontal={posicaoHorizontal}
        onClose={closeModal}
      />
    </SafeAreaView>
  )
}
