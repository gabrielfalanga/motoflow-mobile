import { useTheme } from "@/context/theme-context"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native"

export function LanguageToggle() {
  const { theme } = useTheme()
  const { i18n, t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)

  const currentLanguage = i18n.language

  const languages = [
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ]

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setModalVisible(false)
  }

  const getCurrentLanguageInfo = () => {
    return languages.find((lang) => lang.code === currentLanguage) || languages[0]
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="h-10 w-10 items-center justify-center rounded-full bg-card"
      >
        <Text className="text-xl">{getCurrentLanguageInfo().flag}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setModalVisible(false)}
        >
          <View className="flex-1 items-center justify-center">
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="w-80 rounded-2xl bg-card p-6"
            >
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-bold text-xl text-primary">{t("language.title")}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme === "light" ? "#333" : "#ccc"}
                  />
                </TouchableOpacity>
              </View>

              <View className="gap-2">
                {languages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    onPress={() => changeLanguage(language.code)}
                    className={`flex-row items-center justify-between rounded-xl p-4 ${
                      currentLanguage === language.code ? "bg-primary" : "bg-secondary"
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-2xl">{language.flag}</Text>
                      <Text
                        className={`font-semibold text-base ${
                          currentLanguage === language.code ? "text-white" : "text-text"
                        }`}
                      >
                        {language.name}
                      </Text>
                    </View>
                    {currentLanguage === language.code && (
                      <Ionicons name="checkmark-circle" size={24} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
