import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

interface NotificationCardProps {
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  onPress?: () => void
  onDismiss?: () => void
}

export function NotificationCard({
  title,
  message,
  type,
  onPress,
  onDismiss,
}: NotificationCardProps) {
  const getColorScheme = () => {
    switch (type) {
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-700",
          text: "text-blue-800 dark:text-blue-200",
          icon: "information-circle" as keyof typeof Ionicons.glyphMap,
          iconColor: "#3b82f6",
        }
      case "warning":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-700",
          text: "text-amber-800 dark:text-amber-200",
          icon: "warning" as keyof typeof Ionicons.glyphMap,
          iconColor: "#f59e0b",
        }
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-700",
          text: "text-green-800 dark:text-green-200",
          icon: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
          iconColor: "#05AF31",
        }
      case "error":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-700",
          text: "text-red-800 dark:text-red-200",
          icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
          iconColor: "#ef4444",
        }
    }
  }

  const colors = getColorScheme()

  return (
    <TouchableOpacity
      className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}
    >
      <View className="flex-row items-start">
        <Ionicons name={colors.icon} size={20} color={colors.iconColor} />
        <View className="ml-3 flex-1">
          <Text className={`font-semibold ${colors.text}`}>{title}</Text>
          <Text className={`mt-1 text-sm ${colors.text}`}>{message}</Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} className="ml-2">
            <Ionicons name="close" size={16} color={colors.iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}
