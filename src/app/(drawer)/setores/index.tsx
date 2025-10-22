import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { SetorInfo } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
import { LogBox } from "react-native";
import { useTranslation } from "react-i18next";

// ignorar todos os logs na tela
LogBox.ignoreAllLogs();

export default function SetoresScreen() {
  const [posicoes, setPosicoes] = useState<SetorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token, patioId } = useAuth();
  const { t } = useTranslation();

  const fetchSetores = useCallback(
    async (isRefresh = false) => {
      if (!token || !patioId) return;

      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const response = await request<SetorInfo[]>(`/posicoes/${patioId}`, "get", null, {
          authToken: token,
        });
        setPosicoes(response || []);
      } catch (error) {
        Alert.alert(t("common.error"), t("setor.errorLoadingSetores"));
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [token, patioId, t]
  );

  useFocusEffect(
    useCallback(() => {
      if (token && patioId) {
        fetchSetores();
      }
    }, [token, patioId, fetchSetores])
  );
  const handleAreaPress = (setor: SetorInfo) => {
    router.push(`/setor/${setor.setor}`);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-text">{t("setor.loadingSetores")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header fixo */}
      <View className="px-4 pt-6 pb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-bold text-2xl text-primary">{t("setor.title")}</Text>
            <Text className="text-muted">{t("setor.subtitle")}</Text>
          </View>

          {/* Botão de Cadastrar */}
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center rounded-xl bg-primary"
            onPress={() => router.navigate("/setores/cadastro-setor")}
            activeOpacity={0.8}
          >
            <Ionicons name="add-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ScrollView ocupando o restante do espaço */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchSetores(true)}
            colors={["#05AF31"]}
            tintColor="#05AF31"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Grid de Áreas */}
        <View className="gap-3">
          {posicoes.map((setor) => {
            return (
              <TouchableOpacity
                key={setor.setor}
                className="rounded-xl border border-primary bg-card p-4"
                onPress={() => handleAreaPress(setor)}
                activeOpacity={0.7}
              >
                <View>
                  {/* Header do Setor */}
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="font-bold text-xl text-text">Setor {setor.setor}</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#999" />
                  </View>{" "}
                  {/* Estatísticas das Vagas */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-muted text-sm">
                        {setor.vagasDisponiveis} {setor.vagasDisponiveis === 1 ? t("setor.free") : t("setor.freeP")}{" "}
                        • {setor.posicoesOcupadas}{" "}
                        {setor.posicoesOcupadas === 1 ? t("setor.occupied") : t("setor.occupiedP")} •{" "}
                        {setor.capacidadeSetor} {t("setor.total")}
                      </Text>
                    </View>
                  </View>
                  {/* Barra de Progresso Minimalista */}
                  <View className="mt-3">
                    <View className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <View
                        className="bg-gray-400 h-full rounded-full"
                        style={{
                          width:
                            setor.capacidadeSetor > 0
                              ? `${(setor.posicoesOcupadas / setor.capacidadeSetor) * 100}%`
                              : "0%",
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Estado vazio */}
        {posicoes.length === 0 && (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="add-circle-outline" size={64} color="#05AF31" />
            <Text className="mt-4 font-semibold text-primary">Cadastrar Primeiro Setor</Text>
            <Text className="mb-6 text-center text-muted text-sm">
              Ainda não há setores configurados neste pátio
            </Text>

            <TouchableOpacity
              className="h-12 items-center justify-center rounded-xl bg-primary px-6"
              onPress={() => router.navigate("/setores/cadastro-setor")}
              activeOpacity={0.8}
            >
              <Text className="font-semibold text-white">Cadastrar Setor</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View className="items-center pt-6">
          <Text className="text-muted text-xs">
            Total de {posicoes.length}{" "}
            {posicoes.length !== 1 ? "setores cadastrados" : "setor cadastrado"}
          </Text>
          <Text className="text-muted text-xs">Puxe para baixo para atualizar</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
