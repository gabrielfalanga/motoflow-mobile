import type { MotoNaPosicao } from "@/interfaces/interfaces"
import { useAuth } from "@/context/auth-context"
import { request, RequestError } from "@/helper/request"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native"

interface MotoDetailsModalProps {
  visible: boolean
  moto?: MotoNaPosicao
  posicaoVertical?: number
  posicaoHorizontal?: string
  onClose: () => void
  onMotoUpdated?: () => void
}

export function MotoDetailsModal({
  visible,
  moto,
  posicaoVertical,
  posicaoHorizontal,
  onClose,
  onMotoUpdated,
}: MotoDetailsModalProps) {
  const { token } = useAuth()
  const [isLoadingManutencao, setIsLoadingManutencao] = useState(false)
  const [isLoadingAluguel, setIsLoadingAluguel] = useState(false)
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

  const levarParaManutencao = async () => {
    if (!moto?.placa || !token) {
      Alert.alert("Erro", "Dados da moto não encontrados.")
      return
    }

    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja levar esta moto para manutenção?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            setIsLoadingManutencao(true)

            try {
              await request(
                `/motos/${moto.placa}`,
                "patch",
                { status: "MANUTENCAO" },
                { authToken: token }
              )

              Alert.alert(
                "Sucesso",
                "Moto enviada para manutenção com sucesso!"
              )
              onClose()

              // Atualizar a página
              if (onMotoUpdated) {
                onMotoUpdated()
              }
            } catch (error) {
              console.error("Erro ao enviar moto para manutenção:", error)

              if (error instanceof RequestError) {
                Alert.alert("Erro", error.message)
              } else {
                Alert.alert(
                  "Erro",
                  "Erro inesperado ao enviar moto para manutenção."
                )
              }
            } finally {
              setIsLoadingManutencao(false)
            }
          },
        },
      ]
    )
  }

  const marcarComoAlugada = async () => {
    if (!moto?.placa || !token) {
      Alert.alert("Erro", "Dados da moto não encontrados.")
      return
    }

    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja marcar esta moto como alugada?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: async () => {
            setIsLoadingAluguel(true)

            try {
              await request(
                `/motos/${moto.placa}`,
                "patch",
                { status: "ALUGADA" },
                { authToken: token }
              )

              Alert.alert("Sucesso", "Moto marcada como alugada com sucesso!")
              onClose()

              // Atualizar a página
              if (onMotoUpdated) {
                onMotoUpdated()
              }
            } catch (error) {
              console.error("Erro ao marcar moto como alugada:", error)

              if (error instanceof RequestError) {
                Alert.alert("Erro", error.message)
              } else {
                Alert.alert(
                  "Erro",
                  "Erro inesperado ao marcar moto como alugada."
                )
              }
            } finally {
              setIsLoadingAluguel(false)
            }
          },
        },
      ]
    )
  }

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
                </View>

                <TouchableOpacity
                  className="mt-2 rounded-xl bg-amber-500 p-4"
                  onPress={levarParaManutencao}
                  disabled={isLoadingManutencao || isLoadingAluguel}
                >
                  {isLoadingManutencao ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator color="#ffffff" size="small" />
                      <Text className="ml-2 text-center font-semibold text-white">
                        Enviando...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-center font-semibold text-white">
                      Levar para Manutenção
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-2 rounded-xl bg-blue-500 p-4"
                  onPress={marcarComoAlugada}
                  disabled={isLoadingAluguel || isLoadingManutencao}
                >
                  {isLoadingAluguel ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator color="#ffffff" size="small" />
                      <Text className="ml-2 text-center font-semibold text-white">
                        Processando...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-center font-semibold text-white">
                      Moto Alugada
                    </Text>
                  )}
                </TouchableOpacity>
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

                <TouchableOpacity
                  className="mt-6 rounded-xl bg-primary p-4"
                  onPress={() => {
                    onClose()
                    router.push({
                      pathname: "/moto/cadastro-moto",
                      params: { posicaoHorizontal, posicaoVertical },
                    })
                  }}
                >
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
