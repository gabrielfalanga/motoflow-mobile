import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { login } from "../../api/operador";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    try {
      const result = await login({ username, password });
      if (result.status === 200 && result.data?.token) {
        await AsyncStorage.setItem("tokenOperador", result.data.token);
        router.replace("/(tabs)");
      } else {
        const msg = result.data?.message || result.error || "Usuário ou senha inválidos.";
        const status = result.status ? ` (Status: ${result.status})` : "";
        Alert.alert("Erro", msg + status);
      }
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Erro inesperado: " + e.toString());
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-[#f9f9f9] dark:bg-[#333] px-7">
      <View className="w-full max-w-[350px] bg-white dark:bg-[#222] rounded-2xl p-8 shadow-md">
        <Text className="text-[26px] font-bold text-[#05AF31] mb-8 text-center">
          Login do Operador
        </Text>
        <TextInput
          className="w-full h-[50px] rounded-[15px] border border-[#ccc] pl-3 mb-5 bg-white dark:bg-[#eee] text-[16px]"
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
        <TextInput
          className="w-full h-[50px] rounded-[15px] border border-[#ccc] pl-3 mb-7 bg-white dark:bg-[#eee] text-[16px]"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          className="w-full h-[50px] rounded-[15px] bg-[#05AF31] items-center justify-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-[18px] font-semibold">Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
