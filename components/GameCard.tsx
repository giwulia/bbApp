import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { GameResponse } from "@/src/api/types";
import { formatGameDate, formatTime } from "@/src/utils/format";

export default function GameCard({ item, onPress, dimmed }: { item: GameResponse; onPress: () => void; dimmed?: boolean }) {
    return (
        <View style={styles.gameCard}>
            <Pressable onPress={onPress}>
                <View>
                    <Image source={{ uri: item.img ?? undefined }} style={styles.gameImage} />
                    {dimmed && <View style={styles.imageOverlay} />}
                    <View style={styles.sportBadge}>
                        <Text style={styles.sportBadgeText}>Volleyball</Text>
                    </View>
                </View>
                <View style={styles.gameInfoRow}>
                    <Text style={styles.gameHost}>{item.organizer.name} I</Text>
                    <Text style={styles.gameLevel}>{item.level_required.toUpperCase()}</Text>
                </View>
                <Text style={styles.gameTitle}>{item.title}</Text>
                <View style={styles.gameDetailsRow}>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="calendar-outline" size={14} color="gray" />
                        <Text style={styles.gameInfo}>{formatGameDate(item.date)}</Text>
                    </View>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="location" size={14} color="gray" />
                        <Text style={styles.gameInfo}>{item.location}</Text>
                    </View>
                </View>
                <View style={styles.gameDetailsRow}>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="time" size={14} color="gray" />
                        <Text style={styles.gameInfo}>{`${formatTime(item.start_time)}-${formatTime(item.end_time)}`}</Text>
                    </View>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="person" size={14} color="gray" />
                        <Text style={styles.gameInfo}>{`${item.reserved_spots}/${item.total_spots}`}</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    gameCard: {
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 18,
        marginBottom: 12,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    gameImage: {
        width: '100%',
        height: 80,
        marginBottom: 6,
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sportBadge: {
        position: 'absolute',
        bottom: 8,
        right: 4,
        backgroundColor: 'rgba(75, 75, 75, 0.5)',
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
    },
    sportBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
    gameHost: {
        fontSize: 12,
        fontWeight: "400",
        paddingHorizontal: 1,
        paddingTop: 6,
        marginBottom: 8,
        color: "#27253F",
    },
    gameLevel: {
        fontSize: 11.5,
        fontWeight: "500",
        paddingHorizontal: 2,
        paddingTop: 6,
        marginBottom: 8,
        color: "#D81159",
    },
    gameTitle: {
        fontSize: 13.5,
        fontWeight: "500",
        paddingHorizontal: 15,
        marginBottom: 10,
        color: "black",
    },
    gameInfoRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    gameDetailsRow: {
        flexDirection: 'row',
        paddingHorizontal: 2,
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    gameInfo: {
        fontSize: 11,
        fontWeight: "400",
        paddingHorizontal: 6,
        color: "gray",
    },
});
