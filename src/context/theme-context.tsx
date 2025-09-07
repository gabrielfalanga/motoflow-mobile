import { themes } from "@/utils/color-theme"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { Appearance, View } from "react-native"

type ThemeContextType = {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme()
  const colorInASyncStorage = AsyncStorage.getItem("theme")
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    colorScheme || "light"
  )

  useEffect(() => {
    if (colorInASyncStorage) {
      colorInASyncStorage.then(value => {
        if (value === "light" || value === "dark") {
          setCurrentTheme(value)
        }
      })
    }
  }, [colorInASyncStorage])

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light"
    AsyncStorage.setItem("theme", newTheme)
    setCurrentTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <View style={themes[currentTheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  )
}
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
