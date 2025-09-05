import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"
import type { PosicaoHorizontalDetalhes } from "@/interfaces/interfaces"
import { useCallback, useEffect, useState } from "react"

export function usePosicaoHorizontalData(posicaoHorizontal: string) {
  const [data, setData] = useState<PosicaoHorizontalDetalhes | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string>("")
  const { token, patioId } = useAuth()

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!token || !patioId || !posicaoHorizontal) return

      if (isRefresh) setRefreshing(true)
      else setLoading(true)

      try {
        const response = await request<PosicaoHorizontalDetalhes>(
          `/posicoes/${patioId}/${posicaoHorizontal}`,
          "get",
          null,
          {
            authToken: token,
          }
        )

        setData(response)
        setError("")
      } catch (err) {
        console.log("Erro ao buscar dados da posição horizontal:", err)
        setError("Erro ao carregar dados da posição horizontal")
      } finally {
        setLoading(false)
        if (isRefresh) setRefreshing(false)
      }
    },
    [token, patioId, posicaoHorizontal]
  )

  useEffect(() => {
    if (token && patioId && posicaoHorizontal) {
      fetchData()
    }
  }, [token, patioId, posicaoHorizontal, fetchData])

  const refresh = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  const getMotoPorPosicao = useCallback(
    (posicaoVertical: number) => {
      return data?.motos.find(moto => moto.posicaoVertical === posicaoVertical)
    },
    [data]
  )

  const getEstatisticas = useCallback(() => {
    if (!data) return { disponiveis: 0 }

    const ocupadas = data.motos.length

    return {
      ocupadas,
      disponiveis: data.vagasTotais - ocupadas,
      vagas: data.vagasTotais,
      taxaOcupacao: Math.round((ocupadas / data.vagasTotais) * 100),
    }
  }, [data])

  return {
    data,
    loading,
    refreshing,
    error,
    refresh,
    getMotoPorPosicao,
    getEstatisticas,
  }
}
