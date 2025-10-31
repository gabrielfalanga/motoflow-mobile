import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface PatioSummaryProps {
  ocupadas: number;
  capacidadeMax: number;
  disponiveis: number;
  apelido?: string;
}

export function PatioSummary({ ocupadas, capacidadeMax, disponiveis, apelido }: PatioSummaryProps) {
  const { t } = useTranslation();

  const calculateOccupancyPercentage = () => {
    if (capacidadeMax === 0) return 0;
    return Math.round((ocupadas / capacidadeMax) * 100);
  };

  const getOccupancyStatus = () => {
    const percentage = calculateOccupancyPercentage();
    if (percentage >= 90) return { status: t("patio.critical"), color: "#ef4444" };
    if (percentage >= 70) return { status: t("patio.high"), color: "#f59e0b" };
    if (percentage >= 40) return { status: t("patio.medium"), color: "#05AF31" };
    return { status: t("patio.low"), color: "#05AF31" };
  };

  const occupancyData = getOccupancyStatus();

  return (
    <View className="rounded-xl bg-card p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="font-bold text-lg text-text">{t("patio.patioStatus")}</Text>
          {apelido && <Text className="text-muted text-sm">{apelido}</Text>}
        </View>
        <Ionicons name="analytics-outline" size={24} color="#05AF31" />
      </View>

      <View className="mb-4 flex-row items-end justify-between">
        <View>
          <Text className="font-bold text-3xl text-primary">{ocupadas}</Text>
          <Text className="text-muted">
            {t("patio.of")} {capacidadeMax} {t("patio.positions")}
          </Text>
        </View>

        <View className="items-end">
          <Text className="font-bold text-2xl" style={{ color: occupancyData.color }}>
            {calculateOccupancyPercentage()}%
          </Text>
          <Text className="text-muted">{occupancyData.status}</Text>
        </View>
      </View>
    </View>
  );
}
