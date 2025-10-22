import { useAuth } from "@/context/auth-context"
import { useTheme } from "@/context/theme-context"
import { request } from "@/helper/request"
import type { Operador } from "@/interfaces/interfaces"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"

export default function PerfilScreen() {
  const { token } = useAuth()
  const [operador, setOperador] = useState<Operador>()
  const [erro, setErro] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (!token) {
      return
    }
    const fetchData = async () => {
      try {
        const response = await request("/operador/me", "get", null, {
          authToken: token,
        })

        setOperador(response as Operador)
      } catch (error) {
        setErro(t("account.errorLoadingData"))
      }
    }
    fetchData()
  }, [token, t])

  const handleChangePassword = () => {
    setModalVisible(true)
  }

  const submitPasswordChange = async () => {
    if (!operador || !token) return
    if (!newPassword.trim()) {
      Alert.alert(t("common.error"), t("account.errorEmptyPassword"))
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t("common.error"), t("account.errorPasswordMismatch"))
      return
    }

    if (newPassword.length < 6) {
      Alert.alert(t("common.error"), t("account.errorPasswordLength"))
      return
    }

    setLoading(true)
    try {
      const updatedOperador = {
        nome: operador.nome,
        senha: newPassword,
      }
      await request("/operador/me", "put", updatedOperador, {
        authToken: token,
      })
      Alert.alert(t("common.success"), t("account.successPasswordChanged"))
      setModalVisible(false)
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      Alert.alert(t("account.errorChangingPassword"))
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-5">
      <View className="mb-6 flex-row items-start justify-between">
        <View>
          <Text className="mb-2 font-semibold text-2xl text-primary">
            {t("account.title")}
          </Text>
          <Text className="text-base text-foreground">
            {t("account.subtitle")}
          </Text>
        </View>
        <Ionicons
          className="mt-1 mr-2"
          name={"home-outline"}
          size={theme === "light" ? 30 : 35}
          color={theme === "light" ? "#333" : "#ccc"}
          onPress={() => router.back()}
        />
      </View>

      {operador && !erro ? (
        <View className="gap-4">
          {/* Card de informações do operador */}
          <View className="rounded-xl bg-card p-5 shadow-md">
            <Text className="mb-4 font-semibold text-lg text-primary">
              {t("account.personalData")}
            </Text>

            <View className="gap-3">
              <View className="flex-row items-center">
                <Ionicons name="person" size={20} color="#05AF31" />
                <Text className="ml-3 text-base text-foreground">
                  {operador.nome}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="pricetag" size={20} color="#05AF31" />
                <Text className="ml-3 text-base text-foreground">
                  {operador.role}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="id-card" size={20} color="#05AF31" />
                <Text className="ml-3 text-base text-foreground">
                  RF: {operador.id}
                </Text>
              </View>
            </View>
          </View>

          {/* Ações do perfil */}
          <View className="rounded-xl bg-card p-5 shadow-md">
            <Text className="mb-4 font-semibold text-lg text-primary">
              {t("account.settings")}
            </Text>

            <TouchableOpacity
              className="mb-3 flex-row items-center justify-between rounded-lg bg-secondary p-3"
              onPress={handleChangePassword}
            >
              <View className="flex-row items-center">
                <Ionicons name="key" size={20} color="#05AF31" />
                <Text className="ml-3 text-base text-foreground">
                  {t("account.changePassword")}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted">{t("account.loadingProfile")}</Text>
        </View>
      )}
      {erro && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-red-500">{erro}</Text>
        </View>
      )}

      {/* Modal para alterar senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[90%] max-w-96 rounded-2xl bg-card p-6">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-semibold text-2xl text-primary">
                {t("account.changePassword")}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text className="mb-2 text-foreground text-sm">{t("account.newPassword")}</Text>
                <TextInput
                  className="h-12 w-full rounded-xl border border-gray-300 bg-secondary px-3 text-base text-foreground"
                  placeholder={t("account.enterNewPassword")}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>

              <View>
                <Text className="mb-2 text-foreground text-sm">
                  {t("account.confirmPassword")}
                </Text>
                <TextInput
                  className="h-12 w-full rounded-xl border border-gray-300 bg-secondary px-3 text-base text-foreground"
                  placeholder={t("account.confirmNewPassword")}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>

              <View className="mt-4 flex-row gap-3">
                <TouchableOpacity
                  className="h-12 flex-1 items-center justify-center rounded-xl border border-gray-300"
                  onPress={closeModal}
                >
                  <Text className="text-base text-muted">{t("common.cancel")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="h-12 flex-1 items-center justify-center rounded-xl bg-primary"
                  onPress={submitPasswordChange}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-base text-white">
                      {t("account.alter")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
