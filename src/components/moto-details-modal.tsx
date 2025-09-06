import type { MotoNaPosicao } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"

interface MotoDetailsModalProps {
  visible: boolean
  moto?: MotoNaPosicao
  posicaoVertical?: number
  posicaoHorizontal?: string
  onClose: () => void
}

export function MotoDetailsModal({
  visible,
  moto,
  posicaoVertical,
  posicaoHorizontal,
  onClose,
}: MotoDetailsModalProps) {
  const getStatusColor = () => {
    if (!moto) return "#6b7280"

    switch (moto.statusMoto) {
      case "DISPONIVEL":
        return "#05AF31"
      default:
        return "#6b7280"
    }
  }

  const getTipoMotoInfo = () => {
    if (!moto)
      return { name: "Vazia", icon: "add-circle-outline", color: "#6b7280" }

    switch (moto.tipoMoto) {
      case "MOTTU_E":
        return { name: "Mottu E", icon: "flash", color: "#3b82f6" }
      case "MOTTU_SPORT":
        return { name: "Mottu Sport", icon: "speedometer", color: "#ef4444" }
      case "MOTTU_POP":
        return { name: "Mottu Pop", icon: "bicycle", color: "#8b5cf6" }
      default:
        return { name: "Desconhecido", icon: "help-circle", color: "#6b7280" }
    }
  }

  const tipoMotoInfo = getTipoMotoInfo()
  const statusColor = getStatusColor()

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="mx-4 w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-bold text-text text-xl">
              Posição {posicaoHorizontal}
              {posicaoVertical}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {moto ? (
              <View className="gap-4">
                {/* Status Badge */}
                <View className="items-center">
                  <View
                    className="rounded-full px-4 py-2"
                    style={{ backgroundColor: statusColor }}
                  >
                    <Text className="font-semibold text-white">
                      {moto.statusMoto}
                    </Text>
                  </View>
                </View>

                {/* Tipo de Moto */}
                <View className="rounded-xl bg-background p-4">
                  <View className="mb-2 flex-row items-center">
                    <Ionicons
                      name={tipoMotoInfo.icon as keyof typeof Ionicons.glyphMap}
                      size={24}
                      color={tipoMotoInfo.color}
                    />
                    <Text className="ml-2 font-bold text-lg text-text">
                      {tipoMotoInfo.name}
                    </Text>
                  </View>
                </View>

                {/* Detalhes da Moto */}
                <View className="gap-3">
                  <View className="flex-row items-center justify-between rounded-lg bg-background p-3">
                    <View className="flex-row items-center">
                      <Ionicons name="card-outline" size={16} color="#666" />
                      <Text className="ml-2 text-muted">Placa</Text>
                    </View>
                    <Text className="font-semibold text-text">
                      {moto.placa}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between rounded-lg bg-background p-3">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color="#666"
                      />
                      <Text className="ml-2 text-muted">Ano</Text>
                    </View>
                    <Text className="font-semibold text-text">{moto.ano}</Text>
                  </View>

                  <View className="flex-row items-center justify-between rounded-lg bg-background p-3">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#666"
                      />
                      <Text className="ml-2 text-muted">Posição</Text>
                    </View>
                    <Text className="font-semibold text-text">
                      {moto.posicaoHorizontal}
                      {moto.posicaoVertical}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between rounded-lg bg-background p-3">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="pricetag-outline"
                        size={16}
                        color="#666"
                      />
                      <Text className="ml-2 text-muted">ID</Text>
                    </View>
                    <Text className="font-semibold text-text">#{moto.id}</Text>
                  </View>
                </View>

                {/* Ações */}
                <View className="mt-4 gap-3">
                  {moto.statusMoto === "DISPONIVEL" && (
                    <TouchableOpacity className="rounded-xl bg-primary p-4">
                      <Text className="text-center font-semibold text-white">
                        Marcar como Alugada
                      </Text>
                    </TouchableOpacity>
                  )}

                  {moto.statusMoto === "ALUGADA" && (
                    <TouchableOpacity className="rounded-xl bg-blue-500 p-4">
                      <Text className="text-center font-semibold text-white">
                        Finalizar Aluguel
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity className="rounded-xl bg-amber-500 p-4">
                    <Text className="text-center font-semibold text-white">
                      Marcar Manutenção
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="items-center py-8">
                <Ionicons name="add-circle-outline" size={64} color="#6b7280" />
                <Text className="mt-4 font-bold text-lg text-text">
                  Posição Vazia
                </Text>
                <Text className="text-muted">
                  Nenhuma moto estacionada nesta posição
                </Text>

                <TouchableOpacity className="mt-6 rounded-xl bg-primary p-4" onPress={() => {
                  router.navigate(`/(drawer)/moto/cadastro-moto?posicaoHorizontal=${posicaoHorizontal}&posicaoVertical=${posicaoVertical}`)}}>
                  <Text className="text-center font-semibold text-white">
                    Adicionar Moto
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
