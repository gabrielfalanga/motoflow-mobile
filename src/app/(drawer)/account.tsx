import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import type { Operador } from "@/interfaces/interfaces"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native"
import { useTheme } from "@/context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { request } from "@/helper/request"
import { useAuth } from "@/context/auth-context"

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
        setErro("Houve um erro ao buscar os dados do operador")
      }
    }
    fetchData()
  }, [token])

  const handleChangePassword = () => {
    setModalVisible(true)
  }

  const submitPasswordChange = async () => {
    if (!operador || !token) return
    if (!newPassword.trim()) {
      Alert.alert("Erro", "Digite a nova senha")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem")
      return
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres")
      return
    }

    setLoading(true)
    try {
      const updatedOperador = {
        nome: operador.nome,
        patioId: operador.patio.id,
        senha: newPassword,
      }
      await request("/operador/me", "put", updatedOperador, {
        authToken: token,
      })
      Alert.alert("Sucesso", "Senha alterada com sucesso!")
      setModalVisible(false)
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      Alert.alert("Houve um erro ao alterar a senha")
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
    <SafeAreaView className="flex-1 bg-[#f9f9f9] px-5 pt-[100px] dark:bg-[#333]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6 flex-row items-start justify-between">
          <View>
            <Text className="mb-2 font-semibold text-[#05AF31] text-[24px]">
              Meu Perfil
            </Text>
            <Text className="text-[#333] text-[16px] dark:text-[#ccc]">
              Informações da conta
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
            <View className="rounded-xl bg-white p-5 shadow-md dark:bg-[#222]">
              <Text className="mb-4 font-semibold text-[#05AF31] text-[18px]">
                Dados Pessoais
              </Text>

              <View className="gap-3">
                <View className="flex-row items-center">
                  <Ionicons name="person" size={20} color="#05AF31" />
                  <Text className="ml-3 text-[#333] text-[16px] dark:text-[#ccc]">
                    {operador.nome}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="business" size={20} color="#05AF31" />
                  <Text className="ml-3 text-[#333] text-[16px] dark:text-[#ccc]">
                    {operador.patio.apelido}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="pricetag" size={20} color="#05AF31" />
                  <Text className="ml-3 text-[#333] text-[16px] dark:text-[#ccc]">
                    {operador.role}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="id-card" size={20} color="#05AF31" />
                  <Text className="ml-3 text-[#333] text-[16px] dark:text-[#ccc]">
                    RF: {operador.id}
                  </Text>
                </View>
              </View>
            </View>

            {/* Ações do perfil */}
            <View className="rounded-xl bg-white p-5 shadow-md dark:bg-[#222]">
              <Text className="mb-4 font-semibold text-[#05AF31] text-[18px]">
                Configurações
              </Text>

              <TouchableOpacity
                className="mb-3 flex-row items-center justify-between rounded-lg bg-[#f5f5f5] p-3 dark:bg-[#333]"
                onPress={handleChangePassword}
              >
                <View className="flex-row items-center">
                  <Ionicons name="key" size={20} color="#05AF31" />
                  <Text className="ml-3 text-[#333] text-[16px] dark:text-[#ccc]">
                    Alterar Senha
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-[#666] text-[16px] dark:text-[#aaa]">
              Carregando perfil...
            </Text>
          </View>
        )}
        {erro && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-[#ff4444] text-[16px] dark:text-[#aaa]">
              {erro}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal para alterar senha */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[90%] max-w-[400px] rounded-2xl bg-white p-6 dark:bg-[#222]">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-semibold text-[#05AF31] text-[20px]">
                Alterar Senha
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text className="mb-2 text-[#333] text-[14px] dark:text-[#ccc]">
                  Nova Senha
                </Text>
                <TextInput
                  className="h-[50px] w-full rounded-[12px] border border-[#ccc] bg-[#f5f5f5] px-3 text-[#333] text-[16px] dark:bg-[#333] dark:text-[#ccc]"
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>

              <View>
                <Text className="mb-2 text-[#333] text-[14px] dark:text-[#ccc]">
                  Confirmar Nova Senha
                </Text>
                <TextInput
                  className="h-[50px] w-full rounded-[12px] border border-[#ccc] bg-[#f5f5f5] px-3 text-[#333] text-[16px] dark:bg-[#333] dark:text-[#ccc]"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>

              <View className="mt-4 flex-row gap-3">
                <TouchableOpacity
                  className="h-[50px] flex-1 items-center justify-center rounded-[12px] border border-[#ccc]"
                  onPress={closeModal}
                >
                  <Text className="text-[#666] text-[16px]">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#05AF31]"
                  onPress={submitPasswordChange}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="font-semibold text-[16px] text-white">
                      Alterar
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
