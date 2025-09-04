import { themes } from "@/utils/color-theme"
import { StatusBar } from "expo-status-bar"
import { colorScheme } from "nativewind"
import type React from "react"
import { createContext, useContext, useState } from "react"
import { View } from "react-native"

type ThemeContextType = {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setCurrentTheme(newTheme)
    colorScheme.set(newTheme)
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
