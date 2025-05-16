import { Image } from "expo-image";
import { useState } from "react";
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
        // se tiver algum campo vazio
        if (!tipoMoto || !ano || !placa) {
            Alert.alert(
                "Oops!",
                "Preencha todos os campos corretamente.",
                [{ text: "OK" }],
                { cancelable: false },
            );
        }

        else {
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
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <View style={styles.header}>
                    <Image
                        source={require("../assets/moto-esquerda.png")}
                        style={styles.img}
                    />
                    <Text style={styles.txtForm}>Cadastre a moto</Text>
                    <Image
                        source={require("../assets/moto-direita.png")}
                        style={styles.img}
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
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.opcoesDropdown}
                />
                <TextInput
                    placeholder="Ano"
                    style={styles.input}
                    value={ano?.toString()}
                    onChangeText={(value) => setAno(value ? Number(value) : undefined)}
                    keyboardType="numeric"
                    maxLength={4}
                />
                <TextInput
                    placeholder="Placa (sem traço)"
                    style={styles.input}
                    value={placa}
                    onChangeText={(value) => setPlaca(value.toUpperCase())}
                    maxLength={7}
                    autoCapitalize="characters"
                />

                <TouchableOpacity style={styles.btn} onPress={cadastrar}>
                    <Text style={{ color: "#fff" }}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        gap: 25,
    },
    form: {
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    txtForm: {
        fontSize: 22,
        fontWeight: "600",
        color: "#05AF31",
    },
    input: {
        borderWidth: 1,
        width: 300,
        height: 50,
        borderRadius: 15,
        borderColor: "#ccc",
        paddingLeft: 10,
        marginTop: 10,
        backgroundColor: "#fff"
    },
    btn: {
        backgroundColor: "#05AF31",
        width: 300,
        marginTop: 30,
        borderRadius: 15,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    img: {
        width: 40,
        height: 40,
    },
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