import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"
import type { PatioInfo, PosicaoHorizontalPatio } from "@/interfaces/interfaces"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"

export function usePatioData() {
  const [patioInfo, setPatioInfo] = useState<PatioInfo | null>(null)
  const [posicoesHorizontais, setPosicoesHorizontais] = useState<
    PosicaoHorizontalPatio[]
  >([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string>("")
  const { token, patioId } = useAuth()

  const fetchPatioData = useCallback(
    async (isRefresh = false) => {
      if (!token || !patioId) return

      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      try {
        const [patioResponse, posicoesResponse] = await Promise.all([
          request<PatioInfo>(`/patio/${patioId}`, "get", null, {
            authToken: token,
          }),
          request<PosicaoHorizontalPatio[]>(
            `/posicoes/${patioId}`,
            "get",
            null,
            {
              authToken: token,
            }
          ),
        ])

        setPatioInfo(patioResponse)
        setPosicoesHorizontais(posicoesResponse || [])
        setError("")
      } catch (err) {
        console.error("Erro ao buscar dados do pátio:", err)
        setError("Houve um erro ao buscar os dados do pátio")
      } finally {
        setLoading(false)
        if (isRefresh) setRefreshing(false)
      }
    },
    [token, patioId]
  )

  useFocusEffect(
    useCallback(() => {
      if (token && patioId) {
        fetchPatioData()
      }
    }, [token, patioId, fetchPatioData])
  )

  const refresh = useCallback(() => {
    fetchPatioData(true)
  }, [fetchPatioData])

  const calculateOccupancyPercentage = useCallback(() => {
    if (!patioInfo) return 0
    return Math.round(
      (patioInfo.posicoesOcupadas / patioInfo.capacidadeMax) * 100
    )
  }, [patioInfo])

  return {
    patioInfo,
    posicoesHorizontais,
    loading,
    refreshing,
    error,
    refresh,
    calculateOccupancyPercentage,
  }
}
