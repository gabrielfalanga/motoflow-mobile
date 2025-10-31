import { MotoDetailsModal } from "@/components/moto-details-modal";
import { NotificationCard } from "@/components/notification-card";
import { VagaPosicao } from "@/components/vaga-posicao";
import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import { useSetorData } from "@/hooks/use-setor-data";
import type { Moto } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function PosicaoHorizontalScreen() {
  const { setor } = useLocalSearchParams<{
    setor: string;
  }>();

  const { token, patioId } = useAuth();
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!setor) {
    router.back();
  }

  const { data, loading, refreshing, error, refresh, getEstatisticas, getMotos } =
    useSetorData(setor);

  const [selectedMoto, setSelectedMoto] = useState<(Moto & { id: number }) | undefined>();
  const [selectedPosition, setSelectedPosition] = useState<number | undefined>();
  const [modalVisible, setModalVisible] = useState(false);

  const handleVagaPress = (posicaoVertical: number, moto?: Moto & { id: number }) => {
    setSelectedMoto(moto);
    setSelectedPosition(posicaoVertical);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedMoto(undefined);
    setSelectedPosition(undefined);
  };

  const excluirSetor = async () => {
    if (!token || !patioId || !setor) return;

    Alert.alert(t("setor.deleteSetor"), t("setor.confirmDelete", { setor }), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await request(`/posicoes/${setor}/${patioId}`, "delete", null, {
              authToken: token,
            });

            Alert.alert(t("common.success"), t("setor.successDelete", { setor }), [
              {
                text: t("common.ok"),
                onPress: () => {
                  router.push("/setores/");
                },
              },
            ]);
          } catch (error) {
            console.error("Erro ao excluir setor:", error);
            Alert.alert(
              t("common.error"),
              error instanceof Error ? error.message : t("setor.errorDelete")
            );
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };
  const renderVagas = () => {
    if (!data) return null;

    const motos = getMotos();
    const elementos = [];

    // Renderizar as motos existentes
    motos.forEach((moto, index) => {
      elementos.push(
        <VagaPosicao
          key={`moto-${moto.id}`}
          posicaoVertical={index + 1}
          moto={{
            ...moto,
            posicaoHorizontal: data.setor,
            posicaoVertical: index + 1,
          }}
          onPress={(pos, motoData) => {
            handleVagaPress(pos, moto);
          }}
        />
      );
    }); // Adicionar card para adicionar nova moto (se houver vagas disponíveis)
    if (motos.length < data.vagasTotais) {
      elementos.push(
        <TouchableOpacity
          key="add-moto"
          className="relative m-1 min-h-24 min-w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3"
          onPress={() => router.push(`/moto/cadastro-moto?setor=${setor}`)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color="#999" />
          <Text className="mt-1 text-center text-xs text-gray-500">{t("setor.addMoto")}</Text>
        </TouchableOpacity>
      );
    }

    return elementos;
  };

  const stats = getEstatisticas();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-text">{t("setor.loadingPositions", { setor })}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#05AF31"]}
            tintColor="#05AF31"
          />
        }
      >
        {/* Header */}
        <View className="mt-4 mb-6">
          <View className="mb-3 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 rounded-full bg-card p-2"
            >
              <Ionicons name="arrow-back" size={24} color="#05AF31" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-bold text-2xl text-primary">
                {t("setor.title")} {setor}
              </Text>
              <Text className="text-muted">
                {stats.ocupadas} {t("patio.of")} {stats.vagasTotais} {t("setor.vagas")}{" "}
                {t("setor.occupiedP")}
              </Text>
            </View>
          </View>
        </View>
        {/* Error */}
        {error && (
          <View className="mb-4">
            <NotificationCard title="Erro" message={error} type="error" />
          </View>
        )}
        {/* Estatísticas */}
        {data && (
          <View className="mb-6">
            <Text className="mb-4 font-bold text-lg text-text">{t("setor.summary")}</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-xl bg-primary p-4">
                <View className="mb-2 flex-row items-center justify-between">
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text className="font-bold text-white text-xl">{stats.ocupadas}</Text>
                </View>
                <Text className="font-medium text-white/90">{t("setor.motosInSetor")}</Text>
              </View>

              <View className="flex-1 rounded-xl bg-blue-500 p-4">
                <View className="mb-2 flex-row items-center justify-between">
                  <Ionicons name="analytics" size={20} color="white" />
                  <Text className="font-bold text-white text-xl">{stats.taxaOcupacao}%</Text>
                </View>
                <Text className="font-medium text-white/90">{t("setor.occupancy")}</Text>
              </View>
            </View>
          </View>
        )}
        {/* Legenda */}
        <View className="mb-6 rounded-xl bg-card p-4">
          <Text className="mb-3 font-bold text-text">{t("setor.legend")}</Text>

          {/* Status das Vagas */}
          <View className="mb-4">
            <Text className="mb-2 font-medium text-sm text-text">{t("setor.vagasStatus")}</Text>
            <View className="gap-2">
              <View className="flex-row items-center">
                <View className="mr-3 size-4 rounded bg-primary" />
                <Text className="text-muted">{t("setor.availableVaga")}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-3 size-4 rounded bg-gray-300" />
                <Text className="text-muted">{t("setor.emptyVaga")}</Text>
              </View>
            </View>
          </View>

          {/* Tipos de Moto */}
          <View>
            <Text className="mb-2 font-medium text-sm text-text">{t("setor.motoTypes")}</Text>
            <View className="gap-2">
              <View className="flex-row items-center">
                <Ionicons name="flash" size={16} color="#05AF31" className="mr-3" />
                <Text className="ml-3 text-muted">{t("motoTypes.mottuEFull")}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="speedometer" size={16} color="#05AF31" className="mr-3" />
                <Text className="ml-3 text-muted">{t("motoTypes.mottuSportFull")}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="bicycle" size={16} color="#05AF31" className="mr-3" />
                <Text className="ml-3 text-muted">{t("motoTypes.mottuPopFull")}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Grid de Vagas */}
        <View className="mb-6">
          <Text className="mb-4 font-bold text-lg text-text">
            {t("setor.setorMap")} {setor}
          </Text>
          <View className="rounded-xl bg-card p-4">
            <View className="flex-row flex-wrap justify-center">{renderVagas()}</View>
          </View>
        </View>{" "}
        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-muted text-sm">{t("setor.touchVaga")}</Text>
          <Text className="text-muted text-xs">
            {t("common.lastUpdate")}: {new Date().toLocaleTimeString()}
          </Text>
        </View>
        {/* Botão de Excluir Setor */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            onPress={excluirSetor}
            disabled={isDeleting}
            className={`flex-row items-center justify-center rounded-xl border border-red-300 bg-red-50 p-4 ${
              isDeleting ? "opacity-50" : ""
            }`}
            activeOpacity={0.7}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#dc2626" className="mr-2" />
            ) : (
              <Ionicons name="trash-outline" size={20} color="#dc2626" className="mr-2" />
            )}
            <Text className="ml-2 font-semibold text-red-600">
              {isDeleting ? t("setor.deleting") : t("setor.deleteSetorButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Detalhes */}
      <MotoDetailsModal
        visible={modalVisible}
        moto={selectedMoto}
        setor={data?.setor || setor}
        vaga={selectedPosition}
        onClose={closeModal}
        onMotoUpdated={refresh}
      />
    </SafeAreaView>
  );
}
