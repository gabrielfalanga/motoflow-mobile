import { useAuth } from "@/context/auth-context";
import { request } from "@/helper/request";
import type { PatioInfo, Setor } from "@/interfaces/interfaces";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function usePatioData() {
  const [patioInfo, setPatioInfo] = useState<PatioInfo | null>(null);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>("");
  const { token, patioId } = useAuth();

  const fetchPatioData = useCallback(
    async (isRefresh = false) => {
      if (!token || !patioId) return;

      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const [patioResponse, setoresResponse] = await Promise.all([
          request<PatioInfo>(`/patio/${patioId}`, "get", null, {
            authToken: token,
          }),
          request<Setor[]>(`/posicoes/${patioId}`, "get", null, {
            authToken: token,
          }),
        ]);

        setPatioInfo(patioResponse);
        setSetores(setoresResponse || []);
        setError("");
      } catch (err) {
        console.error("Erro ao buscar dados do pátio:", err);
        setError("Houve um erro ao buscar os dados do pátio");
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
        fetchPatioData();
      }
    }, [token, patioId, fetchPatioData])
  );

  const refresh = useCallback(() => {
    fetchPatioData(true);
  }, [fetchPatioData]);

  const calculateOccupancyPercentage = useCallback(() => {
    if (!patioInfo) return 0;
    return Math.round((patioInfo.quantidadeOcupadas / patioInfo.capacidadeMax) * 100);
  }, [patioInfo]);

  return {
    patioInfo,
    setores,
    loading,
    refreshing,
    error,
    refresh,
    calculateOccupancyPercentage,
  };
}
