import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

interface QuickActionCardProps {
  title: string
  subtitle: string
  iconName: keyof typeof Ionicons.glyphMap
  route: string
  color?: string
  disabled?: boolean
}

export function QuickActionCard({
  title,
  subtitle,
  iconName,
  route,
  color = "#05AF31",
  disabled = false,
}: QuickActionCardProps) {
  const handlePress = () => {
    if (!disabled) {
      router.push(route as `/${string}`)
    }
  }

  return (
    <TouchableOpacity
      className={`flex-1 rounded-xl p-4 shadow-sm ${
        disabled ? "opacity-50" : ""
      }`}
      style={{ backgroundColor: color }}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Ionicons name={iconName} size={24} color="white" />
        {disabled && <Ionicons name="lock-closed" size={16} color="white" />}
      </View>
      <Text className="mb-1 font-bold text-white">{title}</Text>
      <Text className="text-sm text-white/80">{subtitle}</Text>
    </TouchableOpacity>
  )
}
