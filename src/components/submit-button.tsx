import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SubmitButtonProps {
  isLoading: boolean
  onSubmit: () => Promise<void>
  text: string
}

export function SubmitButton({ isLoading, onSubmit, text }: SubmitButtonProps) {
  return (
    <TouchableOpacity
      className={`h-14 w-full items-center justify-center rounded-2xl shadow-lg ${
        isLoading ? "bg-gray-400" : "bg-primary"
      }`}
      onPress={onSubmit}
      activeOpacity={0.8}
      disabled={isLoading}
    >
      {isLoading ? (
        <View className="flex-row items-center">
          <ActivityIndicator color="#ffffff" size="small" />
          <Text className="ml-3 font-semibold text-lg text-white">
            Cadastrando...
          </Text>
        </View>
      ) : (
        <View className="flex-row items-center">
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text className="ml-2 font-semibold text-lg text-white">{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
