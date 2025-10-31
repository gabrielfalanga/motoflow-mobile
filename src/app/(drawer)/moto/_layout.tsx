import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import { useTheme } from "@/context/theme-context";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#05AF31",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#111" : "#fff",
        },
        tabBarInactiveTintColor: isDark ? "#aaa" : "#888",
      }}
    >
      <Tabs.Screen
        name="cadastro-moto"
        options={{
          title: t("navigation.registerMoto"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="busca-moto"
        options={{
          title: t("navigation.searchMoto"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
