import { Stack } from "expo-router"
import "@/global.css"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import { useColorScheme } from "nativewind"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { ActivityIndicator, View } from "react-native"

function InitialLayout() {
  const { theme } = useTheme()
  const { setColorScheme } = useColorScheme()
  const { isLoading } = useAuth()

  useEffect(() => {
    setColorScheme(theme)
  }, [theme, setColorScheme])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9F9] dark:bg-[#333]">
        <ActivityIndicator size="large" color="#05AF31" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>
  )
}
