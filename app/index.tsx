import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

export default function HomeScreen() {
    // dados mockados
    const nomeOperador = "Fernando";
    const nomePatio = "Pátio Central";
    const motosNoPatio = 75;
    const capacidadePatio = 150;
    const motosAlugadas = 42;

    const tiposMotos = [
        {
            nome: "Mottu Sport",
            imagem: require("../assets/mottu-sport.png"),
            noPatio: 40,
            alugadas: 8,
        },
        {
            nome: "Mottu E",
            imagem: require("../assets/mottu-e.png"),
            noPatio: 25,
            alugadas: 14,
        },
        {
            nome: "Mottu Pop",
            imagem: require("../assets/mottu-pop.png"),
            noPatio: 10,
            alugadas: 20,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.greeting}>Olá, {nomeOperador}!</Text>
            <Text style={styles.patioName}>{nomePatio}</Text>

            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Motos no Pátio</Text>
                    <Text style={styles.cardValue}>{motosNoPatio} / {capacidadePatio}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Motos Alugadas</Text>
                    <Text style={styles.cardValue}>{motosAlugadas}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Por Tipo de Moto</Text>
            <View style={styles.tipoContainer}>
                {tiposMotos.map((tipo, index) => (
                    <View key={index} style={styles.tipoCard}>
                        <Image
                            source={tipo.imagem}
                            style={styles.motoImage}
                            contentFit="contain"
                        />
                        <Text style={styles.tipoNome}>{tipo.nome}</Text>
                        <Text style={styles.tipoInfo}>Pátio: {tipo.noPatio}</Text>
                        <Text style={styles.tipoInfo}>Alugadas: {tipo.alugadas}</Text>
                    </View>
                ))}
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
    greeting: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
        color: '#05AF31',
    },
    patioName: {
        fontSize: 18,
        color: '#333',
        marginBottom: 24,
    },
    cardContainer: {
        gap: 16,
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#05AF31',
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    cardValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#05AF31',
    },
    tipoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    tipoCard: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
    },
    motoImage: {
        width: 60,
        height: 60,
        marginBottom: 8,
    },
    tipoNome: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    tipoInfo: {
        fontSize: 12,
        color: '#333',
    },
});
