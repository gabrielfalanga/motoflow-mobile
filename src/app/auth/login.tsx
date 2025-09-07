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
      router.replace("/home")
    } else {
      Alert.alert("Usuário ou senha inválidos.")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 items-center justify-center bg-[#f9f9f9] px-7 dark:bg-[#333]">
        <View className="w-full max-w-96 rounded-2xl bg-white p-8 shadow-md dark:bg-[#222]">
          <Text className="mb-8 text-center font-bold text-3xl text-[#05AF31]">
            Login do Operador
          </Text>
          <TextInput
            className="mb-5 h-12 w-full rounded-2xl border border-[#ccc] bg-white pl-3 dark:bg-[#eee]"
            placeholder="Usuário"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            className="mb-7 h-12 w-full rounded-2xl border border-[#ccc] bg-white pl-3 dark:bg-[#eee]"
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />
          <TouchableOpacity
            className="h-12 w-full items-center justify-center rounded-2xl bg-primary"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-lg text-white">Entrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
