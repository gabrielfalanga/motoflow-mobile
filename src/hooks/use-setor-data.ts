import { useAuth } from "@/context/auth-context";
import { useNotification } from "@/context/notification-context";
import { request } from "@/helper/request";
import type { SetorDetalhado } from "@/interfaces/interfaces";
import { checkAndNotifyOccupancy, notifySetorFull } from "@/services/notification";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useSetorData(setor: string) {
  const [data, setData] = useState<SetorDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>("");
  const { token, patioId } = useAuth();
  const { isEnabled, notifiedSetores, addNotifiedSetor } = useNotification();

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!token || !patioId || !setor) return;

      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const response = await request<SetorDetalhado>(
          `/posicoes/${patioId}/${setor}`,
          "get",
          null,
          {
            authToken: token,
          }
        );
        setData(response);
        setError("");

        // Verificar ocupação e notificar se necessário
        if (isEnabled && response) {
          const ocupacao = Math.round((response.ocupadas / response.vagasTotais) * 100);

          // Notificar se >= 80%
          const notified = await checkAndNotifyOccupancy(
            response.setor,
            response.ocupadas,
            response.vagasTotais,
            notifiedSetores
          );

          if (notified) {
            addNotifiedSetor(`${response.setor}-${ocupacao}`);
          }

          // Notificação especial se atingir 100%
          if (ocupacao === 100 && !notifiedSetores.has(`${response.setor}-full`)) {
            await notifySetorFull(response.setor);
            addNotifiedSetor(`${response.setor}-full`);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar dados do setor:", err);
        setError("Erro ao carregar dados do setor");
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [token, patioId, setor, isEnabled, notifiedSetores, addNotifiedSetor]
  );

  useFocusEffect(
    useCallback(() => {
      if (token && patioId && setor) {
        fetchData();
      }
    }, [token, patioId, setor, fetchData])
  );

  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const getMotoPorId = useCallback(
    (id: number) => {
      return data?.motos.find((moto) => moto.id === id);
    },
    [data]
  );
  const getEstatisticas = useCallback(() => {
    if (!data)
      return {
        ocupadas: 0,
        disponiveis: 0,
        vagasTotais: 0,
        taxaOcupacao: 0,
      };

    return {
      ocupadas: data.ocupadas,
      disponiveis: data.disponiveis,
      vagasTotais: data.vagasTotais,
      taxaOcupacao: Math.round((data.ocupadas / data.vagasTotais) * 100),
    };
  }, [data]);

  const getMotos = useCallback(() => {
    return data?.motos || [];
  }, [data]);

  return {
    data,
    loading,
    refreshing,
    error,
    refresh,
    getMotoPorId,
    getEstatisticas,
    getMotos,
  };
}
