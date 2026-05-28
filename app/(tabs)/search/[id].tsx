import ParallaxScrollView from '@/components/parallax-scroll-view';
import { getGame } from '@/src/api/client';
import { GameResponse } from '@/src/api/types';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatGameDate, formatTime } from "../../../src/utils/format";

export default function Game() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [game, setGame] = useState<GameResponse | null>(null);
    const [imgReady, setImgReady] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const data = await getGame(id);
            if (!data || cancelled) return;
            setGame(data);
            if (data.img) await Image.prefetch(data.img).catch(() => {});
            if (!cancelled) setImgReady(true);
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (!game) return <Text> Loading game... </Text>;

    const navigateToTeam = () => {
        router.push({
            pathname: './team',
            params: {
                id: game.id,
                gameTitle: game.title,
                price: String(game.price_per_spot),
                image: game.img ?? '',
                total_spots: String(game.total_spots),
                players: JSON.stringify(game.players),
                positionSlots: game.position_slots ? JSON.stringify(game.position_slots) : '',
            },
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
                headerImage={
                    <Image
                        source={game.img ? { uri: game.img } : undefined}
                        style={styles.gameImage}
                        onLoadEnd={() => setImgReady(true)}
                    />
                }>
                <Text style={styles.gameTitle} numberOfLines={2}>{game.title.toUpperCase()}</Text>
                <View style={[styles.gameInfoRow, { marginBottom: 0 }]}>
                    <Text style={styles.gameLevel}>{game.level_required.toUpperCase()}</Text>
                </View>
                <View style={styles.gameDetailsRow}>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="calendar-outline" size={16} color="gray" />
                        <Text style={styles.gameInfo}>{formatGameDate(game.date)}</Text>
                    </View>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="location" size={16} color="gray" />
                        <Text style={styles.gameInfo}>{game.location}</Text>
                    </View>
                </View>
                <View style={styles.gameDetailsRow}>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="time" size={16} color="gray" />
                        <Text style={styles.gameInfo}>{`${formatTime(game.start_time)}-${formatTime(game.end_time)}`}</Text>
                    </View>
                    <View style={styles.gameInfoRow}>
                        <Ionicons name="person" size={16} color="gray" />
                        <Text style={styles.gameInfo}>{game.gender.toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.horizontalLine} />

                <Text style={styles.mediumTitle}>YOUR HOST</Text>
                <View style={styles.mediumHostCard}>
                    <View style={styles.hostSquareProfile} />
                    <View style={styles.mediumHostText}>
                        <Text style={styles.gameHost}>{game.organizer.name.toUpperCase()}</Text>
                        <Text style={[styles.gameHost, { color: '#D81159' }]}>{`${game.organizer.games_organized} GAMES HOSTED`}</Text>
                    </View>
                </View>

                <Text style={styles.mediumTitle}>YOUR TEAM</Text>
                <Pressable style={styles.mediumTeamCard} onPress={navigateToTeam}>
                    <View style={styles.teamCircleProfileGroup}>
                        <View style={[styles.teamCircleProfile, { marginLeft: 15 }]} />
                        <View style={styles.teamCircleProfile} />
                        <View style={styles.teamCircleProfile} />
                        <View style={styles.teamCircleProfile} />
                    </View>
                    <View style={styles.teamCardRight}>
                        <Text style={styles.gameInfo}>{`${game.reserved_spots}/${game.total_spots}`}</Text>
                        <Ionicons name="chevron-forward" size={16} color="gray" style={{ marginRight: 12 }} />
                    </View>
                </Pressable>

                <Text style={styles.sectionTitle}>About This Game</Text>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionText} numberOfLines={expanded ? undefined : 3}>
                        {game.description}
                    </Text>
                    <View style={styles.descriptionFooter}>
                        <Pressable onPress={() => setExpanded(!expanded)}>
                            <Text style={styles.expandText}>{expanded ? 'Show less' : 'Read more'}</Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Refund Policy</Text>
                <View style={[styles.sectionCard, { marginBottom: 50 }]}>
                    <Text style={styles.sectionText}>
                        This game has a 24-hour cancellation policy, and if you cancel within that period, you'll be eligible for a full 100% refund.
                    </Text>
                </View>
            </ParallaxScrollView>

            <View style={styles.joinGameCard}>
                <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
                    <Text style={styles.priceLabel}>SINGLE ENTRY</Text>
                    <Text style={[styles.priceValue, { marginBottom: 4 }]}>{`£${game.price_per_spot}`}</Text>
                </View>
                <Pressable style={styles.joinGameButton} onPress={navigateToTeam}>
                    <Text style={styles.joinGameText}>Join Game</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gameImage: {
        width: '100%',
        height: '100%',
    },
    horizontalLine: {
        height: 1,
        backgroundColor: 'silver',
        marginTop: 2,
        marginBottom: 10,
        width: '100%',
    },
    gameTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: 'black',
        textAlign: 'left',
    },
    gameHost: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
        marginTop: 2,
        color: 'dark-grey',
        marginLeft: 10,
    },
    gameLevel: {
        fontSize: 13,
        fontWeight: '500',
        paddingHorizontal: 2,
        marginBottom: 6,
        color: '#D81159',
        marginTop: -6,
    },
    gameInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gameDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    gameInfo: {
        fontSize: 12.5,
        fontWeight: '400',
        paddingHorizontal: 4,
        color: 'dark-grey',
    },
    mediumTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#27253F',
    },
    mediumHostCard: {
        backgroundColor: '#ecf1f5',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        borderRadius: 10,
        marginTop: -9,
    },
    hostSquareProfile: {
        width: 34,
        height: 34,
        borderRadius: 5,
        backgroundColor: 'white',
        borderColor: 'rgba(128,128,128,0.5)',
        borderWidth: 1,
        marginLeft: 15,
    },
    mediumHostText: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
    },
    mediumTeamCard: {
        backgroundColor: '#ecf1f5',
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
        marginTop: -9,
        justifyContent: 'space-between',
    },
    teamCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    teamCircleProfile: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        borderColor: 'rgba(128,128,128,0.5)',
        borderWidth: 1,
        marginHorizontal: -2,
    },
    teamCircleProfileGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandText: {
        color: '#D81159',
        fontSize: 13,
        fontWeight: '500',
        marginRight: 10,
        marginBottom: -8,
        marginTop: -4,
    },
    descriptionFooter: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    sectionCard: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        flex: 1,
        borderRadius: 10,
        marginTop: -12,
    },
    sectionText: {
        fontSize: 13,
        fontWeight: '400',
        color: 'grey',
        marginHorizontal: 1,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#27253F',
        marginTop: 10,
    },
    joinGameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 15,
        paddingVertical: 5,
        backgroundColor: '#27253F',
        elevation: 3,
        height: 48,
        position: 'absolute',
        bottom: 0,
        left: 10,
        right: 10,
    },
    joinGameButton: {
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 15,
        backgroundColor: '#D81159',
        shadowColor: '#D81159',
        height: 33,
    },
    joinGameText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
        marginHorizontal: 12,
    },
    priceLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: '500',
    },
    priceValue: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});
