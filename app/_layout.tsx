import { Slot, useRouter, useSegments } from "expo-router";
import "../global.css";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

function InnerLayout() {
  const { theme } = useTheme();
  const { setColorScheme } = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  useEffect(() => {
    // usar para testar login
    // AsyncStorage.clear();
    AsyncStorage.getItem("tokenOperador").then((token) => {
      setIsLogged(!!token);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "auth";
    if (!isLogged && !inAuth) {
      router.replace("/auth/login");
    } else if (isLogged && inAuth) {
      router.replace("/(tabs)");
    }
  }, [isLogged, loading, segments]);

  if (loading) return null;

  return <Slot />;
}

export default function Layout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}
