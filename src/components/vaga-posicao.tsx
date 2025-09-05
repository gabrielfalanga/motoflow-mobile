import type { MotoNaPosicao } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

interface VagaPosicaoProps {
  posicaoVertical: number
  moto?: MotoNaPosicao
  onPress: (posicaoVertical: number, moto?: MotoNaPosicao) => void
}

export function VagaPosicao({
  posicaoVertical,
  moto,
  onPress,
}: VagaPosicaoProps) {
  const getStatusColor = () => {
    if (!moto) return "#939497" // Cinza claro para vazio

    return "#05AF31" // Verde
  }

  const getStatusIcon = () => {
    if (!moto) return "add-circle-outline"

    return "checkmark-circle"
  }

  const getStatusText = () => {
    if (!moto) return "Vazio"

    switch (moto.statusMoto) {
      case "DISPONIVEL":
        return "Disponível"
      default:
        return "Desconhecido"
    }
  }

  const getTipoMotoIcon = () => {
    if (!moto) return null

    switch (moto.tipoMoto) {
      case "MOTTU_E":
        return "flash"
      case "MOTTU_SPORT":
        return "speedometer"
      case "MOTTU_POP":
        return "bicycle"
      default:
        return "bicycle"
    }
  }

  const backgroundColor = getStatusColor()
  const isOccupied = !!moto

  return (
    <TouchableOpacity
      className="relative m-1 min-h-24 min-w-20 rounded-lg p-3 shadow-sm"
      style={{ backgroundColor }}
      onPress={() => onPress(posicaoVertical, moto)}
      activeOpacity={0.8}
    >
      {/* Número da posição */}
      <View className="mb-2 items-center">
        <Text className="font-bold text-white">{posicaoVertical}</Text>
      </View>

      {/* Ícone do status */}
      <View className="items-center">
        <Ionicons
          name={getStatusIcon() as keyof typeof Ionicons.glyphMap}
          size={16}
          color="white"
        />
      </View>

      {/* Ícone do tipo de moto (se ocupada) */}
      {isOccupied && getTipoMotoIcon() && (
        <View className="absolute top-1 right-1">
          <Ionicons
            name={getTipoMotoIcon() as keyof typeof Ionicons.glyphMap}
            size={12}
            color="white"
          />
        </View>
      )}

      {/* Status text */}
      <View className="mt-1 items-center">
        <Text className="text-white text-xs">{getStatusText()}</Text>
      </View>

      {/* Placa (se ocupada) */}
      {isOccupied && (
        <View className="mt-1 items-center">
          <Text className="font-medium text-white text-xs">{moto.placa}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
