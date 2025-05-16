import React, { useState, useEffect } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

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
];

// Mapeamento tipo -> imagem
const imagensMotos = {
    "Mottu Sport": require("../assets/mottu-sport.png"),
    "Mottu E": require("../assets/mottu-e.png"),
    "Mottu Pop": require("../assets/mottu-pop.png"),
};

export default function BuscaMotoScreen() {
    const [open, setOpen] = useState(false);
    const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
    const [opcoes, setOpcoes] = useState([
        { label: "Mottu E", value: "Mottu E" },
        { label: "Mottu Sport", value: "Mottu Sport" },
        { label: "Mottu Pop", value: "Mottu Pop" },
    ]);

    const [motosFiltradas, setMotosFiltradas] = useState<typeof motosMock>([]);

    useEffect(() => {
        if (tipoSelecionado) {
            setMotosFiltradas(motosMock.filter((moto) => moto.tipo === tipoSelecionado));
        } else {
            setMotosFiltradas([]);
        }
    }, [tipoSelecionado]);

    const renderMotoCard = ({ item }: { item: typeof motosMock[0] }) => (
        <View style={styles.card}>
            <Image
                source={imagensMotos[item.tipo as keyof typeof imagensMotos]}
                style={styles.motoImage}
                contentFit="contain"
            />
            <View style={styles.infoContainer}>
                <Text style={styles.tipo}>{item.tipo}</Text>
                <View style={styles.boxPosicao}>
                    <Text style={styles.posicao}>Posição:</Text>
                    <View style={styles.posicaoXY}>
                        <Text style={{ fontSize: 18 }}>{`${item.posicao.x}${item.posicao.y}`}</Text>
                    </View>
                </View>
                <Text style={styles.anoPlaca}>Ano: {item.ano}</Text>
                <Text style={styles.anoPlaca}>Placa: {item.placa}</Text>
            </View>
        </View >
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>Encontre as posições das motos</Text>
            <DropDownPicker
                open={open}
                value={tipoSelecionado}
                items={opcoes}
                setOpen={setOpen}
                setValue={setTipoSelecionado}
                setItems={setOpcoes}
                placeholder="Selecione o tipo da moto"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
            />

            {tipoSelecionado && motosFiltradas.length === 0 && (
                <Text style={styles.emptyText}>Nenhuma moto desse tipo disponível.</Text>
            )}

            <FlatList
                data={motosFiltradas}
                keyExtractor={(item) => item.id}
                renderItem={renderMotoCard}
                contentContainerStyle={{ paddingBottom: 20, marginTop: 16 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "600",
        color: "#05AF31",
        marginBottom: 15,
        marginLeft: 5
    },
    dropdown: {
        height: 50,
        borderRadius: 15,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    dropdownContainer: {
        borderRadius: 15,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        color: "#999",
        textAlign: "center",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#05AF31dd",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 4,
    },
    motoImage: {
        width: 70,
        height: 70,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    tipo: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 6,
    },
    boxPosicao: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 5
    },
    posicao: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    posicaoXY: {
        backgroundColor: "#fff",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 1
    },
    anoPlaca: {
        fontSize: 14,
        fontWeight: "500",
        color: "#e0e0e0",
    },
});
