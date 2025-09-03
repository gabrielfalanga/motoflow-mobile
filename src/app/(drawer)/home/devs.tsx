import { Image, ScrollView, Text, View } from "react-native"

export default function DevsScreen() {
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
    <ScrollView contentContainerClassName="flex-1 items-center justify-center p-5 bg-[#f9f9f9] dark:bg-[#333]">
      <Text className="mb-6 font-semibold text-2xl text-[#05AF31]">
        Desenvolvedores
      </Text>

      {developers.map(dev => (
        <View
          key={dev.rm}
          className="mb-6 w-full max-w-80 items-center rounded-xl bg-white p-4 shadow-md dark:bg-[#333]"
          style={{ shadowColor: "#05AF31" }}
        >
          <Image
            source={{ uri: dev.imageUrl }}
            className="mb-2.5 size-20 rounded-full"
          />
          <Text className="mb-1 font-semibold text-lg dark:text-white">
            {dev.name}
          </Text>
          <Text className="text-sm dark:text-white">RM: {dev.rm}</Text>
        </View>
      ))}
    </ScrollView>
  )
}
