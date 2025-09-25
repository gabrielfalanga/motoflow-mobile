import { useState } from "react";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import {
  Alert,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SubmitButton } from "@/components/submit-button";
import { request, RequestError } from "@/helper/request";

interface CadastroSetor {
  setor: string;
  capacidadeSetor: number;
}

export default function CadastroSetorScreen() {
  const { theme } = useTheme();
  const { patioId, token } = useAuth();

  // Form fields
  const [setor, setSetor] = useState<string>("");
  const [capacidadeSetor, setCapacidadeSetor] = useState<number>();

  // Estado de loading
  const [isLoading, setIsLoading] = useState(false);

  const cadastrar = async () => {
    if (!patioId || !token) {
      return;
    }

    // Validações
    if (!setor.trim()) {
      Alert.alert("Atenção", "Por favor, digite um identificador para o setor.");
      return;
    }

    if (setor.length > 5) {
      Alert.alert("Atenção", "O identificador deve ter no máximo 5 caracteres.");
      return;
    }

    if (!capacidadeSetor || capacidadeSetor < 1) {
      Alert.alert("Atenção", "A capacidade do setor deve ser maior que 0.");
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para envio
      const dadosSetor: CadastroSetor = {
        setor: setor.toUpperCase(),
        capacidadeSetor: capacidadeSetor,
      };

      await request(`/posicoes/${patioId}`, "post", dadosSetor, {
        authToken: token,
      });

      Alert.alert(
        "Setor Cadastrado com Sucesso!",
        `O setor ${setor.toUpperCase()} foi criado com capacidade para ${capacidadeSetor} moto${
          capacidadeSetor > 1 ? "s" : ""
        }.`,
        [
          {
            text: "Cadastrar Outro Setor",
            style: "default",
            onPress: () => {},
          },
          {
            text: "Voltar para Setores",
            style: "cancel",
            onPress: () => router.push("/setores"),
          },
          {
            text: "Ir para o Setor",
            style: "default",
            onPress: () => {
              router.setParams({});
              router.replace(`/setor/${setor.toUpperCase()}`);
            },
          },
        ]
      );

      limparFormulario();
    } catch (error) {
      console.error("Erro ao cadastrar setor:", error);

      let errorMessage = "Ocorreu um erro inesperado ao cadastrar o setor.";
      let errorTitle = "Erro no Cadastro";

      if (error instanceof RequestError) {
        errorMessage = error.message;

        // Personalizar títulos baseado no tipo de erro
        if (error.errorType === "ExceededSpaceException") {
          errorTitle = "Capacidade Excedida";
        } else {
          errorTitle = "Dados Inválidos";
        }
      }

      Alert.alert(errorTitle, errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const limparFormulario = () => {
    setSetor("");
    setCapacidadeSetor(undefined);
  };

  // Renderizar preview das vagas
  const renderPreviewVagas = () => {
    if (!capacidadeSetor || capacidadeSetor < 1) return null;

    const vagas = Array.from({ length: capacidadeSetor }, (_, index) => index + 1);

    const vagasPorLinha = 6;
    const linhas = [];

    for (let i = 0; i < vagas.length; i += vagasPorLinha) {
      linhas.push(vagas.slice(i, i + vagasPorLinha));
    }

    return (
      <View className="mt-6">
        <View className="mb-4 flex-row items-center">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Ionicons name="eye-outline" size={16} color="white" />
          </View>
          <Text className="ml-3 font-semibold text-lg text-text">Preview do Setor</Text>
        </View>

        <View className="rounded-2xl bg-card p-5">
          {/* Título da área */}
          <View className="mb-4 items-center">
            <Text className="font-bold text-primary text-xl">
              Setor {setor.toUpperCase() || "?"}
            </Text>
            <Text className="text-muted text-sm">
              {capacidadeSetor} vaga{capacidadeSetor > 1 ? "s" : ""}
            </Text>
          </View>

          {/* Grid de vagas */}
          <View className="gap-3">
            {linhas.map((linha, linhaIndex) => (
              <View key={`linha-${linhaIndex + 1}`} className="flex-row justify-center gap-2">
                {linha.map((numero) => (
                  <View
                    key={numero}
                    className="h-14 w-14 items-center justify-center rounded-xl border border-green-200 bg-green-100"
                  >
                    <Text className="font-bold text-green-700 text-xs">
                      {setor.toUpperCase() || "?"}
                      {numero}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* Header fixo */}

        <View className="items-center">
          <Text className="font-bold text-3xl text-primary">Novo Setor</Text>
          <Text className="text-muted text-sm mb-5">Configure um novo setor do pátio</Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-6">
            {/* Formulário */}
            <View className="gap-4">
              {/* Campo Identificador */}
              <View>
                <Text className="mb-1 ml-1 font-medium text-text">Nome do Setor *</Text>

                <TextInput
                  placeholder="Digite o identificador (Ex: A, B, C...)"
                  className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                  placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                  value={setor}
                  onChangeText={(value) => {
                    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 5);
                    setSetor(cleaned.toUpperCase());
                  }}
                  autoCapitalize="characters"
                />
              </View>

              {/* Campo Quantidade de Vagas */}
              <View className="mb-4">
                <Text className="mb-1 ml-1 font-medium text-text">Quantidade de Vagas *</Text>

                <TextInput
                  placeholder="Quantas vagas terá este setor?"
                  className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                  placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                  value={capacidadeSetor?.toString() || ""}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "");

                    if (numericValue === "") {
                      setCapacidadeSetor(undefined);
                      return;
                    }

                    const num = Number(numericValue);
                    if (num >= 1) {
                      setCapacidadeSetor(num);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              {/* Dicas */}
              <View className="rounded-2xl bg-card p-4">
                <View className="mb-2 flex-row items-center">
                  <Ionicons name="bulb-outline" size={20} color="#3B82F6" />
                  <Text className="ml-2 font-semibold text-text">Dicas</Text>
                </View>
                <Text className="text-sm text-text leading-8">
                  • Use identificadores simples e claros{"\n"}• Considere a capacidade real do
                  espaço físico{"\n"}• Setores menores são mais fáceis de gerenciar
                </Text>
              </View>
            </View>

            {/* Preview das Vagas */}
            {renderPreviewVagas()}
          </View>
        </ScrollView>

        {/* Botão fixo na parte inferior */}
        <View className="p-6">
          <SubmitButton isLoading={isLoading} onSubmit={cadastrar} text="Cadastrar Setor" />

          {!isLoading && (
            <Text className="mt-3 text-center text-muted text-sm">
              Preencha todos os campos obrigatórios * para continuar
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
