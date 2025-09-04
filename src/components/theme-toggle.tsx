import { Pressable, View } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated"
import { useEffect } from "react"
import { useTheme } from "@/context/theme-context"
import { Ionicons } from "@expo/vector-icons"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"
  const translateX = useSharedValue(isDark ? 46 : 3.5)

  useEffect(() => {
    translateX.value = withSpring(isDark ? 46 : 3.5, {
      damping: 15,
      stiffness: 150,
    })
  }, [isDark, translateX])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  return (
    <Pressable
      onPress={toggleTheme}
      className="relative h-12 w-24 flex-row items-center justify-between rounded-full bg-secondary p-1"
    >
      <Icon icon="sunny" />
      <Icon icon="moon" />
      <Animated.View
        style={[animatedStyle]}
        className="absolute flex size-10 flex-row items-center justify-center rounded-full bg-background"
      />
    </Pressable>
  )
}

const Icon = (props: { icon: keyof typeof Ionicons.glyphMap }) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <View className="relative z-50 flex size-10 flex-row items-center justify-center rounded-full">
      <Ionicons
        name={props.icon}
        size={20}
        color={`${isDark ? "white" : "black"}`}
      />
    </View>
  )
}

export default ThemeToggle
