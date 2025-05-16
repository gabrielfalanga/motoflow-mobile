import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Desenvolvedores</Text>
            {developers.map((dev) => (
                <View key={dev.rm} style={styles.devCard}>
                    <Image source={{ uri: dev.imageUrl }} style={styles.profileImage} />
                    <Text style={styles.name}>{dev.name}</Text>
                    <Text style={styles.rm}>RM: {dev.rm}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#05AF31",
        marginBottom: 25,
    },
    devCard: {
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#05AF31",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 5,
        width: "100%",
        maxWidth: 300,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },
    rm: {
        fontSize: 14,
        color: "#555",
    },
});