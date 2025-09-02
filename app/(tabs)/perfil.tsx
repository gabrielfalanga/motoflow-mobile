import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Operador } from "../../interfaces/interfaces";
import { buscarDadosOperadorLogado, editarOperador, logout } from "../../api/operador";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PerfilScreen() {
  const [operador, setOperador] = useState<Operador | null>();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await buscarDadosOperadorLogado();
      setOperador(response.error ? null : (response.data as Operador));
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleChangePassword = () => {
    setModalVisible(true);
  };

  const submitPasswordChange = async () => {
    if (!newPassword.trim()) {
      Alert.alert("Erro", "Digite a nova senha");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const updatedOperador = {
        nome: operador!.nome,
        patioId: operador!.patio.id,
        senha: newPassword,
      };
      const result = await editarOperador(updatedOperador);

      if (result.status === 200) {
        Alert.alert("Sucesso", "Senha alterada com sucesso!");
        setModalVisible(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const msg = result.data?.message || result.error || "Erro ao alterar senha";
        Alert.alert("Erro", msg);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f9f9f9] dark:bg-[#333] px-5 pt-[100px]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between mb-6">
          <View>
            <Text className="text-[24px] font-semibold mb-2 text-[#05AF31]">Meu Perfil</Text>
            <Text className="text-[16px] text-[#333] dark:text-[#ccc]">Informações da conta</Text>
          </View>
          <Ionicons
            className="mt-1 mr-2"
            name={"home-outline"}
            size={theme === "light" ? 30 : 35}
            color={theme === "light" ? "#333" : "#ccc"}
            onPress={() => router.back()}
          />
        </View>

        {operador ? (
          <View className="gap-4">
            {/* Card de informações do operador */}
            <View className="bg-white dark:bg-[#222] p-5 rounded-xl shadow-md">
              <Text className="text-[18px] font-semibold text-[#05AF31] mb-4">Dados Pessoais</Text>

              <View className="gap-3">
                <View className="flex-row items-center">
                  <Ionicons name="person" size={20} color="#05AF31" />
                  <Text className="text-[16px] text-[#333] dark:text-[#ccc] ml-3">
                    {operador.nome}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="business" size={20} color="#05AF31" />
                  <Text className="text-[16px] text-[#333] dark:text-[#ccc] ml-3">
                    {operador.patio.apelido}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="pricetag" size={20} color="#05AF31" />
                  <Text className="text-[16px] text-[#333] dark:text-[#ccc] ml-3">
                    {operador.role}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="id-card" size={20} color="#05AF31" />
                  <Text className="text-[16px] text-[#333] dark:text-[#ccc] ml-3">
                    RF: {operador.id}
                  </Text>
                </View>
              </View>
            </View>

            {/* Ações do perfil */}
            <View className="bg-white dark:bg-[#222] p-5 rounded-xl shadow-md">
              <Text className="text-[18px] font-semibold text-[#05AF31] mb-4">Configurações</Text>

              <TouchableOpacity
                className="flex-row items-center justify-between p-3 bg-[#f5f5f5] dark:bg-[#333] rounded-lg mb-3"
                onPress={handleChangePassword}
              >
                <View className="flex-row items-center">
                  <Ionicons name="key" size={20} color="#05AF31" />
                  <Text className="text-[16px] text-[#333] dark:text-[#ccc] ml-3">
                    Alterar Senha
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between p-3 bg-[#f5f5f5] dark:bg-[#333] rounded-lg"
                onPress={handleLogout}
              >
                <View className="flex-row items-center">
                  <Ionicons name="log-out" size={20} color="#ff4444" />
                  <Text className="text-[16px] text-[#ff4444] ml-3">Sair da Conta</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-[16px] text-[#666] dark:text-[#aaa]">Carregando perfil...</Text>
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
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white dark:bg-[#222] p-6 rounded-2xl w-[90%] max-w-[400px]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-[20px] font-semibold text-[#05AF31]">Alterar Senha</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-[14px] text-[#333] dark:text-[#ccc] mb-2">Nova Senha</Text>
                <TextInput
                  className="w-full h-[50px] rounded-[12px] border border-[#ccc] px-3 bg-[#f5f5f5] dark:bg-[#333] text-[16px] text-[#333] dark:text-[#ccc]"
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>

              <View>
                <Text className="text-[14px] text-[#333] dark:text-[#ccc] mb-2">
                  Confirmar Nova Senha
                </Text>
                <TextInput
                  className="w-full h-[50px] rounded-[12px] border border-[#ccc] px-3 bg-[#f5f5f5] dark:bg-[#333] text-[16px] text-[#333] dark:text-[#ccc]"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>

              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                  className="flex-1 h-[50px] rounded-[12px] border border-[#ccc] items-center justify-center"
                  onPress={closeModal}
                >
                  <Text className="text-[16px] text-[#666]">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-[50px] rounded-[12px] bg-[#05AF31] items-center justify-center"
                  onPress={submitPasswordChange}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-[16px] text-white font-semibold">Alterar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
