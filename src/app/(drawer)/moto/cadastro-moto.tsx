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
  setor: string;
  codRastreador: string;
  dataEntrada: string;
}

export default function CadastroMotoScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { patioId, token } = useAuth();
  const params = useLocalSearchParams<{
    setor?: string;
  }>();

  const [setorAtivo, setSetorAtivo] = useState<string | null>(null);

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
      const hasPositionParams = !!params.setor;

      if (hasPositionParams) {
        setSetorAtivo(params.setor || null);
        setSetor(params.setor || null); // Setar automaticamente o setor no dropdown
      } else {
        setSetorAtivo(null);
      }
    }, [params.setor])
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
  const [openTipoMoto, setOpenTipoMoto] = useState(false);
  const [tipoMoto, setTipoMoto] = useState<string | null>(null);
  const [opcoesTipoMoto, setOpcoesTipoMoto] = useState([
    { label: "Mottu E", value: "MOTTU_E" },
    { label: "Mottu Sport", value: "MOTTU_SPORT" },
    { label: "Mottu Pop", value: "MOTTU_POP" },
  ]);

  // dropdown setor
  const [openSetor, setOpenSetor] = useState(false);
  const [setor, setSetor] = useState<string | null>(null);
  const [opcoesSetor, setOpcoesSetor] = useState<Array<{ label: string; value: string }>>([]);

  // Buscar setores ao montar tela ou quando patioId muda
  useFocusEffect(
    useCallback(() => {
      async function fetchSetores() {
        if (!patioId || !token) return;
        try {
          // Usar a função request do helper igual as outras chamadas
          const setores = await request<string[]>(`/posicoes/${patioId}`, "get", undefined, {
            authToken: token,
          });
          if (Array.isArray(setores)) {
            // Se o retorno é [{ setor: "A" }, ...], extrai o campo setor
            const nomesSetores = setores
              .map((s) =>
                typeof s === "object" && s !== null && "setor" in s ? (s as any).setor : null
              )
              .filter((s) => typeof s === "string" && s.length > 0);
            setOpcoesSetor(nomesSetores.map((s) => ({ label: s, value: s, key: s })));
          }
        } catch (err) {
          setOpcoesSetor([]);
        }
      }
      fetchSetores();
    }, [token])
  );

  // form fields
  const [ano, setAno] = useState<number>();
  const [placa, setPlaca] = useState<string>();
  const [codRastreador, setCodRastreador] = useState<string>();

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

    if (!codRastreador || !codRastreador.trim()) {
      Alert.alert("Erro", "Digite um código de rastreador válido.");
      return;
    }

    if (!setor) {
      Alert.alert("Erro", "Selecione o setor para alocar a moto.");
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para envio
      const dadosMoto: CadastroMoto = {
        tipoMoto: tipoMoto,
        ano: ano,
        placa: placa,
        statusMoto: "DISPONIVEL",
        setor: setor,
        codRastreador: codRastreador,
        dataEntrada: new Date().toISOString().slice(0, 19),
      };

      // Fazer requisição para API
      const motoResponse = await request<CadastroMoto>(`/motos/${patioId}`, "post", dadosMoto, {
        authToken: token,
      });

      Alert.alert(
        "Moto cadastrada e alocada!",
        `Tipo: ${tipoMoto}\nPlaca: ${placa}\nAno: ${ano}\nRastreador: ${motoResponse?.codRastreador}\nSetor: ${motoResponse?.setor}`,
        [
          {
            text: "OK",
            onPress: () => {
              limparFormulario();
              router.setParams({});
              router.replace(`/setor/${motoResponse?.setor}`);
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
    setPlaca(undefined);
    setAno(undefined);
    setCodRastreador(undefined);
    setSetor(null);
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

          {/* Aviso se não houver setores */}
          {opcoesSetor.length === 0 ? (
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="add-circle-outline" size={64} color="#05AF31" />
              <Text className="mt-4 mb-2 font-semibold text-primary">Cadastrar Primeiro Setor</Text>
              <Text className="text-center text-muted text-sm">
                Ainda não há setores configurados neste pátio
              </Text>
              <Text className="mb-6 text-center text-muted text-sm">
                Configure pelo menos um setor para cadastrar motos
              </Text>
              <TouchableOpacity
                className="h-12 items-center justify-center rounded-xl bg-primary px-6"
                onPress={() => router.navigate("/setores/cadastro-setor")}
                activeOpacity={0.8}
              >
                <Text className="font-semibold text-white">Cadastrar Setor</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Form - ScrollView para conteúdo rolável */}
              <View className="flex-1">
                <View className="gap-2">
                  {/* Dropdown Tipo de Moto */}
                  <View>
                    <Text className="mb-2 ml-1 font-medium text-text">Tipo da Moto *</Text>
                    <DropDownPicker
                      open={openTipoMoto}
                      value={tipoMoto}
                      items={opcoesTipoMoto}
                      setOpen={setOpenTipoMoto}
                      setValue={setTipoMoto}
                      setItems={setOpcoesTipoMoto}
                      placeholder="Selecione o tipo da moto"
                      style={[
                        styles.dropdown,
                        isDark && { backgroundColor: "#222222" },
                        { zIndex: 20 },
                      ]}
                      dropDownContainerStyle={[
                        styles.opcoesDropdown,
                        isDark && { backgroundColor: "#222222" },
                        { zIndex: 20 },
                      ]}
                      textStyle={{
                        color: isDark ? "#ffffff" : "#000000",
                      }}
                      placeholderStyle={{
                        color: isDark ? "#cccccc" : "#666666",
                      }}
                    />
                  </View>

                  {/* Placa e Ano lado a lado */}
                  <View className="flex-row justify-between gap-4 mb-4">
                    {/* Campo Placa */}
                    <View className="flex-1">
                      <Text className="mb-2 ml-1 font-medium text-text">Placa *</Text>
                      <TextInput
                        placeholder="Ex: ABC1234"
                        className="h-14 rounded-xl border border-secondary bg-card px-4 text-text"
                        style={{ width: "100%" }}
                        placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                        value={placa}
                        onChangeText={(value) => setPlaca(value.toUpperCase())}
                        autoCapitalize="characters"
                        maxLength={7}
                      />
                    </View>
                    {/* Campo Ano */}
                    <View className="flex-1">
                      <Text className="mb-2 ml-1 font-medium text-text">Ano *</Text>
                      <TextInput
                        placeholder="Ex: 2024"
                        className="h-14 rounded-xl border border-secondary bg-card px-4 text-text"
                        style={{ width: "100%" }}
                        placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                        value={ano?.toString() || ""}
                        onChangeText={(value) => {
                          const numericValue = value.replace(/[^0-9]/g, "");
                          if (numericValue === "") {
                            setAno(undefined);
                            return;
                          }
                          const num = Number(numericValue);
                          if (numericValue.length < 4 || num >= 2012) {
                            setAno(num);
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                    </View>
                  </View>
                  {/* Campo Código do Rastreador */}
                  <View className="mb-4">
                    <Text className="mb-2 ml-1 font-medium text-text">Código do Rastreador *</Text>
                    <TextInput
                      placeholder="Ex: ABC123XYZ"
                      className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                      placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                      value={codRastreador || ""}
                      onChangeText={setCodRastreador}
                    />
                  </View>
                  {/* Dropdown Setor */}
                  <View className="mb-10">
                    <Text className="mb-1 ml-1 font-medium text-text">Setor *</Text>
                    <DropDownPicker
                      open={openSetor}
                      value={setor}
                      items={opcoesSetor}
                      setOpen={setOpenSetor}
                      setValue={setSetor}
                      setItems={setOpcoesSetor}
                      placeholder="Selecione um setor para alocar a moto"
                      style={[
                        styles.dropdown,
                        isDark && { backgroundColor: "#222222" },
                        { zIndex: 10 },
                      ]}
                      dropDownContainerStyle={[
                        styles.opcoesDropdown,
                        isDark && { backgroundColor: "#222222" },
                        { zIndex: 10 },
                      ]}
                      textStyle={{
                        color: isDark ? "#ffffff" : "#000000",
                      }}
                      placeholderStyle={{
                        color: isDark ? "#cccccc" : "#666666",
                      }}
                      disabled={opcoesSetor.length === 0}
                    />
                  </View>
                </View>
              </View>

              {/* Botões - Em row */}
              <View className="pb-5">
                <View className="flex-row gap-3 mb-4">
                  <TouchableOpacity
                    className="flex-1 flex-row h-14 items-center justify-center rounded-2xl bg-secondary"
                    onPress={abrirCamera}
                  >
                    <Ionicons name="camera" color={isDark ? "white" : "black"} size={20} />
                    <Text className="ml-2 font-semibold text-text">Foto</Text>
                  </TouchableOpacity>

                  <View style={{ flex: 2 }}>
                    <SubmitButton
                      isLoading={isLoading}
                      onSubmit={cadastrar}
                      text="Cadastrar e Alocar"
                    />
                  </View>
                </View>

                {/* Campos obrigatórios */}
                <Text className="text-center text-muted text-xs">* Campos obrigatórios</Text>
              </View>
            </>
          )}
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
