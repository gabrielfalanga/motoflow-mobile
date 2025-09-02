import { Image, ScrollView, Text, View } from "react-native";

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
  ];

  return (
    <ScrollView contentContainerClassName="flex-1 items-center justify-center p-5 bg-[#f9f9f9] dark:bg-[#333]">
      <Text className="text-[24px] font-semibold text-[#05AF31] mb-[25px]">Desenvolvedores</Text>

      {developers.map((dev) => (
        <View
          key={dev.rm}
          className="items-center mb-7 bg-white dark:bg-[#333] p-[15px] rounded-[10px] shadow-md w-full max-w-[300px]"
          style={{ shadowColor: "#05AF31" }}
        >
          <Image source={{ uri: dev.imageUrl }} className="w-[80px] h-[80px] rounded-full mb-2.5" />
          <Text className="text-[18px] font-semibold text-[#333] dark:text-[#eee] mb-[5px]">
            {dev.name}
          </Text>
          <Text className="text-[14px] text-[#555] dark:text-[#ddd]">RM: {dev.rm}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
