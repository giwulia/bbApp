import DefaultAvatar from "@/components/DefaultAvatar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

function PlayerSlot({ player, onPress }: { player?: any; onPress: () => void }) {
    return (
        <View style={styles.teamPositionProfileSet}>
            <Pressable onPress={onPress} style={styles.teamPositionProfile}>
                {player ? (
                    player.image ? (
                        <Image source={{ uri: player.image }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <DefaultAvatar name={player.name} />
                    )
                ) : (
                    <View style={styles.emptySlot}>
                        <Text style={styles.emptySlotPlus}>+</Text>
                    </View>
                )}
            </Pressable>
            <Text style={styles.teamPositionName}>{player?.name?.split(" ")[0] ?? ""}</Text>
        </View>
    );
}

function TeamPositionRow({ label, players, slots, onPlayerPress, onEmptyPress }: {
    label: string;
    players: any[];
    slots: number;
    onPlayerPress: (player: any) => void;
    onEmptyPress: () => void;
}) {
    return (
        <View style={styles.teamPositionCard}>
            <Text style={styles.positionLabel}>{label}</Text>
            <View style={styles.teamPositionRow}>
                {Array.from({ length: slots }, (_, i) => {
                    const player = players[i];
                    return (
                        <PlayerSlot
                            key={player?.user_id ?? `empty-${label}-${i}`}
                            player={player}
                            onPress={() => player ? onPlayerPress(player) : onEmptyPress()}
                        />
                    );
                })}
            </View>
        </View>
    );
}


const positions = [
    { key: "setter", label: "SETTERS" },
    { key: "outside", label: "OUTSIDES" },
    { key: "middle", label: "MIDDLES" },
    { key: "opposite", label: "OPPOSITES" },
    { key: "libero", label: "LIBEROS" },
];

export default function TeamSheet() {
    const router = useRouter();
    const { id, gameTitle, price, image, total_spots, players: playersJSON, positionSlots: slotsJSON } =
        useLocalSearchParams<{
            id: string;
            gameTitle: string;
            price: string;
            image: string;
            total_spots:string;
            players: string;
            positionSlots: string;
        }>();

    const players: any[] = JSON.parse(playersJSON ?? '[]');
    const positionSlots: Record<string, number> = JSON.parse(slotsJSON || '{}');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#27253F" />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>{gameTitle}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {slotsJSON !== '' ? (
                    <>
                        <Text style={styles.subtitle}>Select your position</Text>
                        {positions.map(({ key, label }) => {
                            const slots = positionSlots[key] ?? 0;
                            if (slots === 0) return null;
                            const playersInPosition = players.filter((p) => p.position === key);
                            return (
                                <TeamPositionRow
                                    key={key}
                                    label={label}
                                    players={playersInPosition}
                                    slots={slots}
                                    onPlayerPress={(player) =>
                                        router.push({ pathname: './profile', params: { id: player.user_id } })
                                    }
                                    onEmptyPress={() =>
                                        router.push({
                                            pathname: './checkout',
                                            params: { gameId: id, position: key, gameTitle, price, image },
                                        })
                                    }
                                />
                            );
                        })}
                    </>
                ) : (
                    <>
                        <Text style={styles.subtitle}>Open drill — join any spot</Text>
                        {Array.from({ length: Math.ceil(Number(total_spots) / 3) }, (_, rowIndex) => (
                            <View key={`row-${rowIndex}`} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
                                {Array.from({ length: 3 }, (_, colIndex) => {
                                    const slotIndex = rowIndex * 3 + colIndex;
                                    const player = players[slotIndex];
                                    if (slotIndex >= Number(total_spots)) return null;
                                    return (
                                        <PlayerSlot
                                            key={`open-${slotIndex}`}
                                            player={player}
                                            onPress={() => player
                                                ? router.push({ pathname: './profile', params: { id: player.user_id } })
                                                : router.push({ pathname: './checkout', params: { gameId: id, position: 'open', gameTitle, price, image } })
                                            }
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 64,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27253F',
        flex: 1,
    },
    subtitle: {
        fontSize: 13,
        color: 'gray',
        marginBottom: 30,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    teamPositionCard: {
        marginBottom: 15,
    },
    positionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#27253F',
        marginBottom: 12,
    },
    teamPositionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    teamPositionProfileSet: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 9,
        marginRight: 12,
    },
    teamPositionProfile: {
        width: 58,
        height: 58,
        borderRadius: 10,
        backgroundColor: '#ecf1f5',
        borderColor: '#ecf1f5',
        borderWidth: 1,
        marginBottom: 4,
        overflow: 'hidden',
    },
    teamPositionName: {
        fontSize: 13,
        color: '#27253F',
    },
    emptySlot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptySlotPlus: {
        fontSize: 22,
        color: '#9ca3af',
        fontWeight: '300',
    },
});
