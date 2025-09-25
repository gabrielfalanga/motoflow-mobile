import type { Moto } from "@/interfaces/interfaces";
import { useAuth } from "@/context/auth-context";
import { request, RequestError } from "@/helper/request";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface MotoDetailsModalProps {
  visible: boolean;
  moto?: Moto & { id: number };
  setor?: string;
  vaga?: number;
  onClose: () => void;
  onMotoUpdated?: () => void;
}

export function MotoDetailsModal({
  visible,
  moto,
  setor,
  vaga,
  onClose,
  onMotoUpdated,
}: MotoDetailsModalProps) {
  const { token, patioId } = useAuth();
  const [isLoadingManutencao, setIsLoadingManutencao] = useState(false);
  const [isLoadingAluguel, setIsLoadingAluguel] = useState(false);

  // Estados do modal de mudança de setor
  const [modalMudarSetorVisible, setModalMudarSetorVisible] = useState(false);
  const [isMudandoSetor, setIsMudandoSetor] = useState(false);
  // Estados do dropdown de setor
  const [openSetorMudanca, setOpenSetorMudanca] = useState(false);
  const [novoSetor, setNovoSetor] = useState<string | null>(null);
  const [opcoesSetor, setOpcoesSetor] = useState<Array<{ label: string; value: string }>>([]);

  // Estados do modal de rastreador
  const [modalRastreadorVisible, setModalRastreadorVisible] = useState(false);
  const [isEditandoRastreador, setIsEditandoRastreador] = useState(false);
  const [novoCodRastreador, setNovoCodRastreador] = useState<string>("");

  // Buscar setores quando o modal abrir
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
      if (visible) {
        fetchSetores();
      }
    }, [patioId, token, visible])
  );
  const getStatusColor = () => {
    if (!moto) return "#6b7280";

    switch (moto.statusMoto) {
      case "DISPONIVEL":
        return "#05AF31";
      default:
        return "#6b7280";
    }
  };

  const getTipoMotoInfo = () => {
    if (!moto) return { name: "Vazia", icon: "add-circle-outline", color: "#6b7280" };

    switch (moto.tipoMoto) {
      case "MOTTU_E":
        return { name: "Mottu E (Elétrica)", icon: "flash", color: "#3b82f6" };
      case "MOTTU_SPORT":
        return { name: "Mottu Sport (Esportiva)", icon: "speedometer", color: "#ef4444" };
      case "MOTTU_POP":
        return { name: "Mottu Pop (Popular)", icon: "bicycle", color: "#8b5cf6" };
      default:
        return { name: "Desconhecido", icon: "help-circle", color: "#6b7280" };
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

  const tipoMotoInfo = getTipoMotoInfo();
  const statusColor = getStatusColor();

  const levarParaManutencao = async () => {
    if (!moto?.placa || !token) {
      Alert.alert("Erro", "Dados da moto não encontrados.");
      return;
    }

    Alert.alert("Confirmação", "Tem certeza que deseja levar esta moto para manutenção?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: async () => {
          setIsLoadingManutencao(true);

          try {
            await request(
              `/motos/${moto.placa}`,
              "patch",
              { status: "MANUTENCAO" },
              { authToken: token }
            );

            Alert.alert("Sucesso", "Moto enviada para manutenção com sucesso!");
            onClose();

            // Atualizar a página
            if (onMotoUpdated) {
              onMotoUpdated();
            }
          } catch (error) {
            console.error("Erro ao enviar moto para manutenção:", error);

            if (error instanceof RequestError) {
              Alert.alert("Erro", error.message);
            } else {
              Alert.alert("Erro", "Erro inesperado ao enviar moto para manutenção.");
            }
          } finally {
            setIsLoadingManutencao(false);
          }
        },
      },
    ]);
  };

  const marcarComoAlugada = async () => {
    if (!moto?.placa || !token) {
      Alert.alert("Erro", "Dados da moto não encontrados.");
      return;
    }

    Alert.alert("Confirmação", "Tem certeza que deseja marcar esta moto como alugada?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        onPress: async () => {
          setIsLoadingAluguel(true);

          try {
            await request(
              `/motos/${moto.placa}`,
              "patch",
              { status: "ALUGADA" },
              { authToken: token }
            );

            Alert.alert("Sucesso", "Moto marcada como alugada com sucesso!");
            onClose();

            // Atualizar a página
            if (onMotoUpdated) {
              onMotoUpdated();
            }
          } catch (error) {
            console.error("Erro ao marcar moto como alugada:", error);

            if (error instanceof RequestError) {
              Alert.alert("Erro", error.message);
            } else {
              Alert.alert("Erro", "Erro inesperado ao marcar moto como alugada.");
            }
          } finally {
            setIsLoadingAluguel(false);
          }
        },
      },
    ]);
  };

  const abrirModalMudarSetor = () => {
    setModalMudarSetorVisible(true);
  };

  const fecharModalMudarSetor = () => {
    setModalMudarSetorVisible(false);
    setNovoSetor(null);
  };

  const mudarSetor = async () => {
    if (!moto?.placa || !token || !patioId) return;

    // Validações
    if (!novoSetor) {
      Alert.alert("Erro", "Selecione o novo setor para a moto.");
      return;
    }

    if (novoSetor === setor) {
      Alert.alert("Aviso", "A moto já está no setor selecionado.");
      return;
    }

    setIsMudandoSetor(true);

    try {
      const body = {
        placa: moto.placa,
        setor: novoSetor,
      };

      await request(`/motos/alocacao/${patioId}`, "put", body, {
        authToken: token,
      });

      Alert.alert("Sucesso", `Moto realocada para o setor ${novoSetor} com sucesso!`, [
        {
          text: "OK",
          style: "default",
          onPress: () => {
            fecharModalMudarSetor();
            onClose();

            // Atualizar a página
            if (onMotoUpdated) {
              onMotoUpdated();
            }
          },
        },
        {
          text: `Ir para Setor ${novoSetor}`,
          style: "default",
          onPress: () => {
            fecharModalMudarSetor();
            onClose();

            // Atualizar a página
            if (onMotoUpdated) {
              onMotoUpdated();
            }

            // Navegar para o novo setor
            router.push(`/setor/${novoSetor}`);
          },
        },
      ]);
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado ao realocar a moto.";
      const errorTitle = "Erro na Realocação";

      if (error instanceof RequestError) {
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage, [{ text: "OK" }]);    } finally {
      setIsMudandoSetor(false);
    }
  };

  const abrirModalRastreador = () => {
    if (moto) {
      setNovoCodRastreador(moto.codRastreador || "");
      setModalRastreadorVisible(true);
    }
  };

  const fecharModalRastreador = () => {
    setModalRastreadorVisible(false);
    setNovoCodRastreador("");
  };
  const editarRastreador = async () => {
    if (!moto?.placa || !token) return;

    // Validações
    if (!novoCodRastreador.trim()) {
      Alert.alert("Erro", "Digite o código do rastreador.");
      return;
    }

    setIsEditandoRastreador(true);

    try {
      const body = {
        codRastreador: novoCodRastreador,
      };      await request(`/motos/beacon/${moto.placa}`, "put", body, {
        authToken: token,
      });

      // Atualizar o estado local da moto com o novo código do rastreador
      if (moto) {
        Object.assign(moto, { codRastreador: novoCodRastreador });
      }

      fecharModalRastreador();

      // Atualizar a página
      if (onMotoUpdated) {
        onMotoUpdated();
      }
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado ao atualizar o código do rastreador.";
      const errorTitle = "Erro na Atualização";

      if (error instanceof RequestError) {
        errorMessage = error.message;
      }

      Alert.alert(errorTitle, errorMessage, [{ text: "OK" }]);
    } finally {
      setIsEditandoRastreador(false);
    }
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="mx-4 w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
            {/* Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-bold text-text text-xl">Vaga {vaga}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {moto ? (
                <View className="gap-4">
                  {/* Status Badge */}
                  <View className="items-center">
                    <View
                      className="rounded-full px-4 py-2"
                      style={{ backgroundColor: statusColor }}
                    >
                      <Text className="font-semibold text-white">{moto.statusMoto}</Text>
                    </View>
                  </View>

                  {/* Tipo de Moto */}
                  <View className="rounded-xl bg-background p-4">
                    <View className="mb-2 flex-row items-center">
                      <Ionicons
                        name={tipoMotoInfo.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={tipoMotoInfo.color}
                      />
                      <Text className="ml-2 font-bold text-lg text-text">{tipoMotoInfo.name}</Text>
                    </View>
                  </View>

                  {/* Detalhes da Moto */}
                  <View className="rounded-xl bg-background p-4">
                    <View className="gap-3">
                      {/* Placa e Rastreador */}
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="albums-outline" size={16} color="#666" />
                          <Text className="ml-2 text-muted">Placa</Text>
                        </View>
                        <Text className="font-semibold text-text">{moto.placa}</Text>
                      </View>                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="radio-outline" size={16} color="#666" />
                          <Text className="ml-2 text-muted">Rastreador</Text>
                          <TouchableOpacity
                            className="ml-2 h-6 w-6 items-center justify-center rounded bg-blue-500"                            onPress={abrirModalRastreador}
                            activeOpacity={0.7}
                          >
                            <Ionicons 
                              name={moto.codRastreador ? "create-outline" : "add-outline"} 
                              size={14} 
                              color="#ffffff" 
                            />
                          </TouchableOpacity>
                        </View>
                        {moto.codRastreador ? (
                          <Text className="font-semibold text-text">{moto.codRastreador}</Text>
                        ) : (
                            <Text className="font-medium text-orange-600">
                              Sem rastreador
                            </Text>
                        )}
                      </View>

                      {/* Ano e Status */}
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="calendar-outline" size={16} color="#666" />
                          <Text className="ml-2 text-muted">Ano</Text>
                        </View>
                        <Text className="font-semibold text-text">{moto.ano}</Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="information-circle-outline" size={16} color="#666" />
                          <Text className="ml-2 text-muted">Status</Text>
                        </View>
                        <Text
                          className="font-semibold"
                          style={{ color: getStatusMotoInfo(moto.statusMoto).cor }}
                        >
                          {getStatusMotoInfo(moto.statusMoto).nome}
                        </Text>
                      </View>                    </View>
                  </View>
                  
                  {/* Botões de ação em linha */}
                  <View className="mt-2 flex-row gap-2">
                    <TouchableOpacity
                      className="h-16 flex-1 items-center justify-center rounded-xl bg-amber-500 px-2"
                      onPress={levarParaManutencao}
                      disabled={isLoadingManutencao || isLoadingAluguel}
                    >
                      {isLoadingManutencao ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <>
                          <Ionicons name="build-outline" size={18} color="#ffffff" />
                          <Text className="mt-1 font-semibold text-white text-xs text-center">
                            Manutenção
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="h-16 flex-1 items-center justify-center rounded-xl bg-blue-500 px-2"
                      onPress={marcarComoAlugada}
                      disabled={isLoadingAluguel || isLoadingManutencao}
                    >
                      {isLoadingAluguel ? (
                        <ActivityIndicator color="#ffffff" size="small" />
                      ) : (
                        <>
                          <Ionicons name="exit-outline" size={18} color="#ffffff" />
                          <Text className="mt-1 font-semibold text-white text-xs text-center">
                            Alugar
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="h-16 flex-1 items-center justify-center rounded-xl bg-purple-500 px-2"
                      onPress={abrirModalMudarSetor}
                      disabled={isLoadingManutencao || isLoadingAluguel || isMudandoSetor}
                    >
                      <Ionicons name="swap-horizontal-outline" size={18} color="#ffffff" />
                      <Text className="mt-1 font-semibold text-white text-xs text-center">
                        Mudar Setor
                      </Text>
                    </TouchableOpacity>                  </View>
                  
                  {/* Botão de Rastrear Moto - só aparece se tiver rastreador e setor */}
                  {moto.codRastreador && setor && (
                    <TouchableOpacity
                      className="mt-3 h-16 w-full items-center justify-center rounded-xl bg-green-600"
                      onPress={() => {
                        // Função de rastreamento será implementada
                        console.log("Rastreando moto...");
                      }}
                      activeOpacity={0.8}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="location" size={24} color="#ffffff" />
                        <Text className="ml-2 font-semibold text-lg text-white">Rastrear Moto</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View className="items-center py-8">
                  <Ionicons name="add-circle-outline" size={64} color="#6b7280" />
                  <Text className="mt-4 font-bold text-lg text-text">Vaga Vazia</Text>
                  <Text className="text-muted">Nenhuma moto estacionada nesta vaga</Text>

                  <TouchableOpacity
                    className="mt-6 rounded-xl bg-primary p-4"
                    onPress={() => {
                      onClose();
                      router.push({
                        pathname: "/moto/cadastro-moto",
                        params: { setor },
                      });
                    }}
                  >
                    <Text className="text-center font-semibold text-white">Adicionar Moto</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Mudança de Setor */}
      <Modal
        visible={modalMudarSetorVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={fecharModalMudarSetor}
      >
        <View className="flex-1 justify-center bg-black/50 px-6">
          <View className="rounded-xl bg-card p-6 shadow-lg">
            <View className="mb-4 flex-row items-center justify-center">
              <Ionicons name="swap-horizontal" size={32} color="#8b5cf6" />
              <Text className="ml-3 font-bold text-text text-xl">Mudar Setor</Text>
            </View>

            <Text className="mb-4 text-center text-muted">
              Mover a moto <Text className="font-bold text-primary">{moto?.placa}</Text> do setor{" "}
              <Text className="font-bold text-primary">{setor}</Text> para outro setor
            </Text>

            {/* Dropdown Setor */}
            <View className="mb-6">
              <Text className="mb-2 font-medium text-text">Novo Setor *</Text>
              <DropDownPicker
                open={openSetorMudanca}
                value={novoSetor}
                items={opcoesSetor.filter((opcao) => opcao.value !== setor)}
                setOpen={setOpenSetorMudanca}
                setValue={setNovoSetor}
                setItems={setOpcoesSetor}
                placeholder="Selecione o novo setor"
                style={[styles.dropdown, { zIndex: 10 }]}
                dropDownContainerStyle={[styles.opcoesDropdown, { zIndex: 10 }]}
                disabled={opcoesSetor.length === 0}
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="h-12 flex-1 items-center justify-center rounded-xl bg-gray-500"
                onPress={fecharModalMudarSetor}
                activeOpacity={0.8}
                disabled={isMudandoSetor}
              >
                <Text className="font-semibold text-white">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`h-12 flex-1 items-center justify-center rounded-xl ${
                  isMudandoSetor ? "bg-gray-400" : "bg-purple-500"
                }`}
                onPress={mudarSetor}
                activeOpacity={0.8}
                disabled={isMudandoSetor}
              >
                {isMudandoSetor ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="font-semibold text-white">Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>      </Modal>

      {/* Modal de Edição de Rastreador */}
      <Modal
        visible={modalRastreadorVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={fecharModalRastreador}
      >
        <View className="flex-1 justify-center bg-black/50 px-6">
          <View className="rounded-xl bg-card p-6 shadow-lg">
            <View className="mb-4 flex-row items-center justify-center">
              <Ionicons name="radio" size={32} color="#3b82f6" />
              <Text className="ml-3 font-bold text-text text-xl">
                {moto?.codRastreador ? "Editar Rastreador" : "Adicionar Rastreador"}
              </Text>
            </View>

            <Text className="mb-4 text-center text-muted">
              {moto?.codRastreador ? "Altere" : "Defina"} o código do rastreador da moto{" "}
              <Text className="font-bold text-primary">{moto?.placa}</Text>
            </Text>

            {/* Campo Código do Rastreador */}
            <View className="mb-6">
              <Text className="mb-2 font-medium text-text">Código do Rastreador *</Text>
              <TextInput
                placeholder="Ex: ABC123XYZ"
                className="h-14 w-full rounded-xl border border-secondary bg-card px-4 text-text"
                placeholderTextColor="#666666"
                value={novoCodRastreador}
                onChangeText={setNovoCodRastreador}
                autoCapitalize="characters"
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="h-12 flex-1 items-center justify-center rounded-xl bg-gray-500"
                onPress={fecharModalRastreador}
                activeOpacity={0.8}
                disabled={isEditandoRastreador}
              >
                <Text className="font-semibold text-white">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`h-12 flex-1 items-center justify-center rounded-xl ${
                  isEditandoRastreador ? "bg-gray-400" : "bg-blue-500"
                }`}
                onPress={editarRastreador}
                activeOpacity={0.8}
                disabled={isEditandoRastreador}
              >
                {isEditandoRastreador ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="font-semibold text-white">Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
