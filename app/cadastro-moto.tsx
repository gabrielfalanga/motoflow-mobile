import { Image } from "expo-image";
import { useState } from "react";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from "react-native-safe-area-context";


export default function CadastroMotoScreen() {

    const { theme, toggleTheme } = useTheme();

    // dropdown tipo de moto
    const [open, setOpen] = useState(false);
    const [tipoMoto, setTipoMoto] = useState<string | null>(null);
    const [opcoes, setOpcoes] = useState([
        { label: 'Mottu E', value: 'Mottu E' },
        { label: 'Mottu Sport', value: 'Mottu Sport' },
        { label: 'Mottu Pop', value: 'Mottu Pop' },
    ]);
    // ano e placa
    const [ano, setAno] = useState<number>();
    const [placa, setPlaca] = useState<string>();

    const cadastrar = () => {
        const anoAtual = new Date().getFullYear();
        const anoMaximo = anoAtual + 1;

        if (!tipoMoto) {
            Alert.alert("Erro", "Selecione o tipo da moto.");
            return;
        }

        if (!ano || isNaN(ano) || ano.toString().length !== 4 || ano < 1950 || ano > anoMaximo) {
            Alert.alert("Erro", "Digite um ano válido.");
            return;
        }

        const placaRegex = /^[A-Z0-9]{7}$/;
        if (!placa || !placaRegex.test(placa)) {
            Alert.alert("Erro", "Digite uma placa válida (sem espaços ou símbolos).");
            return;
        }

        Alert.alert(
            "Moto cadastrada!",
            `Tipo: ${tipoMoto}\nAno: ${ano}\nPlaca: ${placa}`,
            [{
                text: "OK", onPress: () => {
                    setTipoMoto(null);
                    setAno(undefined);
                    setPlaca(undefined);
                }
            }],
            { cancelable: false }
        );
    };


    return (
        <SafeAreaView className="flex-1 bg-[#f9f9f9] dark:bg-[#333] px-5 pt-10">
            <View className="mt-[50px] items-center justify-center">
                <View className="flex-row items-center justify-center mb-5 gap-7">
                    <Image
                        source={require("../assets/moto-esquerda.png")}
                        style={{ width: 40, height: 40 }}
                    />
                    <Text className="text-[24px] font-semibold text-[#05AF31]">Cadastre a moto</Text>
                    <Image
                        source={require("../assets/moto-direita.png")}
                        style={{ width: 40, height: 40 }}
                    />
                </View>

                <DropDownPicker
                    open={open}
                    value={tipoMoto}
                    items={opcoes}
                    setOpen={setOpen}
                    setValue={setTipoMoto}
                    setItems={setOpcoes}
                    placeholder="Selecione o tipo da moto"
                    style={[
                        styles.dropdown,
                        theme === "dark" && { backgroundColor: "#eee" }
                    ]}
                    dropDownContainerStyle={[
                        styles.opcoesDropdown,
                        theme === "dark" && { backgroundColor: "#eee" }
                    ]}
                />
                <TextInput
                    placeholder="Ano"
                    className="w-[300px] h-[50px] mt-4 rounded-[15px] border border-[#ccc] pl-2.5 bg-white dark:bg-[#eee]"
                    value={ano?.toString()}
                    onChangeText={(value) => setAno(value ? Number(value) : undefined)}
                    keyboardType="numeric"
                    maxLength={4}
                />
                <TextInput
                    placeholder="Placa (sem traço)"
                    className="w-[300px] h-[50px] mt-4 rounded-[15px] border border-[#ccc] pl-2.5 bg-white dark:bg-[#eee]"
                    value={placa}
                    onChangeText={(value) => setPlaca(value.toUpperCase())}
                    maxLength={7}
                    autoCapitalize="characters"
                />

                <TouchableOpacity
                    className="w-[300px] h-[50px] mt-7 rounded-[15px] bg-[#05AF31] items-center justify-center"
                    onPress={cadastrar}
                >
                    <Text style={{ color: "#fff" }}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        width: 300,
        height: 50,
        borderRadius: 15,
        borderColor: "#ccc",
        paddingLeft: 10,
        marginTop: 10,
        marginHorizontal: 'auto',
        backgroundColor: "#fff"
    },
    opcoesDropdown: {
        width: 300,
        height: 130,
        borderRadius: 15,
        marginHorizontal: 'auto',
        alignSelf: 'center',
        marginTop: 10,
    }
});