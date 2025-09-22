import { NotificationCard } from "@/components/notification-card";
import { PatioDetailsCard } from "@/components/patio-details-card";
import { PatioHeader } from "@/components/patio-header";
import { PatioSetoresGrid } from "@/components/patio-setores-grid";
import { PatioStatsCards } from "@/components/patio-stats-cards";
import { PatioSummary } from "@/components/patio-summary";
import { usePatioData } from "@/hooks/use-patio-data";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatioScreen() {
  const {
    patioInfo,
    posicoesHorizontais,
    loading,
    refreshing,
    error,
    refresh,
    calculateOccupancyPercentage,
  } = usePatioData();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-text">Carregando informações do pátio...</Text>
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
        {/* Header do Pátio */}
        <PatioHeader apelido={patioInfo?.apelido} endereco={patioInfo?.endereco} />

        {/* Mensagem de erro */}
        {error && (
          <View className="mb-4">
            <NotificationCard title="Erro ao carregar dados" message={error} type="error" />
          </View>
        )}

        {patioInfo && (
          <>
            {/* Resumo Principal */}
            <View className="mb-6">
              <PatioSummary
                ocupadas={patioInfo.posicoesOcupadas}
                capacidadeMax={patioInfo.capacidadeMax}
                disponiveis={patioInfo.posicoesDisponiveis}
                apelido={patioInfo.apelido}
              />
            </View>

            {/* Cards de Estatísticas */}
            <View className="mb-6">
              <PatioStatsCards
                posicoesDisponiveis={patioInfo.posicoesDisponiveis}
                posicoesOcupadas={patioInfo.posicoesOcupadas}
              />
            </View>

            {/* Detalhes do Pátio */}
            <PatioDetailsCard
              capacidadeMax={patioInfo.capacidadeMax}
              area={patioInfo.area}
              cep={patioInfo.endereco?.cep}
              occupancyPercentage={calculateOccupancyPercentage()}
            />
          </>
        )}

        {/* Grid de Setores */}
        <PatioSetoresGrid />

        {/* Footer */}
        <View className="items-center pb-8">
          <Text className="text-muted text-sm">Puxe para baixo para atualizar</Text>
          <Text className="text-muted text-xs">
            Última atualização: {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
