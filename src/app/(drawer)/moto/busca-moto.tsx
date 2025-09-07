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
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

interface MotoEncontrada {
  placa: string
  tipoMoto: "MOTTU_E" | "MOTTU_SPORT" | "MOTTU_POP"
  ano: number
  posicaoVertical: number | null
  posicaoHorizontal: string | null
}

export default function BuscaMotoScreen() {
  const { theme } = useTheme()
  const { token, patioId } = useAuth()

  // Estados
  const [placa, setPlaca] = useState<string>("")
  const [motoEncontrada, setMotoEncontrada] = useState<MotoEncontrada | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [erroMensagem, setErroMensagem] = useState<string>("")

  // Estados do modal de alocação
  const [modalAlocacaoVisible, setModalAlocacaoVisible] = useState(false)
  const [posicaoHorizontalInput, setPosicaoHorizontalInput] = useState("")
  const [posicaoVerticalInput, setPosicaoVerticalInput] = useState("")
  const [isAlocando, setIsAlocando] = useState(false)

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
    setModalAlocacaoVisible(false)
    setPosicaoHorizontalInput("")
    setPosicaoVerticalInput("")
  }

  const abrirModalAlocacao = () => {
    setModalAlocacaoVisible(true)
    setPosicaoHorizontalInput("")
    setPosicaoVerticalInput("")
  }

  const fecharModalAlocacao = () => {
    setModalAlocacaoVisible(false)
    setPosicaoHorizontalInput("")
    setPosicaoVerticalInput("")
  }

  const alocarMoto = async () => {
    if (!motoEncontrada || !token || !patioId) return

    // Validações
    if (!posicaoHorizontalInput.trim()) {
      Alert.alert("Erro", "Digite a posição horizontal (área).")
      return
    }

    if (!posicaoVerticalInput.trim()) {
      Alert.alert("Erro", "Digite a posição vertical.")
      return
    }

    const posicaoVerticalNum = Number.parseInt(posicaoVerticalInput, 10)
    if (Number.isNaN(posicaoVerticalNum) || posicaoVerticalNum <= 0) {
      Alert.alert("Erro", "Digite um número válido para a posição vertical.")
      return
    }

    setIsAlocando(true)

    try {
      const body = {
        placa: motoEncontrada.placa,
        posicaoHorizontal: posicaoHorizontalInput.toUpperCase(),
        posicaoVertical: posicaoVerticalNum,
      }

      await request(`/motos/alocacao/${patioId}`, "put", body, {
        authToken: token,
      })

      Alert.alert("Sucesso", "Moto alocada com sucesso!")
      fecharModalAlocacao()

      setMotoEncontrada({
        ...motoEncontrada,
        posicaoHorizontal: posicaoHorizontalInput.toUpperCase(),
        posicaoVertical: posicaoVerticalNum,
      })
    } catch (error) {
      let errorMessage =
        "Ocorreu um erro inesperado ao alocar a moto na posição."
      const errorTitle = "Erro na Alocação"

      if (error instanceof RequestError) {
        errorMessage = error.message
      }

      Alert.alert(errorTitle, errorMessage, [{ text: "OK" }])
    } finally {
      setIsAlocando(false)
    }
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
                      {motoEncontrada.posicaoHorizontal &&
                      motoEncontrada.posicaoVertical ? (
                        <Text className="font-bold text-lg text-primary">
                          {motoEncontrada.posicaoHorizontal}-
                          {motoEncontrada.posicaoVertical}
                        </Text>
                      ) : (
                        <View>
                          <Text className="font-medium text-orange-600 text-sm">
                            Moto não alocada
                          </Text>
                          <Text className="text-muted text-xs">
                            Clique em "Alocar Posição" para definir uma posição
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Botão para ir à posição ou alocar */}
                {motoEncontrada.posicaoHorizontal &&
                motoEncontrada.posicaoVertical ? (
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
                ) : (
                  <TouchableOpacity
                    className="mt-6 h-12 items-center justify-center rounded-xl bg-orange-500"
                    onPress={abrirModalAlocacao}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="#ffffff"
                      />
                      <Text className="ml-2 font-semibold text-white">
                        Alocar Posição
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
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

      {/* Modal de Alocação */}
      <Modal
        visible={modalAlocacaoVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={fecharModalAlocacao}
      >
        <View className="flex-1 justify-center bg-black/50 px-6">
          <View className="rounded-xl bg-card p-6 shadow-lg">
            <View className="mb-4 flex-row items-center justify-center">
              <Ionicons name="location" size={32} color="#05AF31" />
              <Text className="ml-3 font-bold text-text text-xl">
                Alocar Posição
              </Text>
            </View>

            <Text className="mb-4 text-center text-muted">
              Define a posição da moto{" "}
              <Text className="font-bold text-primary">
                {motoEncontrada?.placa}
              </Text>
            </Text>

            {/* Input Posição Horizontal */}
            <View className="mb-4">
              <Text className="mb-2 font-medium text-text">
                Posição Horizontal (Área) *
              </Text>
              <TextInput
                placeholder="Ex: A, B, C..."
                className="h-12 w-full rounded-xl border border-secondary bg-background px-4 text-text"
                placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                value={posicaoHorizontalInput}
                onChangeText={setPosicaoHorizontalInput}
                autoCapitalize="characters"
                maxLength={3}
              />
            </View>

            {/* Input Posição Vertical */}
            <View className="mb-6">
              <Text className="mb-2 font-medium text-text">
                Posição Vertical *
              </Text>
              <TextInput
                placeholder="Ex: 1, 2, 3..."
                className="h-12 w-full rounded-xl border border-secondary bg-background px-4 text-text"
                placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                value={posicaoVerticalInput}
                onChangeText={setPosicaoVerticalInput}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="h-12 flex-1 items-center justify-center rounded-xl bg-gray-500"
                onPress={fecharModalAlocacao}
                activeOpacity={0.8}
                disabled={isAlocando}
              >
                <Text className="font-semibold text-white">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`h-12 flex-1 items-center justify-center rounded-xl ${
                  isAlocando ? "bg-gray-400" : "bg-primary"
                }`}
                onPress={alocarMoto}
                activeOpacity={0.8}
                disabled={isAlocando}
              >
                {isAlocando ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="font-semibold text-white">Alocar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
