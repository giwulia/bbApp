import { View, Text, StyleSheet } from "react-native";

export default function PlaceholderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🚧 Coming Soon</Text>
            <Text style={styles.subtitle}>
                This screen is under construction.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#27253F",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
    },
});