import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

interface PatioSummaryProps {
  ocupadas: number
  capacidadeMax: number
  disponiveis: number
  apelido?: string
}

export function PatioSummary({
  ocupadas,
  capacidadeMax,
  disponiveis,
  apelido,
}: PatioSummaryProps) {
  const calculateOccupancyPercentage = () => {
    if (capacidadeMax === 0) return 0
    return Math.round((ocupadas / capacidadeMax) * 100)
  }

  const getOccupancyStatus = () => {
    const percentage = calculateOccupancyPercentage()
    if (percentage >= 90) return { status: "Crítico", color: "#ef4444" }
    if (percentage >= 70) return { status: "Alto", color: "#f59e0b" }
    if (percentage >= 40) return { status: "Médio", color: "#05AF31" }
    return { status: "Baixo", color: "#05AF31" }
  }

  const occupancyData = getOccupancyStatus()

  return (
    <View className="rounded-xl bg-card p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-lg text-text">Status do Pátio</Text>
          {apelido && <Text className="text-muted text-sm">{apelido}</Text>}
        </View>
        <Ionicons name="analytics-outline" size={24} color="#05AF31" />
      </View>

      <View className="mb-4 flex-row items-end justify-between">
        <View>
          <Text className="font-bold text-3xl text-primary">{ocupadas}</Text>
          <Text className="text-muted">de {capacidadeMax} posições</Text>
        </View>

        <View className="items-end">
          <Text
            className="font-bold text-2xl"
            style={{ color: occupancyData.color }}
          >
            {calculateOccupancyPercentage()}%
          </Text>
          <Text className="text-muted">{occupancyData.status}</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-lg bg-primary/10 p-3">
          <View className="mb-1 flex-row items-center">
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#05AF31"
            />
            <Text className="ml-1 font-bold text-primary">{disponiveis}</Text>
          </View>
          <Text className="text-muted text-xs">Livres</Text>
        </View>

        <View className="flex-1 rounded-lg bg-blue-500/10 p-3">
          <View className="mb-1 flex-row items-center">
            <Ionicons name="bicycle-outline" size={16} color="#3b82f6" />
            <Text className="ml-1 font-bold text-blue-600">{ocupadas}</Text>
          </View>
          <Text className="text-muted text-xs">Ocupadas</Text>
        </View>
      </View>
    </View>
  )
}
