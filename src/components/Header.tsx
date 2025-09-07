import { useAuth } from "@/context/auth-context"
import { Ionicons } from "@expo/vector-icons"
import type { DrawerNavigationProp } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import ThemeToggle from "./theme-toggle"
import { useTheme } from "@/context/theme-context"

type RootDrawerParamList = {
  Home: undefined
}

export function Header() {
  const { logout } = useAuth()
  const router = useRouter()
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>()
  const [sheetVisible, setSheetVisible] = useState(false)
  const { theme } = useTheme()

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          setSheetVisible(false)
          await logout()
          router.replace("/auth/login")
        },
      },
    ])
  }

  const handleConta = () => {
    setSheetVisible(false)
    router.push("/account")
  }

  return (
    <>
      <View className="h-28 flex-row items-center justify-between bg-background px-4 py-3 pt-14 shadow-sm">
        {/* Botão para abrir o Drawer */}
        <View>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons
              name="menu"
              size={28}
              color={theme === "light" ? "#333" : "#ccc"}
            />
          </TouchableOpacity>
        </View>

        {/* Botão de perfil/bolinha com bottom sheet */}
        <View className="flex flex-row items-center gap-4">
          <ThemeToggle />
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-green-100"
            onPress={() => setSheetVisible(true)}
          >
            <Ionicons name="person" size={24} color="#05AF31" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setSheetVisible(false)}>
          <View className="absolute right-0 bottom-0 left-0 items-center rounded-t-2xl bg-card p-2 pb-12">
            <Pressable
              className="mb-4 w-full flex-row items-center justify-center border-gray-400 border-b py-6"
              onPress={handleConta}
            >
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#05AF31"
                style={{ marginRight: 8 }}
              />
              <Text className="font-semibold text-lg text-primary">Conta</Text>
            </Pressable>
            <Pressable
              className="w-full flex-row items-center justify-center py-4"
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#dc2626"
                style={{ marginRight: 8 }}
              />
              <Text className="font-semibold text-lg text-red-600">Sair</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
