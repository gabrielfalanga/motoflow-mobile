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
          title: t("navigation.home"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="devs"
        options={{
          title: t("navigation.developers"),
          tabBarIcon: ({ color, size }) => <Ionicons name="code" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: t("navigation.about"),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "information-circle" : "information-circle-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
