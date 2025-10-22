import { NotificationCard } from "@/components/notification-card";
import { PatioSetoresGrid } from "@/components/patio-setores-grid";
import { PatioSummary } from "@/components/patio-summary";
import { QuickActionCard } from "@/components/quick-action-card";
import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { Operador, PatioInfo } from "@/interfaces/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
}

export default function HomeScreen() {
  const [operador, setOperador] = useState<Operador | null>(null);
  const [patioInfo, setPatioInfo] = useState<PatioInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erroOperador, setErroOperador] = useState<string>("");
  const [erroPatio, setErroPatio] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { token, patioId } = useAuth();
  const { t } = useTranslation();

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!token) return;

      if (isRefresh) setRefreshing(true);

      try {
        setLoading(!isRefresh);

        const [operadorResponse, patioResponse] = await Promise.all([
          request<Operador>("/operador/me", "get", null, {
            authToken: token,
          }),
          request<PatioInfo>(`/patio/${patioId}`, "get", null, {
            authToken: token,
          }),
        ]);

        setOperador(operadorResponse);
        setPatioInfo(patioResponse);
        setErroOperador("");
        setErroPatio("");

        // Criar notificações baseadas no status do pátio
        const newNotifications: Notification[] = [];
        if (patioResponse) {
          const occupancyPercentage =
            (patioResponse.quantidadeOcupadas / patioResponse.capacidadeMax) * 100;

          if (occupancyPercentage >= 90) {
            newNotifications.push({
              id: "high-occupancy",
              title: t("home.patioAlmostFull"),
              message: `${Math.round(occupancyPercentage)}% ${t("home.patioAlmostFullMessage")}`,
              type: "warning",
            });
          }

          if (patioResponse.quantidadeDisponiveis <= 5) {
            newNotifications.push({
              id: "low-space",
              title: t("home.fewPositionsAvailable"),
              message: t("home.fewPositionsMessage", { count: patioResponse.quantidadeDisponiveis }),
              type: "info",
            });
          }
        }
        setNotifications(newNotifications);
      } catch (error) {
        setErroOperador(t("home.errorLoadingOperator"));
        setErroPatio(t("home.errorLoadingPatio"));
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [token, patioId]
  );

  useFocusEffect(
    useCallback(() => {
      if (token && patioId) {
        fetchData();
      }
    }, [token, patioId, fetchData])
  );

  const onRefresh = () => {
    fetchData(true);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.goodMorning");
    if (hour < 18) return t("home.goodAfternoon");
    return t("home.goodEvening");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-text">{t("home.loadingInfo")}</Text>
      </View>
    );
  }

  if (!operador) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Ionicons name="person-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-4 font-semibold text-red-600">{t("home.operatorNotFound")}</Text>
        <Text className="text-muted">{t("home.checkConnection")}</Text>
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
            onRefresh={onRefresh}
            colors={["#05AF31"]}
            tintColor="#05AF31"
          />
        }
      >
        {/* Header de boas-vindas */}
        <View className="mt-4 mb-6">
          <Text className="mb-1 text-muted">
            {getGreeting()}, {operador.nome.split(" ")[0]}!
          </Text>
          <Text className="font-bold text-2xl text-primary">{t("home.title")}</Text>
          <View className="mt-2 flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="ml-1 text-muted">
              {patioInfo?.apelido} • {patioInfo?.endereco.cidade}
            </Text>
          </View>
        </View>

        {/* Notificações */}
        {notifications.length > 0 && (
          <View className="mb-6 gap-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                onDismiss={() => dismissNotification(notification.id)}
              />
            ))}
          </View>
        )}

        {/* Erros */}
        {(erroOperador || erroPatio) && (
          <View className="mb-4 gap-2">
            {erroOperador && (
              <NotificationCard title="Erro no Operador" message={erroOperador} type="error" />
            )}
            {erroPatio && (
              <NotificationCard title="Erro no Pátio" message={erroPatio} type="error" />
            )}
          </View>
        )}

        {/* Resumo do Pátio */}
        {patioInfo && (
          <View className="mb-6">
            <PatioSummary
              ocupadas={patioInfo.quantidadeOcupadas}
              capacidadeMax={patioInfo.capacidadeMax}
              disponiveis={patioInfo.quantidadeDisponiveis}
              apelido={patioInfo.apelido}
            />
          </View>
        )}

        {/* Ações Rápidas */}
        <View className="mb-6">
          <Text className="mb-4 font-bold text-lg text-text">{t("home.quickActions")}</Text>
          <View className="gap-3">
            {/* Primeira linha */}
            <View className="flex-row gap-3">
              <QuickActionCard
                title={t("home.registerMoto")}
                subtitle={t("home.addNewMoto")}
                iconName="add-circle-outline"
                route="/moto/cadastro-moto"
                color="#05AF31"
              />
              <QuickActionCard
                title={t("home.searchMoto")}
                subtitle={t("home.locateMoto")}
                iconName="search-outline"
                route="/moto/busca-moto"
                color="#3b82f6"
              />
            </View>

            {/* Segunda linha */}
            <View className="flex-row gap-3">
              <QuickActionCard
                title={t("home.viewPatio")}
                subtitle={t("home.fullDetails")}
                iconName="grid-outline"
                route="/patio"
                color="#8b5cf6"
              />
              <QuickActionCard
                title={t("home.viewSetores")}
                subtitle={t("home.seeAllSetores")}
                iconName="map-outline"
                route="/setores"
                color="#f59e0b"
              />
            </View>
          </View>
        </View>

        {/* Setores Rápidos */}
        <View className="mb-6">
          <Text className="mb-4 font-bold text-lg text-text">{t("home.quickAccessSetores")}</Text>
          <PatioSetoresGrid />
        </View>

        {/* Footer de atualização */}
        <View className="items-center pb-8">
          <Text className="text-muted text-xs">
            {t("common.lastUpdate")}: {new Date().toLocaleTimeString()}
          </Text>
          <Text className="text-muted text-xs">{t("common.pullToRefresh")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
