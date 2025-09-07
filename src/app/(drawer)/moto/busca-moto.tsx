import { useState } from "react"
import { useTheme } from "@/context/theme-context"
import { useAuth } from "@/context/auth-context"
import { request, RequestError } from "@/helper/request"
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

interface MotoEncontrada {
  placa: string
  tipoMoto: "MOTTU_E" | "MOTTU_SPORT" | "MOTTU_POP"
  ano: number
  posicaoVertical: number
  posicaoHorizontal: string
}

export default function BuscaMotoScreen() {
  const { theme } = useTheme()
  const { token } = useAuth()

  // Estados
  const [placa, setPlaca] = useState<string>("")
  const [motoEncontrada, setMotoEncontrada] = useState<MotoEncontrada | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [erroMensagem, setErroMensagem] = useState<string>("")

  const buscarMoto = async () => {
    if (!token) {
      return
    }

    // Validações
    if (!placa.trim()) {
      Alert.alert("Erro", "Digite uma placa para buscar.")
      return
    }

    const placaRegex = /^[A-Z0-9]{7}$/
    if (!placaRegex.test(placa)) {
      Alert.alert(
        "Erro",
        "Digite uma placa válida (7 caracteres, sem espaços ou símbolos)."
      )
      return
    }

    setIsLoading(true)
    setErroMensagem("")
    setMotoEncontrada(null)

    try {
      const response = await request<MotoEncontrada>(
        `/motos/posicao?placa=${placa}`,
        "get",
        null,
        {
          authToken: token,
        }
      )

      if (response) {
        setMotoEncontrada(response)
      } else {
        setErroMensagem("Moto não encontrada com essa placa.")
      }
    } catch (error) {
      console.error("Erro ao buscar moto:", error)

      if (error instanceof RequestError) {
        if (error.statusCode === 404) {
          setErroMensagem("Moto não encontrada com essa placa.")
        } else {
          setErroMensagem(error.message)
        }
      } else {
        setErroMensagem("Erro inesperado ao buscar moto.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const limparBusca = () => {
    setPlaca("")
    setMotoEncontrada(null)
    setErroMensagem("")
  }

  const getTipoMotoIcon = (tipo: string) => {
    switch (tipo) {
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

  const getTipoMotoNome = (tipo: string) => {
    switch (tipo) {
      case "MOTTU_E":
        return "Mottu E (Elétrica)"
      case "MOTTU_SPORT":
        return "Mottu Sport (Esportiva)"
      case "MOTTU_POP":
        return "Mottu Pop (Popular)"
      default:
        return tipo
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1 px-6"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View className="flex-1 py-5">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-center gap-4">
            <Ionicons name="search-outline" size={32} color="#05AF31" />
            <Text className="font-bold text-3xl text-primary">Buscar Moto</Text>
            <Ionicons name="location-outline" size={32} color="#05AF31" />
          </View>

          {/* Form de Busca */}
          <View className="mb-6">
            <Text className="mb-2 ml-1 font-medium text-text">
              Placa da Moto *
            </Text>
            <TextInput
              placeholder="Ex: ABC1234"
              className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
              placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
              value={placa}
              onChangeText={value =>
                setPlaca(
                  value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 7)
                )
              }
              maxLength={7}
              autoCapitalize="characters"
            />
            <Text className="mt-1 ml-1 text-muted text-xs">
              7 caracteres, sem traço ou espaços
            </Text>
          </View>
          {/* Botões */}
          <View className="mb-6 flex-row gap-3">
            <TouchableOpacity
              className={`h-14 flex-1 items-center justify-center rounded-2xl shadow-lg ${
                isLoading ? "bg-gray-400" : "bg-primary"
              }`}
              onPress={buscarMoto}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <View className="flex-row items-center">
                  <Ionicons name="search-outline" size={20} color="#ffffff" />
                  <Text className="ml-2 font-semibold text-lg text-white">
                    Buscar
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="h-14 items-center justify-center rounded-xl bg-blue-600 px-6 shadow-lg"
              onPress={limparBusca}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          {/* Resultado da Busca */}
          <View className="flex-1">
            {/* Erro */}
            {erroMensagem && (
              <View className="mb-4 rounded-xl border border-red-300 bg-red-50 p-4">
                <View className="flex-row items-center">
                  <Ionicons
                    name="alert-circle-outline"
                    size={24}
                    color="#ef4444"
                  />
                  <Text className="ml-3 font-medium text-red-600">
                    Moto não encontrada
                  </Text>
                </View>
                <Text className="mt-2 text-red-500 text-sm">
                  {erroMensagem}
                </Text>
              </View>
            )}

            {/* Moto Encontrada */}
            {motoEncontrada && (
              <View className="rounded-xl border border-secondary bg-card p-6">
                <View className="mb-4 flex-row items-center justify-center">
                  <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                  <Text className="ml-3 font-bold text-green-600 text-xl">
                    Moto Encontrada!
                  </Text>
                </View>

                {/* Detalhes da Moto */}
                <View className="gap-4">
                  {/* Placa */}
                  <View className="flex-row items-center">
                    <Ionicons
                      name="document-text-outline"
                      size={24}
                      color="#05AF31"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="font-medium text-text">Placa</Text>
                      <Text className="font-bold text-lg text-primary">
                        {motoEncontrada.placa}
                      </Text>
                    </View>
                  </View>

                  {/* Tipo */}
                  <View className="flex-row items-center">
                    <Ionicons
                      name={
                        getTipoMotoIcon(
                          motoEncontrada.tipoMoto
                        ) as keyof typeof Ionicons.glyphMap
                      }
                      size={24}
                      color="#05AF31"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="font-medium text-text">Tipo</Text>
                      <Text className="text-muted">
                        {getTipoMotoNome(motoEncontrada.tipoMoto)}
                      </Text>
                    </View>
                  </View>

                  {/* Ano */}
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#05AF31"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="font-medium text-text">Ano</Text>
                      <Text className="text-muted">{motoEncontrada.ano}</Text>
                    </View>
                  </View>

                  {/* Posição */}
                  <View className="flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color="#05AF31"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="font-medium text-text">Posição</Text>
                      <Text className="font-bold text-lg text-primary">
                        {motoEncontrada.posicaoHorizontal}-
                        {motoEncontrada.posicaoVertical}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botão para ir à posição */}
                <TouchableOpacity
                  className="mt-6 h-12 items-center justify-center rounded-xl bg-blue-500"
                  onPress={() =>
                    router.navigate(
                      `/(drawer)/posicao-horizontal/${motoEncontrada.posicaoHorizontal}`
                    )
                  }
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="navigate-outline"
                      size={20}
                      color="#ffffff"
                    />
                    <Text className="ml-2 font-semibold text-white">
                      Ir para a Posição
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Estado inicial */}
            {!motoEncontrada && !erroMensagem && !isLoading && (
              <View className="flex-1 items-center justify-center">
                <Ionicons
                  name="search-circle-outline"
                  size={80}
                  color="#9ca3af"
                />
                <Text className="mt-4 font-semibold text-muted">
                  Digite uma placa para buscar
                </Text>
                <Text className="text-center text-muted text-sm">
                  A busca retornará a localização exata da moto
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
