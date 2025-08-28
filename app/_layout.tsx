import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import { Stack } from "expo-router";
import "../global.css";

import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function InnerLayout() {
  const { theme } = useTheme();
  const { setColorScheme } = useColorScheme();
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  useEffect(() => {
    AsyncStorage.getItem("tokenOperador").then(token => {
      setIsLogged(!!token);
    });
  }, []);

  if (isLogged === null) return null; // loading

  if (!isLogged) {
    // Mostra só a tela de login, sem tabs
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
      </Stack>
    );
  }

  // Tabs normais do app
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#05AF31",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#111" : "#ddd",
        },
        tabBarInactiveTintColor: theme === "dark" ? "#aaa" : "#888",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cadastro-moto"
        options={{
          title: "Cadastrar Moto",
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
          title: "Buscar Motos",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="devs"
        options={{
          title: "Developers",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}
