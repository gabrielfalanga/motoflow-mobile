import { useState } from "react"
import { useTheme } from "@/context/theme-context"
import { useAuth } from "@/context/auth-context"
import {
  Alert,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { SubmitButton } from "@/components/submit-button"
import { request, RequestError } from "@/helper/request"

interface CadastroArea {
  posicaoVerticalMax: number
  posicaoHorizontal: string
  idPatio: number
}

export default function CadastroAreaScreen() {
  const { theme } = useTheme()
  const { patioId, token } = useAuth()

  // Form fields
  const [identificador, setIdentificador] = useState<string>("")
  const [quantidadeVagas, setQuantidadeVagas] = useState<number>()

  // Estado de loading
  const [isLoading, setIsLoading] = useState(false)

  const cadastrar = async () => {
    if (!patioId || !token) {
      return
    }

    // Validações
    if (!identificador.trim()) {
      Alert.alert("Atenção", "Por favor, digite um identificador para a área.")
      return
    }

    if (identificador.length > 3) {
      Alert.alert("Atenção", "O identificador deve ter no máximo 3 caracteres.")
      return
    }

    if (!quantidadeVagas || quantidadeVagas < 1) {
      Alert.alert("Atenção", "A quantidade de vagas deve ser maior que 0.")
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados para envio
      const dadosArea: CadastroArea = {
        posicaoHorizontal: identificador.toUpperCase(),
        posicaoVerticalMax: quantidadeVagas,
        idPatio: patioId,
      }

      console.log("BODY para cadastrar área:", dadosArea)

      await request("/posicoes", "post", dadosArea, {
        authToken: token,
      })

      Alert.alert(
        "Área Cadastrada com Sucesso!",
        `A área ${identificador.toUpperCase()} foi criada com ${quantidadeVagas} vaga${quantidadeVagas > 1 ? "s" : ""}.`,
        [
          {
            text: "Cadastrar Outra Área",
            style: "default",
            onPress: () => {},
          },
          {
            text: "Voltar para Áreas",
            style: "cancel",
            onPress: () => router.push("/area"),
          },
          {
            text: "Ir para a Área",
            style: "default",
            onPress: () => {
              limparFormulario()
              router.setParams({})
              router.replace(
                `/posicao-horizontal/${identificador.toUpperCase()}`
              )
            },
          },
        ]
      )
    } catch (error) {
      console.error("Erro ao cadastrar área:", error)

      let errorMessage = "Ocorreu um erro inesperado ao cadastrar a área."
      let errorTitle = "Erro no Cadastro"

      if (error instanceof RequestError) {
        errorMessage = error.message

        // Personalizar títulos baseado no tipo de erro
        if (error.errorType === "ExceededSpaceException") {
          errorTitle = "Capacidade Excedida"
        } else {
          errorTitle = "Dados Inválidos"
        }
      }

      Alert.alert(errorTitle, errorMessage, [{ text: "OK" }])
    } finally {
      setIsLoading(false)
    }
  }

  const limparFormulario = () => {
    setIdentificador("")
    setQuantidadeVagas(undefined)
  }

  // Renderizar preview das vagas
  const renderPreviewVagas = () => {
    if (!quantidadeVagas || quantidadeVagas < 1) return null

    const vagas = Array.from(
      { length: quantidadeVagas },
      (_, index) => index + 1
    )

    const vagasPorLinha = 6
    const linhas = []

    for (let i = 0; i < vagas.length; i += vagasPorLinha) {
      linhas.push(vagas.slice(i, i + vagasPorLinha))
    }

    return (
      <View className="mt-6">
        <View className="mb-4 flex-row items-center">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Ionicons name="eye-outline" size={16} color="white" />
          </View>
          <Text className="ml-3 font-semibold text-lg text-text">
            Preview da Área
          </Text>
        </View>

        <View className="rounded-2xl bg-card p-5">
          {/* Título da área */}
          <View className="mb-4 items-center">
            <Text className="font-bold text-primary text-xl">
              Área {identificador.toUpperCase() || "?"}
            </Text>
            <Text className="text-muted text-sm">
              {quantidadeVagas} vaga{quantidadeVagas > 1 ? "s" : ""}
            </Text>
          </View>

          {/* Grid de vagas */}
          <View className="gap-3">
            {linhas.map((linha, linhaIndex) => (
              <View
                key={`linha-${linhaIndex + 1}`}
                className="flex-row justify-center gap-2"
              >
                {linha.map(numero => (
                  <View
                    key={numero}
                    className="h-14 w-14 items-center justify-center rounded-xl border border-green-200 bg-green-100"
                  >
                    <Text className="font-bold text-green-700 text-xs">
                      {identificador.toUpperCase() || "?"}
                      {numero}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* Header fixo */}

        <View className="items-center">
          <Text className="font-bold text-2xl text-primary">Nova Área</Text>
          <Text className="text-muted text-sm">
            Configure uma nova área do pátio
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-6">
            {/* Formulário */}
            <View className="gap-2">
              {/* Campo Identificador */}
              <View>
                <Text className="mb-1 ml-1 font-medium text-text">
                  Identificador da Área *
                </Text>

                <TextInput
                  placeholder="Digite o identificador (Ex: A, B, C...)"
                  className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                  placeholderTextColor={
                    theme === "dark" ? "#cccccc" : "#666666"
                  }
                  value={identificador}
                  onChangeText={value => {
                    const cleaned = value
                      .replace(/[^A-Za-z0-9]/g, "")
                      .slice(0, 3)
                    setIdentificador(cleaned.toUpperCase())
                  }}
                  autoCapitalize="characters"
                />
              </View>

              {/* Campo Quantidade de Vagas */}
              <View>
                <Text className="mb-1 ml-1 font-medium text-text">
                  Quantidade de Vagas *
                </Text>

                <TextInput
                  placeholder="Quantas vagas terá esta área?"
                  className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                  placeholderTextColor={
                    theme === "dark" ? "#cccccc" : "#666666"
                  }
                  value={quantidadeVagas?.toString() || ""}
                  onChangeText={value => {
                    const numericValue = value.replace(/[^0-9]/g, "")

                    if (numericValue === "") {
                      setQuantidadeVagas(undefined)
                      return
                    }

                    const num = Number(numericValue)
                    if (num >= 1) {
                      setQuantidadeVagas(num)
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              {/* Dicas */}
              <View className="rounded-2xl bg-card p-4">
                <View className="mb-2 flex-row items-center">
                  <Ionicons name="bulb-outline" size={20} color="#3B82F6" />
                  <Text className="ml-2 font-semibold text-text">Dicas</Text>
                </View>
                <Text className="text-sm text-text leading-5">
                  • Use identificadores simples como A, B, C{"\n"}• Considere a
                  capacidade real do espaço físico{"\n"}• Áreas menores são mais
                  fáceis de gerenciar
                </Text>
              </View>
            </View>

            {/* Preview das Vagas */}
            {renderPreviewVagas()}
          </View>
        </ScrollView>

        {/* Botão fixo na parte inferior */}
        <View className="p-6">
          <SubmitButton
            isLoading={isLoading}
            onSubmit={cadastrar}
            text="Cadastrar Área"
          />

          {!isLoading && (
            <Text className="mt-3 text-center text-muted text-sm">
              Preencha todos os campos obrigatórios para continuar
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
