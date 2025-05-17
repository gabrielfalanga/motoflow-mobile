import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {

    const { theme, toggleTheme } = useTheme();

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
        <SafeAreaView className="flex-1 bg-[#f9f9f9] dark:bg-[#333] px-5 pt-[100px]">

            <View className="flex-row items-start justify-between">
                <View>
                    <Text className="text-[24px] font-semibold mb-2 text-[#05AF31]">Olá, {nomeOperador}!</Text>
                    <Text className="text-[18px] text-[#333] dark:text-[#ccc] mb-6">{nomePatio}</Text>
                </View>
                <Ionicons
                    className="mt-1 mr-2"
                    name={theme == "light" ? "moon-outline" : "sunny-outline"}
                    size={theme == "light" ? 30 : 35}
                    color={theme == "light" ? "#333" : "#ccc"}
                    onPress={toggleTheme}
                />
            </View>

            <View className="gap-5 mb-6">
                <View className="bg-[#05AF31] p-5 rounded-xl shadow-md">
                    <Text className="text-white dark:text-[#ddd] text-[16px] mb-2">Motos no Pátio</Text>
                    <Text className="text-white dark:text-[#ddd] text-[24px] font-bold">{motosNoPatio} / {capacidadePatio}</Text>
                </View>

                <View className="bg-[#05AF31] p-5 rounded-xl shadow-md">
                    <Text className="text-white dark:text-[#ddd] text-[16px] mb-2">Motos Alugadas</Text>
                    <Text className="text-white dark:text-[#ddd] text-[24px] font-bold">{motosAlugadas}</Text>
                </View>
            </View>

            <Text className="text-[18px] font-semibold mb-4 text-[#05AF31]">Por Tipo de Moto</Text>
            <View className="flex-row justify-between gap-3.5">
                {tiposMotos.map((tipo, index) => (
                    <View key={index} className="flex-1 bg-[#ccc] dark:bg-[#aaa] rounded-xl p-2.5 items-center">
                        <Image
                            source={tipo.imagem}
                            style={{width: 60, height: 60, marginBottom: 8}}
                            contentFit="contain"
                        />
                        <Text className="text-[14px] text-[#000] font-semibold mb-1 text-center">{tipo.nome}</Text>
                        <Text className="text-[12px] text-[#111]">Pátio: {tipo.noPatio}</Text>
                        <Text className="text-[12px] text-[#111]">Alugadas: {tipo.alugadas}</Text>
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
}
