import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useTheme } from "@/context/theme-context";
import { Header } from "@/components/Header";
import { useTranslation } from "react-i18next";

export default function DrawerLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
          title: t("navigation.home"),
          drawerIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="patio"
        options={{
          title: t("navigation.patio"),
          drawerIcon: ({ color, size }) => <Ionicons name="business" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="setores"
        options={{
          title: t("navigation.setores"),
          drawerIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="moto"
        options={{
          title: t("navigation.motos"),
          drawerIcon: ({ color, size }) => <Ionicons name="bicycle" color={color} size={size} />,
        }}
        initialParams={{ posicaoHorizontal: null, posicaoVertical: null }}
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
        name="setor/[setor]"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
