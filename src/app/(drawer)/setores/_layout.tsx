import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function HomeTabsLayout() {
  const { theme } = useTheme();
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
          title: "Visualizar Setores",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastro-setor"
        options={{
          title: "Cadastrar Setor",
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
