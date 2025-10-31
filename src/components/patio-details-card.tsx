import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface PatioDetailsCardProps {
  capacidadeMax: number;
  area: number;
  cep?: string;
  occupancyPercentage: number;
}

export function PatioDetailsCard({
  capacidadeMax,
  area,
  cep,
  occupancyPercentage,
}: PatioDetailsCardProps) {
  const { t } = useTranslation();

  const details = [
    {
      label: t("patio.totalCapacity"),
      value: `${capacidadeMax} ${t("patio.positions")}`,
      icon: "resize-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: t("patio.patioArea"),
      value: `${area} m²`,
      icon: "square-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: t("patio.cep"),
      value: cep || "N/A",
      icon: "map-outline" as keyof typeof Ionicons.glyphMap,
    },
    {
      label: t("patio.occupationRate"),
      value: `${occupancyPercentage}%`,
      icon: "analytics-outline" as keyof typeof Ionicons.glyphMap,
    },
  ];

  return (
    <View className="mb-6 rounded-xl bg-card p-5 shadow-sm">
      <View className="mb-4 flex-row items-center">
        <Ionicons name="information-circle-outline" size={24} color="#05AF31" />
        <Text className="ml-2 font-semibold text-lg text-text">{t("patio.detailsTitle")}</Text>
      </View>

      <View className="gap-4">
        {details.map((detail) => (
          <View key={detail.label} className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name={detail.icon} size={16} color="#666" />
              <Text className="ml-2 text-muted">{detail.label}</Text>
            </View>
            <Text className="font-semibold text-text">{detail.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
