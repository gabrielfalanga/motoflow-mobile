import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

interface PatioDetailsCardProps {
  capacidadeMax: number
  area: number
  cep?: string
  occupancyPercentage: number
}

export function PatioDetailsCard({
  capacidadeMax,
  area,
  cep,
  occupancyPercentage,
}: PatioDetailsCardProps) {
  const details = [
    {
      label: "Capacidade Total",
      value: `${capacidadeMax} posições`,
      icon: "resize-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Área do Pátio",
      value: `${area} m²`,
      icon: "square-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "CEP",
      value: cep || "N/A",
      icon: "map-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: "Taxa de Ocupação",
      value: `${occupancyPercentage}%`,
      icon: "analytics-outline" as keyof typeof Ionicons.glyphMap,
    },
  ]

  return (
    <View className="mb-6 rounded-xl bg-card p-5 shadow-sm">
      <View className="mb-4 flex-row items-center">
        <Ionicons name="information-circle-outline" size={24} color="#05AF31" />
        <Text className="ml-2 font-semibold text-lg text-text">
          Detalhes do Pátio
        </Text>
      </View>

      <View className="gap-4">
        {details.map(detail => (
          <View
            key={detail.label}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name={detail.icon} size={16} color="#666" />
              <Text className="ml-2 text-muted">{detail.label}</Text>
            </View>
            <Text className="font-semibold text-text">{detail.value}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
