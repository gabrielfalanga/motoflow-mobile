import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface SetorPatio {
  setor: string;
}

interface PatioSetoresGridProps {
  setores?: SetorPatio[];
}

export function PatioSetoresGrid({ setores: setoresProp }: PatioSetoresGridProps) {
  const [setores, setSetores] = useState<SetorPatio[]>(setoresProp || []);
  const [loading, setLoading] = useState(false);
  const { token, patioId } = useAuth();

  const fetchSetores = useCallback(async () => {
    if (!token || !patioId) return;

    try {
      setLoading(true);
      const response = await request<SetorPatio[]>(`/posicoes/${patioId}`, "get", null, {
        authToken: token,
      });
      setSetores(response || []);
    } catch (error) {
      console.error("Erro ao buscar setores:", error);
    } finally {
      setLoading(false);
    }
  }, [token, patioId]);

  useEffect(() => {
    if (!setoresProp) {
      fetchSetores();
    }
  }, [fetchSetores, setoresProp]);

  const handleSetorPress = (setor: string) => {
    router.navigate(`/setor/${setor}`);
  };

  if (!setores || setores.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <View className="rounded-xl bg-card p-5 shadow-sm">
        <View className="mb-4 flex-row items-center">
          <Ionicons name="grid-outline" size={20} color="#05AF31" />
          <Text className="ml-2 font-bold text-text">Setores do Pátio</Text>
        </View>
        <View className="items-center py-4">
          <ActivityIndicator size="small" color="#05AF31" />
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6 rounded-xl bg-card p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="grid-outline" size={24} color="#05AF31" />
          <Text className="ml-2 font-semibold text-lg text-text">Setores do Pátio</Text>
        </View>
        <View className="rounded-full bg-primary/10 px-3 py-1">
          <Text className="font-medium text-primary text-sm">
            {setores.length} {setores.length > 1 ? "setores" : "setor"}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {setores.map((item: SetorPatio) => {
          return (
            <TouchableOpacity
              key={item.setor}
              className="min-w-20 rounded-lg bg-primary p-3 shadow-sm"
              onPress={() => handleSetorPress(item.setor)}
              activeOpacity={0.7}
            >
              <Text className="text-center font-semibold text-white">{item.setor}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
