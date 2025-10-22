import { Ionicons } from "@expo/vector-icons"
import { Image, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"

export default function DevsScreen() {
  const { t } = useTranslation();
  const developers = [
    {
      name: "Matheus Esteves",
      rm: "554769",
      imageUrl: "https://github.com/matheus-esteves10.png",
    },
    {
      name: "Gabriel Falanga",
      rm: "555061",
      imageUrl: "https://github.com/gabrielfalanga.png",
    },
    {
      name: "Arthur Spedine",
      rm: "554489",
      imageUrl: "https://github.com/arthurspedine.png",
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-background px-8">
      <View className="mb-8 items-center">
        <View className="mb-4 flex-row items-center">
          <Ionicons name="people-outline" size={28} color="#05AF31" />
          <Text className="ml-2 font-bold text-3xl text-primary">
            {t("devs.title")}
          </Text>
        </View>
        <Text className="text-center text-muted">
          {t("devs.subtitle")}
        </Text>
      </View>

      {/* Developer Cards */}
      <View className="gap-6">
        {developers.map(dev => (
          <View
            key={dev.rm}
            className="rounded-2xl bg-card p-6 shadow-sm"
            style={{
              shadowColor: "#05AF31",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center">
              {/* Avatar */}
              <View className="mr-4">
                <Image
                  source={{ uri: dev.imageUrl }}
                  className="size-16 rounded-full border-2 border-primary/20"
                />
                <View className="-bottom-1 -right-1 absolute rounded-full bg-primary p-1">
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              </View>

              {/* Info */}
              <View className="flex-1">
                <Text className="font-bold text-lg text-text">{dev.name}</Text>
                <View className="mt-2 flex-row items-center">
                  <Ionicons name="school-outline" size={14} color="#666" />
                  <Text className="ml-1 text-muted text-sm">RM: {dev.rm}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}
