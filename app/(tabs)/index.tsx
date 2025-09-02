import { Operador, PatioInfoPosicoes } from "../../interfaces/interfaces";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { buscarDadosOperadorLogado } from "../../api/operador";
import { buscarPatioPorId } from "../../api/patio";

export default function HomeScreen() {
  const [operador, setOperador] = useState<Operador | null>();
  const [patioInfo, setPatioInfo] = useState<PatioInfoPosicoes | null>();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await buscarDadosOperadorLogado();
      setOperador(response.error ? null : (response.data as Operador));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPatio = async () => {
      if (operador?.patio.id) {
        const response = await buscarPatioPorId(operador.patio.id);
        setPatioInfo(response.data);
      }
    };
    fetchPatio();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#f9f9f9] dark:bg-[#333] px-5 pt-[100px]">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-[24px] font-semibold mb-2 text-[#05AF31]">
            Olá, {operador?.nome.split(" ")[0]}
          </Text>
          <Text className="text-[18px] text-[#333] dark:text-[#ccc]">
            {operador?.patio.apelido}
          </Text>
          <Text className="text-[16px] text-[#333] dark:text-[#ccc] mb-6">
            {`${operador?.patio.logradouro}, `}
            {operador?.patio.numero}
          </Text>
        </View>
        <View className="flex-row items-center gap-8">
          <Ionicons
            name={theme == "light" ? "moon-outline" : "sunny-outline"}
            size={theme == "light" ? 30 : 35}
            color={theme == "light" ? "#333" : "#ccc"}
            onPress={toggleTheme}
          />
          <Ionicons
            className="mr-2"
            name={"person-circle-outline"}
            size={38}
            color={theme == "light" ? "#333" : "#ccc"}
            onPress={() => {
              router.push("/perfil");
            }}
          />
        </View>
      </View>

      <View className="gap-5 mt-6 mb-6">
        <View className="bg-[#05AF31] p-5 rounded-xl shadow-md">
          <Text className="text-white dark:text-[#ddd] text-[16px] mb-2">Motos no Pátio</Text>
          <Text className="text-white dark:text-[#ddd] text-[24px] font-bold">
            {patioInfo?.posicoesOcupadas} / {patioInfo?.capacidadeMax}
          </Text>
        </View>

        <View className="bg-[#05AF31] p-5 rounded-xl shadow-md">
          <Text className="text-white dark:text-[#ddd] text-[16px] mb-2">Posições Disponíveis</Text>
          <Text className="text-white dark:text-[#ddd] text-[24px] font-bold">
            {patioInfo?.posicoesDisponiveis}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
