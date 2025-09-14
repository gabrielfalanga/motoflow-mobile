import { useState, useRef } from "react";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

interface CadastroMoto {
  tipoMoto: string;
  ano: number;
  placa: string;
  statusMoto: "DISPONIVEL";
  idPatio: number;
  posicaoHorizontal?: string;
  posicaoVertical?: number;
}

interface MotoResponse {
  idPatio: number;
  placaMoto: string;
  posicaoHorizontal?: string;
  posicaoVertical?: number;
}

export default function CadastroMotoScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { patioId, token } = useAuth();
  const params = useLocalSearchParams<{
    posicaoHorizontal?: string;
    posicaoVertical?: string;
  }>();

  const [posicaoHorizontalAtiva, setPosicaoHorizontalAtiva] = useState<string | null>(null);
  const [posicaoVerticalAtiva, setPosicaoVerticalAtiva] = useState<number | null>(null);

  // Estado de loading
  const [isLoading, setIsLoading] = useState(false);

  // Estados da câmera
  const [permissaoCam, requestPermissaoCam] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [foto, setFoto] = useState<any>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [flashLigado, setFlashLigado] = useState(false);
  const [mostrarCamera, setMostrarCamera] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const hasPositionParams = params.posicaoHorizontal || params.posicaoVertical;

      if (hasPositionParams) {
        setPosicaoHorizontalAtiva(params.posicaoHorizontal || null);
        setPosicaoVerticalAtiva(params.posicaoVertical ? Number(params.posicaoVertical) : null);
        setAlocarPosicao(true);
      } else {
        setPosicaoHorizontalAtiva(null);
        setPosicaoVerticalAtiva(null);
      }
    }, [params.posicaoHorizontal, params.posicaoVertical])
  );

  // Funções da câmera
  const abrirCamera = async () => {
    if (!permissaoCam?.granted) {
      const { granted } = await requestPermissaoCam();
      if (!granted) {
        Alert.alert("Erro", "Permissão da câmera é necessária para tirar fotos.");
        return;
      }
    }
    setMostrarCamera(true);
  };

  const tirarFoto = async () => {
    if (cameraRef.current) {
      const dadoFoto = await cameraRef.current.takePictureAsync();
      setFoto(dadoFoto);
    }
  };

  const alternarCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const alternarFlash = () => {
    setFlashLigado(!flashLigado);
  };

  const fecharCamera = () => {
    setMostrarCamera(false);
    setFoto(null);
  };

  const enviarFoto = () => {
    // Aqui você pode implementar a lógica para processar a foto
    // Por enquanto, vamos apenas fechar a câmera
    Alert.alert(
      "Foto enviada!",
      "Funcionalidade de processamento da foto será implementada em breve."
    );
    fecharCamera();
  };

  // dropdown tipo de moto
  const [open, setOpen] = useState(false);
  const [tipoMoto, setTipoMoto] = useState<string | null>(null);
  const [opcoes, setOpcoes] = useState([
    { label: "Mottu E", value: "MOTTU_E" },
    { label: "Mottu Sport", value: "MOTTU_SPORT" },
    { label: "Mottu Pop", value: "MOTTU_POP" },
  ]);

  // form fields
  const [ano, setAno] = useState<number>();
  const [placa, setPlaca] = useState<string>();

  // switch para alocar posição (só ativo se tiver posição)
  const [alocarPosicao, setAlocarPosicao] = useState(false);

  const cadastrar = async () => {
    if (!patioId || !token) return;

    const anoAtual = new Date().getFullYear();
    const anoMaximo = anoAtual + 1;

    // Validações
    if (!tipoMoto) {
      Alert.alert("Erro", "Selecione o tipo da moto.");
      return;
    }

    if (!ano || Number.isNaN(ano) || ano.toString().length !== 4 || ano < 2012 || ano > anoMaximo) {
      Alert.alert("Erro", "Digite um ano válido (mínimo 2012).");
      return;
    }

    const placaRegex = /^[A-Z0-9]{7}$/;
    if (!placa || !placaRegex.test(placa)) {
      Alert.alert("Erro", "Digite uma placa válida (sem espaços ou símbolos).");
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para envio
      const estaComPosicao = alocarPosicao && posicaoHorizontalAtiva && posicaoVerticalAtiva;

      const dadosMoto: CadastroMoto = {
        tipoMoto: tipoMoto,
        ano: ano,
        placa: placa,
        statusMoto: "DISPONIVEL",
        idPatio: patioId,
        ...(estaComPosicao && {
          posicaoHorizontal: posicaoHorizontalAtiva,
          posicaoVertical: posicaoVerticalAtiva,
        }),
      };

      // Fazer requisição para API
      const motoResponse = await request<MotoResponse>(
        estaComPosicao ? `/motos/${patioId}` : "/motos/cadastro-e-alocacao",
        "post",
        dadosMoto,
        {
          authToken: token,
        }
      );

      Alert.alert(
        "Moto cadastrada e alocada!",
        `Tipo: ${tipoMoto}\nAno: ${ano}\nPlaca: ${placa}\nPosição: ${motoResponse?.posicaoHorizontal}-${motoResponse?.posicaoVertical}`,
        [
          {
            text: "OK",
            onPress: () => {
              limparFormulario();
              router.setParams({});
              router.replace(`/posicao-horizontal/${motoResponse?.posicaoHorizontal}`);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao cadastrar moto:", error);
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro desconhecido ao cadastrar moto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const limparFormulario = () => {
    setTipoMoto(null);
    setAno(undefined);
    setPlaca(undefined);
    setAlocarPosicao(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {mostrarCamera ? (
        <View className="flex-1">
          {!foto ? (
            // Tela da câmera
            <View className="flex-1">
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={isFrontCamera ? "front" : "back"}
                flash={flashLigado ? "on" : "off"}
              />
              <View className="flex-row justify-around m-4">
                <TouchableOpacity onPress={fecharCamera} className="bg-gray-200 p-3 rounded">
                  <Text className="text-black">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={tirarFoto} className="bg-blue-500 p-3 rounded">
                  <Text className="text-white">Tirar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={alternarCamera} className="bg-gray-200 p-3 rounded">
                  <Text className="text-black">Alterar câmera</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={alternarFlash} className="bg-gray-200 p-3 rounded">
                  <Text className="text-black">
                    {flashLigado ? "Desligar Flash" : "Ligar Flash"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Tela de preview da foto
            <View className="flex-1">
              <Image source={{ uri: foto.uri }} className="flex-1" style={{ flex: 1 }} />
              <View className="flex-row justify-around m-4">
                <TouchableOpacity onPress={() => setFoto(null)} className="bg-gray-200 p-3 rounded">
                  <Text className="text-black">Tirar outra foto</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={enviarFoto} className="bg-green-500 p-3 rounded">
                  <Text className="text-white">Enviar foto</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        // Tela de cadastro normal
        <View className="flex-1 px-6 py-5">
          {/* Header */}
          <Text className="text-center mb-6 font-bold text-3xl text-primary">Cadastre a moto</Text>

          {/* Form - ScrollView para conteúdo rolável */}
          <View className="flex-1">
            <View className="gap-2">
              {/* Dropdown Tipo de Moto */}
              <View>
                <Text className="mb-1 ml-1 font-medium text-text">Tipo da Moto *</Text>
                <DropDownPicker
                  open={open}
                  value={tipoMoto}
                  items={opcoes}
                  setOpen={setOpen}
                  setValue={setTipoMoto}
                  setItems={setOpcoes}
                  placeholder="Selecione o tipo da moto"
                  style={[styles.dropdown, theme === "dark" && { backgroundColor: "#222222" }]}
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

              {/* Campo Placa */}
              <View>
                <Text className="mb-1 ml-1 font-medium text-text">Placa *</Text>
                <TextInput
                  placeholder="Ex: ABC1234"
                  className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                  placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                  value={placa}
                  onChangeText={(value) => setPlaca(value.toUpperCase())}
                  maxLength={7}
                  autoCapitalize="characters"
                />
                <Text className="ml-1 text-muted text-xs">7 caracteres, sem traço ou espaços</Text>
              </View>

              {/* Campo Ano */}
              <View>
                <Text className="mb-1 ml-1 font-medium text-text">Ano *</Text>
                <TextInput
                  placeholder="Ex: 2024"
                  className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                  placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                  value={ano?.toString() || ""}
                  onChangeText={(value) => {
                    // Remove qualquer caractere que não seja número
                    const numericValue = value.replace(/[^0-9]/g, "");

                    if (numericValue === "") {
                      setAno(undefined);
                      return;
                    }

                    const num = Number(numericValue);

                    // Só aceita se for >= 2012 ou se ainda estiver digitando (menos de 4 dígitos)
                    if (numericValue.length < 4 || num >= 2012) {
                      setAno(num);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <Text className="ml-1 text-muted text-xs">Ano mínimo: 2012</Text>
              </View>

              {/* Switch para alocar posição (só aparece se tiver posição disponível) */}
              {posicaoHorizontalAtiva && posicaoVerticalAtiva && (
                <View className="rounded-xl border border-secondary bg-card p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="mr-4 flex-1">
                      <Text className="font-medium text-text">Alocar à posição vaga</Text>
                      <Text className="mt-1 text-muted text-sm">
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
          </View>

          {/* Botão Submit - Fixo na parte inferior */}
          <View className="gap-5 pt-4 pb-5">
            <TouchableOpacity
              className="flex-row h-14 w-full items-center justify-center rounded-2xl bg-secondary"
              onPress={abrirCamera}
            >
              <Ionicons name="camera" color={theme == "dark" ? "white" : "black"} size={24} />
              <Text className="ml-3 font-semibold text-lg text-text">Preencher com Foto</Text>
            </TouchableOpacity>

            <SubmitButton
              isLoading={isLoading}
              onSubmit={cadastrar}
              text={
                alocarPosicao && posicaoHorizontalAtiva && posicaoVerticalAtiva
                  ? "Cadastrar e Alocar"
                  : "Cadastrar Moto em Posicão Aleatória"
              }
            />

            {/* Campos obrigatórios */}
            <Text className="text-center text-muted text-xs">* Campos obrigatórios</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
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
});
