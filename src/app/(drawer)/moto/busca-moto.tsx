import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import { FlatList, StyleSheet, Text, View } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image } from "expo-image"

// dados mockados de motos cadastradas
const motosMock = [
  {
    id: "1",
    tipo: "Mottu Sport",
    ano: 2021,
    placa: "ABC1234",
    posicao: { x: "A", y: 5 },
  },
  {
    id: "2",
    tipo: "Mottu E",
    ano: 2020,
    placa: "XYZ9876",
    posicao: { x: "B", y: 3 },
  },
  {
    id: "3",
    tipo: "Mottu Pop",
    ano: 2022,
    placa: "POP5678",
    posicao: { x: "C", y: 9 },
  },
  {
    id: "4",
    tipo: "Mottu Sport",
    ano: 2019,
    placa: "SPR0T12",
    posicao: { x: "A", y: 2 },
  },
  {
    id: "5",
    tipo: "Mottu E",
    ano: 2021,
    placa: "EEE7E23",
    posicao: { x: "B", y: 7 },
  },
]

// mapeamento tipo -> imagem
const imagensMotos = {
  "Mottu Sport": require("@/assets/mottu-sport.png"),
  "Mottu E": require("@/assets/mottu-e.png"),
  "Mottu Pop": require("@/assets/mottu-pop.png"),
}

export default function BuscaMotoScreen() {
  const { theme, toggleTheme } = useTheme()

  const [open, setOpen] = useState(false)
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null)
  const [opcoes, setOpcoes] = useState([
    { label: "Mottu E", value: "Mottu E" },
    { label: "Mottu Sport", value: "Mottu Sport" },
    { label: "Mottu Pop", value: "Mottu Pop" },
  ])

  const [motosFiltradas, setMotosFiltradas] = useState<typeof motosMock>([])

  useEffect(() => {
    if (tipoSelecionado) {
      setMotosFiltradas(motosMock.filter(moto => moto.tipo === tipoSelecionado))
    } else {
      setMotosFiltradas([])
    }
  }, [tipoSelecionado])

  const renderMotoCard = ({ item }: { item: (typeof motosMock)[0] }) => (
    <View className="mb-3 flex-row items-center rounded-[12px] bg-[#05AF31dd] p-3 shadow-md">
      <Image
        source={imagensMotos[item.tipo as keyof typeof imagensMotos]}
        style={{ width: 70, height: 70, marginRight: 15 }}
        contentFit="contain"
      />
      <View className="flex-1">
        <Text className="mb-1.5 font-bold text-[18px] text-white">
          {item.tipo}
        </Text>
        <View className="mb-[5px] flex-1 flex-row items-center gap-[10px]">
          <Text className="font-semibold text-[16px] text-white">Posição:</Text>
          <View className="rounded bg-white px-1.5 py-[1px]">
            <Text className="text-[18px]">{`${item.posicao.x}${item.posicao.y}`}</Text>
          </View>
        </View>
        <Text className="font-medium text-[#e0e0e0] text-[14px]">
          Ano: {item.ano}
        </Text>
        <Text className="font-medium text-[#e0e0e0] text-[14px]">
          Placa: {item.placa}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-[#f9f9f9] px-7 pt-12 dark:bg-[#333]">
      <Text className="mb-[15px] ml-[5px] font-semibold text-[#05AF31] text-[22px]">
        Encontre as posições das motos
      </Text>
      <DropDownPicker
        open={open}
        value={tipoSelecionado}
        items={opcoes}
        setOpen={setOpen}
        setValue={setTipoSelecionado}
        setItems={setOpcoes}
        placeholder="Selecione o tipo da moto"
        style={[
          styles.dropdown,
          theme === "dark" && { backgroundColor: "#eee" },
        ]}
        dropDownContainerStyle={[
          styles.opcoesDropdown,
          theme === "dark" && { backgroundColor: "#eee" },
        ]}
      />

      {tipoSelecionado && motosFiltradas.length === 0 && (
        <Text className="mt-5 text-center text-[#999] text-[16px]">
          Nenhuma moto desse tipo disponível.
        </Text>
      )}

      <FlatList
        data={motosFiltradas}
        keyExtractor={item => item.id}
        renderItem={renderMotoCard}
        contentContainerStyle={{ paddingBottom: 20, marginTop: 16 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderRadius: 15,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  opcoesDropdown: {
    borderRadius: 15,
  },
})
