import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

interface StatCardProps {
  title: string
  value: number
  icon: keyof typeof Ionicons.glyphMap
  color: string
  subtitle?: string
}

export function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <View
      className="flex-1 rounded-xl p-4 shadow-sm"
      style={{ backgroundColor: color }}
    >
      <View className="mb-2 flex-row items-center justify-between">
        <Ionicons name={icon} size={24} color="white" />
        <Text className="font-bold text-2xl text-white">{value}</Text>
      </View>
      <Text className="font-medium text-white/90">{title}</Text>
      {subtitle && <Text className="text-white/70 text-xs">{subtitle}</Text>}
    </View>
  )
}

interface PatioStatsCardsProps {
  posicoesDisponiveis: number
  posicoesOcupadas: number
}

export function PatioStatsCards({
  posicoesDisponiveis,
  posicoesOcupadas,
}: PatioStatsCardsProps) {
  return (
    <View className="flex-row gap-4">
      <StatCard
        title="Posições Livres"
        value={posicoesDisponiveis}
        icon="checkmark-circle-outline"
        color="#05AF31"
        subtitle="Disponíveis agora"
      />
      <StatCard
        title="Motos no Pátio"
        value={posicoesOcupadas}
        icon="bicycle-outline"
        color="#1e40af"
        subtitle="Em uso"
      />
    </View>
  )
}
