import { NotificationCard } from "@/components/notification-card"
import { PatioPosicoesHorizontaisGrid } from "@/components/patio-posicoes-horizontais-grid"
import { PatioSummary } from "@/components/patio-summary"
import { QuickActionCard } from "@/components/quick-action-card"
import { useAuth } from "@/context/auth-context"
import { request } from "@/helper/request"
import type { Operador, PatioInfo } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
}

export default function HomeScreen() {
  const [operador, setOperador] = useState<Operador | null>(null)
  const [patioInfo, setPatioInfo] = useState<PatioInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [erroOperador, setErroOperador] = useState<string>("")
  const [erroPatio, setErroPatio] = useState<string>("")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { token, patioId } = useAuth()

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!token) return

      if (isRefresh) setRefreshing(true)

      try {
        setLoading(!isRefresh)

        const [operadorResponse, patioResponse] = await Promise.all([
          request<Operador>("/operador/me", "get", null, {
            authToken: token,
          }),
          request<PatioInfo>(`/patio/${patioId}`, "get", null, {
            authToken: token,
          }),
        ])

        setOperador(operadorResponse)
        setPatioInfo(patioResponse)
        setErroOperador("")
        setErroPatio("")

        // Criar notificações baseadas no status do pátio
        const newNotifications: Notification[] = []
        if (patioResponse) {
          const occupancyPercentage =
            (patioResponse.posicoesOcupadas / patioResponse.capacidadeMax) * 100

          if (occupancyPercentage >= 90) {
            newNotifications.push({
              id: "high-occupancy",
              title: "Pátio quase lotado!",
              message: `${Math.round(occupancyPercentage)}% de ocupação. Considere realocar motos.`,
              type: "warning",
            })
          }

          if (patioResponse.posicoesDisponiveis <= 5) {
            newNotifications.push({
              id: "low-space",
              title: "Poucas posições disponíveis",
              message: `Apenas ${patioResponse.posicoesDisponiveis} posições livres restantes.`,
              type: "info",
            })
          }
        }
        setNotifications(newNotifications)
      } catch (error) {
        console.log("Erro ao buscar dados:", error)
        setErroOperador("Erro ao carregar dados do operador")
        setErroPatio("Erro ao carregar dados do pátio")
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
        fetchData()
      }
    }, [token, patioId, fetchData])
  )

  const onRefresh = () => {
    fetchData(true)
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#05AF31" />
        <Text className="mt-4 text-text">Carregando informações...</Text>
      </View>
    )
  }

  if (!operador) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Ionicons name="person-circle-outline" size={64} color="#ef4444" />
        <Text className="mt-4 font-semibold text-red-600">
          Operador não encontrado
        </Text>
        <Text className="text-muted">
          Verifique sua conexão e tente novamente
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#05AF31"]}
            tintColor="#05AF31"
          />
        }
      >
        {/* Header de boas-vindas */}
        <View className="mt-4 mb-6">
          <Text className="mb-1 text-muted">
            {getGreeting()}, {operador.nome.split(" ")[0]}!
          </Text>
          <Text className="font-bold text-2xl text-primary">
            Central de Operações
          </Text>
          <View className="mt-2 flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="ml-1 text-muted">
              {patioInfo?.apelido} • {patioInfo?.endereco.cidade}
            </Text>
          </View>
        </View>

        {/* Notificações */}
        {notifications.length > 0 && (
          <View className="mb-6 gap-3">
            {notifications.map(notification => (
              <NotificationCard
                key={notification.id}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                onDismiss={() => dismissNotification(notification.id)}
              />
            ))}
          </View>
        )}

        {/* Erros */}
        {(erroOperador || erroPatio) && (
          <View className="mb-4 gap-2">
            {erroOperador && (
              <NotificationCard
                title="Erro no Operador"
                message={erroOperador}
                type="error"
              />
            )}
            {erroPatio && (
              <NotificationCard
                title="Erro no Pátio"
                message={erroPatio}
                type="error"
              />
            )}
          </View>
        )}

        {/* Resumo do Pátio */}
        {patioInfo && (
          <View className="mb-6">
            <PatioSummary
              ocupadas={patioInfo.posicoesOcupadas}
              capacidadeMax={patioInfo.capacidadeMax}
              disponiveis={patioInfo.posicoesDisponiveis}
              apelido={patioInfo.apelido}
            />
          </View>
        )}

        {/* Ações Rápidas */}
        <View className="mb-6">
          <Text className="mb-4 font-bold text-lg text-text">
            Ações Rápidas
          </Text>
          <View className="gap-3">
            {/* Primeira linha */}
            <View className="flex-row gap-3">
              <QuickActionCard
                title="Cadastrar Moto"
                subtitle="Adicionar nova moto"
                iconName="add-circle-outline"
                route="/moto/cadastro-moto"
                color="#05AF31"
              />
              <QuickActionCard
                title="Buscar Moto"
                subtitle="Localizar moto"
                iconName="search-outline"
                route="/moto/busca-moto"
                color="#3b82f6"
              />
            </View>

            {/* Segunda linha */}
            <View className="flex-row gap-3">
              <QuickActionCard
                title="Ver Pátio"
                subtitle="Detalhes completos"
                iconName="grid-outline"
                route="/patio"
                color="#8b5cf6"
              />
              <QuickActionCard
                title="Visualizar Áreas"
                subtitle="Veja todas as áreas"
                iconName="map-outline"
                route="/area"
                color="#f59e0b"
              />
            </View>
          </View>
        </View>

        {/* Posições Rápidas */}
        <View className="mb-6">
          <Text className="mb-4 font-bold text-lg text-text">
            Acesso Rápido às Áreas
          </Text>
          <PatioPosicoesHorizontaisGrid />
        </View>

        {/* Footer de atualização */}
        <View className="items-center pb-8">
          <Text className="text-muted text-xs">
            Última atualização: {new Date().toLocaleTimeString()}
          </Text>
          <Text className="text-muted text-xs">
            Puxe para baixo para atualizar
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
