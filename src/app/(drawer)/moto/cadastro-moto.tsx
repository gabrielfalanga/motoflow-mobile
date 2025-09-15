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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { SubmitButton } from "@/components/submit-button";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import axios from "axios";

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
  const [isIdentificandoFoto, setIsIdentificandoFoto] = useState(false);

  // Estados da câmera
  const [permissaoCam, requestPermissaoCam] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [foto, setFoto] = useState<any>(null);
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

  const alternarFlash = () => {
    setFlashLigado(!flashLigado);
  };

  const fecharCamera = () => {
    setMostrarCamera(false);
    setFoto(null);
  };

  const enviarFoto = async () => {
    if (!foto) return;

    setIsIdentificandoFoto(true);

    try {
      // Criar FormData
      const formData = new FormData();

      // Adicionar a imagem ao FormData (sua API espera 'file')
      formData.append("file", {
        uri: foto.uri,
        type: "image/jpeg",
        name: "moto.jpg",
      } as any);

      // Fazer requisição para a API Flask
      const response = await axios.post("http://192.168.0.69:5000/api/analisar-moto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000, // 10 segundos de timeout
      });

      // Processar a resposta da API
      console.log("Resposta da API:", response.data);

      const { tipo_moto, placa, probabilidades } = response.data;

      // Preencher automaticamente os campos se os dados forem identificados
      if (tipo_moto) {
        setTipoMoto(tipo_moto);
      }

      if (placa) {
        setPlaca(placa);
      }

      // Mostrar resultado para o usuário
      const probabilidadeTexto = probabilidades
        ? Object.entries(probabilidades)
            .map(([tipo, prob]) => `${tipo}: ${(Number(prob) * 100).toFixed(1)}%`)
            .join("\n")
        : "";

      Alert.alert(
        "Foto processada!",
        `Dados identificados:${tipo_moto ? `\nTipo: ${tipo_moto}` : ""}${
          placa ? `\nPlaca: ${placa}` : ""
        }${probabilidadeTexto ? `\n\nProbabilidades:\n${probabilidadeTexto}` : ""}`,
        [
          {
            text: "OK",
            onPress: () => {
              fecharCamera();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao identificar moto:", error);

      let mensagemErro = "Erro ao processar a foto. Tente novamente.";

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          mensagemErro = "Tempo limite excedido. Verifique sua conexão.";
        } else if (error.response) {
          mensagemErro = `Erro do servidor: ${error.response.status}`;
        } else if (error.request) {
          mensagemErro = "Erro de conexão. Verifique sua internet.";
        }
      }

      Alert.alert("Erro", mensagemErro);
    } finally {
      setIsIdentificandoFoto(false);
    }
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
        <View className="flex-1 bg-background ">
          {!foto ? (
            // Tela da câmera
            <View className="flex-1 bg-background">
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="back"
                flash={flashLigado ? "on" : "off"}
              />
              <View className="flex-row justify-around align-center mt-6">
                <TouchableOpacity
                  onPress={fecharCamera}
                  className="justify-center align-center bg-secondary p-3 rounded"
                >
                  <Ionicons
                    name="arrow-undo-outline"
                    color={isDark ? "white" : "black"}
                    size={34}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={tirarFoto}
                  className="justify-center align-center bg-primary p-3 rounded"
                >
                  <Ionicons name="radio-button-on-outline" color="white" size={34} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={alternarFlash}
                  className="justify-center align-center bg-secondary p-3 rounded"
                >
                  <Ionicons
                    name={flashLigado ? "flash-outline" : "flash-off-outline"}
                    color={isDark ? "white" : "black"}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Tela de preview da foto
            <View className="flex-1">
              <Image source={{ uri: foto.uri }} className="flex-1" style={{ flex: 1 }} />
              <View className="flex-row justify-around align-center mt-6">
                <TouchableOpacity
                  onPress={() => setFoto(null)}
                  className="bg-secondary p-3 rounded"
                  disabled={isIdentificandoFoto}
                >
                  <Text className="text-text font-medium">Tirar outra foto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={enviarFoto}
                  className={`p-3 rounded ${isIdentificandoFoto ? "bg-gray-400" : "bg-primary"}`}
                  disabled={isIdentificandoFoto}
                >
                  <Text className="text-white font-medium">
                    {isIdentificandoFoto ? "Processando..." : "Enviar foto"}
                  </Text>
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
