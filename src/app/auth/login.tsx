import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import { useRouter } from "expo-router"
import { useAuth } from "@/context/auth-context"

export default function LoginScreen() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    const success = await login(username, password)
    setLoading(false)

    if (success) {
      router.replace("/(drawer)/home")
    } else {
      Alert.alert("Usuário ou senha inválidos.")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 items-center justify-center bg-[#f9f9f9] px-7 dark:bg-[#333]">
        <View className="w-full max-w-[350px] rounded-2xl bg-white p-8 shadow-md dark:bg-[#222]">
          <Text className="mb-8 text-center font-bold text-[#05AF31] text-[26px]">
            Login do Operador
          </Text>
          <TextInput
            className="mb-5 h-[50px] w-full rounded-[15px] border border-[#ccc] bg-white pl-3 text-[16px] dark:bg-[#eee]"
            placeholder="Usuário"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mb-7 h-[50px] w-full rounded-[15px] border border-[#ccc] bg-white pl-3 text-[16px] dark:bg-[#eee]"
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            className="h-[50px] w-full items-center justify-center rounded-[15px] bg-[#05AF31]"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-[18px] text-white">
                Entrar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
