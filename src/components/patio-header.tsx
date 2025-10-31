import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface PatioHeaderProps {
  apelido?: string;
  endereco?: {
    logradouro: string;
    numero: string | number;
    cidade: string;
    siglaEstado: string;
  };
}

export function PatioHeader({ apelido, endereco }: PatioHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="mt-4 mb-6">
      <View className="mb-3 flex-row items-center">
        <Ionicons name="business-outline" size={28} color="#05AF31" />
        <Text className="ml-2 font-bold text-2xl text-primary">
          {apelido || t("patio.patioTitle")}
        </Text>
      </View>

      {endereco && (
        <View className="gap-1">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="ml-1 text-text">
              {endereco.logradouro}, {endereco.numero}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="map-outline" size={16} color="#666" />
            <Text className="ml-1 text-text">
              {endereco.cidade} - {endereco.siglaEstado}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
