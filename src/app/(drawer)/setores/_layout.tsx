import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeTabsLayout() {
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
        name="index"
        options={{
          title: t("navigation.viewSetores"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastro-setor"
        options={{
          title: t("navigation.registerSetor"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
