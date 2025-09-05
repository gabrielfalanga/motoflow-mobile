import { Ionicons } from "@expo/vector-icons"
import { Drawer } from "expo-router/drawer"
import { useTheme } from "@/context/theme-context"
import { Header } from "@/components/header"

export default function DrawerLayout() {
  const { theme } = useTheme()

  return (
    <Drawer
      screenOptions={{
        header: () => <Header />,
        drawerActiveTintColor: "#05AF31",
        drawerInactiveTintColor: theme === "dark" ? "#ccc" : "#888",
        drawerStyle: {
          backgroundColor: theme === "dark" ? "#333" : "#f9f9f9",
        },
        drawerLabelStyle: {
          color: theme === "dark" ? "#ccc" : "#333",
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="patio"
        options={{
          title: "Pátio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="moto"
        options={{
          title: "Motos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bicycle" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="account"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="logout"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="posicao-horizontal/[posicaoHorizontal]"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  )
}
