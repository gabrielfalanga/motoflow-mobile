import { Image } from "expo-image"
import { useEffect, useState } from "react"
import { useTheme } from "@/context/theme-context"
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFocusEffect, useGlobalSearchParams } from "expo-router"
import { useCallback } from "react"

export default function CadastroMotoScreen() {
  const { theme } = useTheme()
  const params = useGlobalSearchParams<{
    posicaoHorizontal?: string
    posicaoVertical?: string
  }>()

  const [posicaoHorizontalAtiva, setPosicaoHorizontalAtiva] = useState<string | null>(null)
  const [posicaoVerticalAtiva, setPosicaoVerticalAtiva] = useState<number | null>(null)

  useFocusEffect(
    useCallback(() => {
      const hasPositionParams = params.posicaoHorizontal || params.posicaoVertical
      
      if (hasPositionParams) {
        setPosicaoHorizontalAtiva(params.posicaoHorizontal || null)
        setPosicaoVerticalAtiva(params.posicaoVertical ? Number(params.posicaoVertical) : null)
        setAlocarPosicao(true)
      } else {
        setPosicaoHorizontalAtiva(null)
        setPosicaoVerticalAtiva(null)
      }
    }, [params.posicaoHorizontal, params.posicaoVertical])
  )
  
  useEffect(() => {
    console.log("Parâmetros ativos:")
    console.log("posicaoHorizontalAtiva:", posicaoHorizontalAtiva)
    console.log("posicaoVerticalAtiva:", posicaoVerticalAtiva)
  }, [posicaoHorizontalAtiva, posicaoVerticalAtiva])

  // dropdown tipo de moto
  const [open, setOpen] = useState(false)
  const [tipoMoto, setTipoMoto] = useState<string | null>(null)
  const [opcoes, setOpcoes] = useState([
    { label: "Mottu E", value: "MOTTU_E" },
    { label: "Mottu Sport", value: "MOTTU_SPORT" },
    { label: "Mottu Pop", value: "MOTTU_POP" },
  ])
  
  // form fields
  const [ano, setAno] = useState<number>()
  const [placa, setPlaca] = useState<string>()
  
  // switch para alocar posição (só ativo se tiver posição)
  const [alocarPosicao, setAlocarPosicao] = useState(false)

  const cadastrar = () => {
    const anoAtual = new Date().getFullYear()
    const anoMaximo = anoAtual + 1

    // Validações
    if (!tipoMoto) {
      Alert.alert("Erro", "Selecione o tipo da moto.")
      return
    }

    if (
      !ano ||
      isNaN(ano) ||
      ano.toString().length !== 4 ||
      ano < 1950 ||
      ano > anoMaximo
    ) {
      Alert.alert("Erro", "Digite um ano válido.")
      return
    }

    const placaRegex = /^[A-Z0-9]{7}$/
    if (!placa || !placaRegex.test(placa)) {
      Alert.alert("Erro", "Digite uma placa válida (sem espaços ou símbolos).")
      return
    }

    const bodyBase = {
      tipoMoto: tipoMoto,
      ano: ano,
      placa: placa,
      statusMoto: "DISPONIVEL",
    }

    if (alocarPosicao && posicaoHorizontalAtiva && posicaoVerticalAtiva) {
      const bodyComPosicao = {
        ...bodyBase,
        posicaoHorizontal: posicaoHorizontalAtiva,
        posicaoVertical: posicaoVerticalAtiva,
      }
      
      console.log("CASO: Cadastrar e alocar em posição específica")
      console.log("BODY:", bodyComPosicao)

      Alert.alert(
        "Moto cadastrada e alocada!",
        `Tipo: ${tipoMoto}\nAno: ${ano}\nPlaca: ${placa}\nPosição: ${posicaoHorizontalAtiva}-${posicaoVerticalAtiva}`,
        [{ text: "OK", onPress: limparFormulario }]
      )
    } else {
      console.log("CASO: Apenas cadastrar moto")
      console.log("BODY:", bodyBase)

      Alert.alert(
        "Moto cadastrada!",
        `Tipo: ${tipoMoto}\nAno: ${ano}\nPlaca: ${placa}`,
        [{ text: "OK", onPress: limparFormulario }]
      )
    }
  }

  const limparFormulario = () => {
    setTipoMoto(null)
    setAno(undefined)
    setPlaca(undefined)
    setAlocarPosicao(false)
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
            <View className="flex-row items-center justify-center gap-4 mb-6">
              <Image
                source={require("@/assets/moto-esquerda.png")}
                style={{ width: 32, height: 32 }}
              />
              <Text className="font-bold text-primary text-3xl">
                Cadastre a moto
              </Text>
              <Image
                source={require("@/assets/moto-direita.png")}
                style={{ width: 32, height: 32 }}
              />
            </View>

          {/* Form */}
          <View className="space-y-6 flex-1">
            {/* Dropdown Tipo de Moto */}
            <View>
              <Text className="text-text font-medium mb-2 ml-1">
                Tipo da Moto *
              </Text>
              <DropDownPicker
                open={open}
                value={tipoMoto}
                items={opcoes}
                setOpen={setOpen}
                setValue={setTipoMoto}
                setItems={setOpcoes}
                placeholder="Selecione o tipo da moto"
                style={[
                  styles.dropdown,
                  theme === "dark" && { backgroundColor: "#222222" },
                ]}
                dropDownContainerStyle={[
                  styles.opcoesDropdown,
                  theme === "dark" && { backgroundColor: "#222222" },
                ]}
                textStyle={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
                placeholderStyle={{
                  color: theme === "dark" ? "#cccccc" : "#666666",
                }}
              />
            </View>

            {/* Campo Ano */}
            <View>
              <Text className="text-text font-medium mb-2 ml-1">
                Ano *
              </Text>
              <TextInput
                placeholder="Ex: 2024"
                className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                value={ano?.toString()}
                onChangeText={value => setAno(value ? Number(value) : undefined)}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            {/* Campo Placa */}
            <View>
              <Text className="text-text font-medium mb-2 ml-1">
                Placa *
              </Text>
              <TextInput
                placeholder="Ex: ABC1234"
                className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                value={placa}
                onChangeText={value => setPlaca(value.toUpperCase())}
                maxLength={7}
                autoCapitalize="characters"
              />
              <Text className="text-xs text-muted mt-1 ml-1">
                7 caracteres, sem traço ou espaços
              </Text>
            </View>

            {/* Switch para alocar posição (só aparece se tiver posição disponível) */}
            {posicaoHorizontalAtiva && posicaoVerticalAtiva && (
              <View className="bg-card rounded-xl p-4 border border-secondary">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-4">
                    <Text className="text-text font-medium">
                      Alocar à posição vaga
                    </Text>
                    <Text className="text-muted text-sm mt-1">
                      Moto será alocada em {posicaoHorizontalAtiva}-{posicaoVerticalAtiva}
                    </Text>
                  </View>
                  <Switch
                    value={alocarPosicao}
                    onValueChange={setAlocarPosicao}
                    trackColor={{ false: "#767577", true: "#05AF31" }}
                    thumbColor={alocarPosicao ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Botão Submit */}
          <View className="pb-5">
            <TouchableOpacity
              className="mt-8 h-14 w-full items-center justify-center rounded-xl bg-primary shadow-lg"
              onPress={cadastrar}
              activeOpacity={0.8}
            >
              <Text className="font-semibold text-white text-lg">
                {alocarPosicao && posicaoHorizontalAtiva && posicaoVerticalAtiva
                  ? "Cadastrar e Alocar"
                  : "Cadastrar Moto em Posicação Aleatória"
                }
              </Text>
            </TouchableOpacity>

            {/* Campos obrigatórios */}
            <Text className="text-muted text-xs text-center mt-4">
              * Campos obrigatórios
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    borderRadius: 12,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
  },
  opcoesDropdown: {
    borderRadius: 12,
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    borderWidth: 1,
  },
})
