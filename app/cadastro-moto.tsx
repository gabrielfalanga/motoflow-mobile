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
        if (!tipoMoto || !ano || !placa) return;

        Alert.alert(
            "Mensagem enviada!",
            `Tipo: ${tipoMoto}\nAno: ${ano}\nPlaca: ${placa}`,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false },
        );

        setTipoMoto(null);
        setAno(undefined);
        setPlaca(undefined);
    };

    return (
        <SafeAreaView>
            <View style={styles.form}>
                <View
                    style={{
                        width: 290,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                >
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
                    placeholder="Selecione uma opção"
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
    form: {
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    txtForm: {
        fontSize: 22,
    },
    input: {
        borderWidth: 1,
        width: 300,
        height: 50,
        borderRadius: 15,
        paddingLeft: 10,
        marginTop: 10,
    },
    inputMaior: {
        borderWidth: 1,
        width: 300,
        height: 200,
        borderRadius: 15,
        paddingLeft: 10,
        marginTop: 10,
        justifyContent: "flex-start",
        textAlignVertical: "top",
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
        paddingLeft: 10,
        marginTop: 10,
        marginHorizontal: 'auto',
        backgroundColor: 'transparent'
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