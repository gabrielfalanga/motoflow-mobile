import { useState, useCallback } from "react";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";
import { request, RequestError } from "@/helper/request";
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
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

interface MotoEncontrada {
  placa: string;
  tipoMoto: "MOTTU_E" | "MOTTU_SPORT" | "MOTTU_POP";
  ano: number;
  statusMoto: "DISPONIVEL" | "MANUTENCAO" | "ALUGADA";
  setor: string;
  codRastreador: string;
}

export default function BuscaMotoScreen() {
  const { theme } = useTheme();
  const { token, patioId } = useAuth();

  // Estados de busca
  const [tipoBusca, setTipoBusca] = useState<"placa" | "rastreador" | "tipo">("placa");
  const [placa, setPlaca] = useState<string>("");
  const [codRastreador, setCodRastreador] = useState<string>("");
  const [tipoMoto, setTipoMoto] = useState<string | null>(null);
  const [motoEncontrada, setMotoEncontrada] = useState<MotoEncontrada | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [erroMensagem, setErroMensagem] = useState<string>("");

  // Estados dos dropdowns de busca
  const [openTipoMoto, setOpenTipoMoto] = useState(false);
  const [opcoesTipoMoto, setOpcoesTipoMoto] = useState([
    { label: "Mottu E", value: "MOTTU_E" },
    { label: "Mottu Sport", value: "MOTTU_SPORT" },
    { label: "Mottu Pop", value: "MOTTU_POP" },
  ]);

  // Estados do modal de alocação
  const [modalAlocacaoVisible, setModalAlocacaoVisible] = useState(false);
  const [isAlocando, setIsAlocando] = useState(false);

  // Estados do modal de edição de status
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [isEditandoStatus, setIsEditandoStatus] = useState(false);

  // Estados do dropdown de setor
  const [openSetor, setOpenSetor] = useState(false);
  const [setor, setSetor] = useState<string | null>(null);
  const [opcoesSetor, setOpcoesSetor] = useState<Array<{ label: string; value: string }>>([]);

  // Estados do dropdown de status
  const [openStatus, setOpenStatus] = useState(false);
  const [novoStatus, setNovoStatus] = useState<string | null>(null);
  const [opcoesStatus, setOpcoesStatus] = useState<Array<{ label: string; value: string }>>([]);

  // Buscar setores ao montar tela ou quando patioId muda
  useFocusEffect(
    useCallback(() => {
      async function fetchSetores() {
        if (!patioId || !token) return;
        try {
          const setores = await request<string[]>(`/posicoes/${patioId}`, "get", undefined, {
            authToken: token,
          });
          if (Array.isArray(setores)) {
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
    }, [patioId, token])
  );

  const buscarMoto = async () => {
    if (!token || !patioId) {
      return;
    }

    // Validações baseadas no tipo de busca
    if (tipoBusca === "placa") {
      if (!placa.trim()) {
        Alert.alert("Erro", "Digite uma placa para buscar.");
        return;
      }
      const placaRegex = /^[A-Z0-9]{7}$/;
      if (!placaRegex.test(placa)) {
        Alert.alert("Erro", "Digite uma placa válida (7 caracteres, sem espaços ou símbolos).");
        return;
      }
    } else if (tipoBusca === "rastreador") {
      if (!codRastreador.trim()) {
        Alert.alert("Erro", "Digite um código de rastreador para buscar.");
        return;
      }
    } else if (tipoBusca === "tipo") {
      if (!tipoMoto) {
        Alert.alert("Erro", "Selecione um tipo de moto para buscar.");
        return;
      }
    }

    setIsLoading(true);
    setErroMensagem("");
    setMotoEncontrada(null);

    try {
      let endpoint = "";
      let errorMessage = "";

      if (tipoBusca === "placa") {
        endpoint = `/motos/posicao?placa=${placa}`;
        errorMessage = "Moto não encontrada com essa placa.";
      } else if (tipoBusca === "rastreador") {
        endpoint = `/motos/posicao/rastreador?codRastreador=${codRastreador}`;
        errorMessage = "Moto não encontrada com esse código de rastreador.";
      } else if (tipoBusca === "tipo") {
        endpoint = `/motos/posicao/tipo/${tipoMoto}/patio/${patioId}`;
        errorMessage = "Nenhuma moto encontrada desse tipo no pátio.";
      }

      const response = await request<MotoEncontrada | MotoEncontrada[]>(endpoint, "get", null, {
        authToken: token,
      });

      if (response) {
        // Para busca por tipo, a API pode retornar um array
        if (Array.isArray(response)) {
          if (response.length > 0) {
            setMotoEncontrada(response[0]); // Mostra a primeira moto encontrada
            if (response.length > 1) {
              Alert.alert(
                "Múltiplas motos encontradas",
                `Foram encontradas ${response.length} motos deste tipo. Mostrando a primeira.`
              );
            }
          } else {
            setErroMensagem(errorMessage);
          }
        } else {
          setMotoEncontrada(response);
        }
      } else {
        setErroMensagem(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao buscar moto:", error);

      if (error instanceof RequestError) {
        if (error.statusCode === 404) {
          if (tipoBusca === "placa") {
            setErroMensagem("Moto não encontrada com essa placa.");
          } else if (tipoBusca === "rastreador") {
            setErroMensagem("Moto não encontrada com esse código de rastreador.");
          } else if (tipoBusca === "tipo") {
            setErroMensagem("Nenhuma moto encontrada desse tipo no pátio.");
          }
        } else {
          setErroMensagem(error.message);
        }
      } else {
        setErroMensagem("Erro inesperado ao buscar moto.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const limparBusca = () => {
    setPlaca("");
    setCodRastreador("");
    setTipoMoto(null);
    setMotoEncontrada(null);
    setErroMensagem("");
    setModalAlocacaoVisible(false);
    setSetor(null);
  };

  const abrirModalAlocacao = () => {
    setModalAlocacaoVisible(true);
  };

  const fecharModalAlocacao = () => {
    setModalAlocacaoVisible(false);
    setSetor(null);
  };

  const abrirModalEditarStatus = () => {
    if (motoEncontrada) {
      setOpcoesStatus(getOpcoesStatus(motoEncontrada.statusMoto));
      setModalStatusVisible(true);
    }
  };

  const fecharModalEditarStatus = () => {
    setModalStatusVisible(false);
    setNovoStatus(null);
  };

  const editarStatusMoto = async () => {
    if (!motoEncontrada || !token || !novoStatus) return;

    // Validações
    if (!novoStatus) {
      Alert.alert("Erro", "Selecione o novo status da moto.");
      return;
    }

    setIsEditandoStatus(true);

    try {
      const body = {
        status: novoStatus,
      };

      const response = await request(`/motos/${motoEncontrada.placa}`, "patch", body, {
        authToken: token,
      });

      // Atualizar a moto encontrada com o novo status
      setMotoEncontrada(response as MotoEncontrada);

      Alert.alert("Sucesso", "Status da moto atualizado com sucesso!");
      fecharModalEditarStatus();
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado ao atualizar o status da moto.";
      const errorTitle = "Erro na Atualização";

      if (error instanceof RequestError) {
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage, [{ text: "OK" }]);
    } finally {
      setIsEditandoStatus(false);
    }
  };

  const alocarMoto = async () => {
    if (!motoEncontrada || !token || !patioId) return;

    // Validações
    if (!setor) {
      Alert.alert("Erro", "Selecione o setor para alocar a moto.");
      return;
    }

    setIsAlocando(true);

    try {
      const body = {
        placa: motoEncontrada.placa,
        setor: setor,
      };

      const response = await request(`/motos/alocacao/${patioId}`, "put", body, {
        authToken: token,
      });

      setMotoEncontrada(response as MotoEncontrada);

      Alert.alert("Sucesso", "Moto alocada com sucesso!");
      fecharModalAlocacao();
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado ao alocar a moto no setor.";
      const errorTitle = "Erro na Alocação";

      if (error instanceof RequestError) {
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage, [{ text: "OK" }]);
    } finally {
      setIsAlocando(false);
    }
  };

  const getTipoMotoIcon = (tipo: string) => {
    switch (tipo) {
      case "MOTTU_E":
        return "flash";
      case "MOTTU_SPORT":
        return "speedometer";
      case "MOTTU_POP":
        return "bicycle";
      default:
        return "bicycle";
    }
  };

  const getTipoMotoNome = (tipo: string) => {
    switch (tipo) {
      case "MOTTU_E":
        return "Mottu E (Elétrica)";
      case "MOTTU_SPORT":
        return "Mottu Sport (Esportiva)";
      case "MOTTU_POP":
        return "Mottu Pop (Popular)";
      default:
        return tipo;
    }
  };

  const getStatusMotoInfo = (status: string) => {
    switch (status) {
      case "DISPONIVEL":
        return { nome: "Disponível", cor: "#10b981" };
      case "MANUTENCAO":
        return { nome: "Em Manutenção", cor: "#f59e0b" };
      case "ALUGADA":
        return { nome: "Alugada", cor: "#ef4444" };
      default:
        return { nome: status, cor: "#6b7280" };
    }
  };

  const getOpcoesStatus = (statusAtual: string) => {
    const todosStatus = [
      { label: "Disponível", value: "DISPONIVEL" },
      { label: "Em Manutenção", value: "MANUTENCAO" },
      { label: "Alugada", value: "ALUGADA" },
    ];

    return todosStatus.filter((status) => status.value !== statusAtual);
  };

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

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Form de Busca */}
            <View className="mb-6">
              {/* Seletor de Tipo de Busca */}
              <View className="mb-6">
                <Text className="mb-3 ml-1 font-medium text-text">Como deseja buscar?</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className={`flex-1 h-16 items-center justify-center rounded-xl border-2 ${
                      tipoBusca === "placa"
                        ? "bg-primary border-primary"
                        : "bg-card border-secondary"
                    }`}
                    onPress={() => setTipoBusca("placa")}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="albums-outline"
                      size={24}
                      color={tipoBusca === "placa" ? "#ffffff" : "#05AF31"}
                    />
                    <Text
                      className={`mt-1 font-semibold text-sm ${
                        tipoBusca === "placa" ? "text-white" : "text-text"
                      }`}
                    >
                      Placa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 h-16 items-center justify-center rounded-xl border-2 ${
                      tipoBusca === "rastreador"
                        ? "bg-primary border-primary"
                        : "bg-card border-secondary"
                    }`}
                    onPress={() => setTipoBusca("rastreador")}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="radio-outline"
                      size={24}
                      color={tipoBusca === "rastreador" ? "#ffffff" : "#05AF31"}
                    />
                    <Text
                      className={`mt-1 font-semibold text-sm ${
                        tipoBusca === "rastreador" ? "text-white" : "text-text"
                      }`}
                    >
                      Rastreador
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 h-16 items-center justify-center rounded-xl border-2 ${
                      tipoBusca === "tipo"
                        ? "bg-primary border-primary"
                        : "bg-card border-secondary"
                    }`}
                    onPress={() => setTipoBusca("tipo")}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="bicycle-outline"
                      size={24}
                      color={tipoBusca === "tipo" ? "#ffffff" : "#05AF31"}
                    />
                    <Text
                      className={`mt-1 font-semibold text-sm ${
                        tipoBusca === "tipo" ? "text-white" : "text-text"
                      }`}
                    >
                      Tipo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Campo de Busca Condicional */}
              {tipoBusca === "placa" && (
                <View>
                  <Text className="mb-2 ml-1 font-medium text-text">Placa da Moto</Text>
                  <TextInput
                    placeholder="Ex: ABC1234"
                    className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                    placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                    value={placa}
                    onChangeText={(value) =>
                      setPlaca(
                        value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 7)
                      )
                    }
                    autoCapitalize="characters"
                  />
                  <Text className="mt-1 ml-1 text-muted text-xs">
                    7 caracteres, sem traço ou espaços
                  </Text>
                </View>
              )}

              {tipoBusca === "rastreador" && (
                <View>
                  <Text className="mb-2 ml-1 font-medium text-text">Código do Rastreador</Text>
                  <TextInput
                    placeholder="Ex: ABC123XYZ"
                    className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                    placeholderTextColor={theme === "dark" ? "#cccccc" : "#666666"}
                    value={codRastreador}
                    onChangeText={setCodRastreador}
                  />
                  <Text className="mt-1 ml-1 text-muted text-xs">
                    Código alfanumérico do rastreador
                  </Text>
                </View>
              )}

              {tipoBusca === "tipo" && (
                <View>
                  <Text className="mb-2 ml-1 font-medium text-text">Tipo da Moto</Text>
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
                      theme === "dark" && { backgroundColor: "#222222" },
                      { zIndex: 20 },
                    ]}
                    dropDownContainerStyle={[
                      styles.opcoesDropdown,
                      theme === "dark" && { backgroundColor: "#222222" },
                      { zIndex: 20 },
                    ]}
                    textStyle={{
                      color: theme === "dark" ? "#ffffff" : "#000000",
                    }}
                    placeholderStyle={{
                      color: theme === "dark" ? "#cccccc" : "#666666",
                    }}
                  />
                  <Text className="mt-1 ml-1 text-muted text-xs">
                    Busca a primeira moto disponível do tipo selecionado
                  </Text>
                </View>
              )}
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
                    <Text className="ml-2 font-semibold text-lg text-white">Buscar</Text>
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
                    <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
                    <Text className="ml-3 font-medium text-red-600">Moto não encontrada</Text>
                  </View>
                  <Text className="mt-2 text-red-500 text-sm">{erroMensagem}</Text>
                </View>
              )}

              {/* Moto Encontrada */}
              {motoEncontrada && (
                <View className="rounded-xl border border-secondary bg-card p-6">
                  <View className="mb-4 flex-row items-center justify-center">
                    <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                    <Text className="ml-3 font-bold text-green-600 text-xl">Moto Encontrada!</Text>
                  </View>

                  {/* Detalhes da Moto */}
                  <View className="gap-4">
                    {/* Placa */}
                    <View className="flex-row items-center">
                      <Ionicons name="albums-outline" size={24} color="#05AF31" />
                      <View className="ml-3 flex-1">
                        <Text className="font-medium text-text">Placa</Text>
                        <Text className="font-bold text-lg text-primary">
                          {motoEncontrada.placa}
                        </Text>
                      </View>
                    </View>

                    {/* Código do Rastreador */}
                    <View className="flex-row items-center">
                      <Ionicons name="radio-outline" size={24} color="#05AF31" />
                      <View className="ml-3 flex-1">
                        <Text className="font-medium text-text">Código do Rastreador</Text>
                        <Text className="font-bold text-lg text-primary">
                          {motoEncontrada.codRastreador}
                        </Text>
                      </View>
                    </View>

                    {/* Tipo e Ano lado a lado */}
                    <View className="flex-row gap-4">
                      {/* Tipo */}
                      <View className="flex-1 flex-row items-center">
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
                          <Text className="text-muted text-sm">
                            {getTipoMotoNome(motoEncontrada.tipoMoto)}
                          </Text>
                        </View>
                      </View>

                      {/* Ano */}
                      <View className="flex-1 flex-row items-center">
                        <Ionicons name="calendar-outline" size={24} color="#05AF31" />
                        <View className="ml-3 flex-1">
                          <Text className="font-medium text-text">Ano</Text>
                          <Text className="text-muted">{motoEncontrada.ano}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Status e Setor lado a lado */}
                    <View className="flex-row gap-4">
                      {/* Status */}
                      <View className="flex-1 flex-row items-center">
                        <Ionicons name="information-circle-outline" size={24} color="#05AF31" />
                        <View className="ml-3 flex-1">
                          <Text className="font-medium text-text">Status</Text>
                          <Text
                            className="font-medium"
                            style={{ color: getStatusMotoInfo(motoEncontrada.statusMoto).cor }}
                          >
                            {getStatusMotoInfo(motoEncontrada.statusMoto).nome}
                          </Text>
                        </View>
                      </View>

                      {/* Setor */}
                      <View className="flex-1 flex-row items-center">
                        <Ionicons name="location-outline" size={24} color="#05AF31" />
                        <View className="ml-3 flex-1">
                          <Text className="font-medium text-text">Setor</Text>
                          {motoEncontrada.setor ? (
                            <Text className="font-bold text-lg text-primary">
                              {motoEncontrada.setor}
                            </Text>
                          ) : (
                            <View>
                              {motoEncontrada.statusMoto === "DISPONIVEL" ? (
                                <>
                                  <Text className="font-medium text-orange-600 text-sm">
                                    Não alocada
                                  </Text>
                                  <Text className="text-muted text-xs">
                                    Clique em "Alocar em Setor"
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Text className="font-medium text-orange-600 text-sm">
                                    Indisponível
                                  </Text>
                                  <Text className="text-muted text-xs">
                                    Mude status para "Disponível"
                                  </Text>
                                </>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>                  {/* Botões para ações da moto */}
                  {motoEncontrada.setor && motoEncontrada.statusMoto === "DISPONIVEL" ? (
                    // Moto disponível e alocada - 3 botões
                    <View className="mt-6 flex-row gap-2">
                      <TouchableOpacity
                        className="h-16 flex-1 items-center justify-center rounded-xl bg-purple-500 px-2"
                        onPress={abrirModalEditarStatus}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="create-outline" size={20} color="#ffffff" />
                        <Text className="mt-1 font-semibold text-white text-xs text-center">Editar Status</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="h-16 flex-1 items-center justify-center rounded-xl bg-orange-500 px-2"
                        onPress={abrirModalAlocacao}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="swap-horizontal-outline" size={20} color="#ffffff" />
                        <Text className="mt-1 font-semibold text-white text-xs text-center">Editar Setor</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="h-16 flex-1 items-center justify-center rounded-xl bg-blue-500 px-2"
                        onPress={() => router.navigate(`/(drawer)/setor/${motoEncontrada.setor}`)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="navigate-outline" size={20} color="#ffffff" />
                        <Text className="mt-1 font-semibold text-white text-xs text-center">Abrir Setor</Text>
                      </TouchableOpacity>
                    </View>
                  ) : motoEncontrada.setor ? (
                    // Moto alocada mas não disponível - só abrir setor
                    <TouchableOpacity
                      className="mt-6 h-12 items-center justify-center rounded-xl bg-blue-500"
                      onPress={() => router.navigate(`/(drawer)/setor/${motoEncontrada.setor}`)}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="navigate-outline" size={20} color="#ffffff" />
                        <Text className="ml-2 font-semibold text-white">Abrir Setor</Text>
                      </View>
                    </TouchableOpacity>
                  ) : motoEncontrada.statusMoto === "DISPONIVEL" ? (
                    // Moto disponível mas não alocada - editar status e alocar em setor
                    <View className="mt-6 flex-row gap-2">
                      <TouchableOpacity
                        className="h-16 flex-1 items-center justify-center rounded-xl bg-purple-500 px-2"
                        onPress={abrirModalEditarStatus}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="create-outline" size={20} color="#ffffff" />
                        <Text className="mt-1 font-semibold text-white text-xs text-center">Editar Status</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="h-16 flex-1 items-center justify-center rounded-xl bg-orange-500 px-2"
                        onPress={abrirModalAlocacao}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
                        <Text className="mt-1 font-semibold text-white text-xs text-center">Alocar em Setor</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Moto não disponível e não alocada - editar status
                    <TouchableOpacity
                      className="mt-6 h-12 items-center justify-center rounded-xl bg-purple-500"
                      onPress={abrirModalEditarStatus}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="create-outline" size={20} color="#ffffff" />
                        <Text className="ml-2 font-semibold text-white">Editar Status</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Estado inicial */}
              {!motoEncontrada && !erroMensagem && !isLoading && (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name="search-circle-outline" size={80} color="#9ca3af" />
                  <Text className="mt-4 font-semibold text-muted">
                    {tipoBusca === "placa"
                      ? "Digite uma placa para buscar"
                      : tipoBusca === "rastreador"
                      ? "Digite um código de rastreador para buscar"
                      : "Selecione um tipo de moto para buscar"}
                  </Text>
                  <Text className="text-center text-muted text-sm">
                    {tipoBusca === "tipo"
                      ? "A busca retornará a moto com entrada mais antiga deste tipo."
                      : "A busca retornará a moto e sua localização atual."}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
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
              <Text className="ml-3 font-bold text-text text-xl">Alocar em Setor</Text>
            </View>

            <Text className="mb-4 text-center text-muted">
              Define o setor da moto{" "}
              <Text className="font-bold text-primary">{motoEncontrada?.placa}</Text>
            </Text>

            {/* Dropdown Setor */}
            <View className="mb-6">
              <Text className="mb-2 font-medium text-text">Setor *</Text>
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
                  theme === "dark" && { backgroundColor: "#222222" },
                  { zIndex: 10 },
                ]}
                dropDownContainerStyle={[
                  styles.opcoesDropdown,
                  theme === "dark" && { backgroundColor: "#222222" },
                  { zIndex: 10 },
                ]}
                textStyle={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
                placeholderStyle={{
                  color: theme === "dark" ? "#cccccc" : "#666666",
                }}
                disabled={opcoesSetor.length === 0}
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

      {/* Modal de Edição de Status */}
      <Modal
        visible={modalStatusVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={fecharModalEditarStatus}
      >
        <View className="flex-1 justify-center bg-black/50 px-6">
          <View className="rounded-xl bg-card p-6 shadow-lg">
            <View className="mb-4 flex-row items-center justify-center">
              <Ionicons name="create" size={32} color="#05AF31" />
              <Text className="ml-3 font-bold text-text text-xl">Editar Status</Text>
            </View>

            <Text className="mb-4 text-center text-muted">
              Altere o status da moto{" "}
              <Text className="font-bold text-primary">{motoEncontrada?.placa}</Text>
            </Text>

            {/* Dropdown Status */}
            <View className="mb-6">
              <Text className="mb-2 font-medium text-text">Novo Status *</Text>
              <DropDownPicker
                open={openStatus}
                value={novoStatus}
                items={opcoesStatus}
                setOpen={setOpenStatus}
                setValue={setNovoStatus}
                setItems={setOpcoesStatus}
                placeholder="Selecione o novo status da moto"
                style={[
                  styles.dropdown,
                  theme === "dark" && { backgroundColor: "#222222" },
                  { zIndex: 10 },
                ]}
                dropDownContainerStyle={[
                  styles.opcoesDropdown,
                  theme === "dark" && { backgroundColor: "#222222" },
                  { zIndex: 10 },
                ]}
                textStyle={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
                placeholderStyle={{
                  color: theme === "dark" ? "#cccccc" : "#666666",
                }}
                disabled={opcoesStatus.length === 0}
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="h-12 flex-1 items-center justify-center rounded-xl bg-gray-500"
                onPress={fecharModalEditarStatus}
                activeOpacity={0.8}
                disabled={isEditandoStatus}
              >
                <Text className="font-semibold text-white">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`h-12 flex-1 items-center justify-center rounded-xl ${
                  isEditandoStatus ? "bg-gray-400" : "bg-primary"
                }`}
                onPress={editarStatusMoto}
                activeOpacity={0.8}
                disabled={isEditandoStatus}
              >
                {isEditandoStatus ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="font-semibold text-white">Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
