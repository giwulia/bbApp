import ParallaxScrollView from '@/components/parallax-scroll-view';
import { GestureHandlerRootView,Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { getGame, joinGame } from '@/src/api/client';
import { GameResponse } from '@/src/api/types';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { formatGameDate, formatTime } from "../../../src/utils/format";

function DefaultAvatar({name}:{name:string}) {
    const parts = name.split(" ");
    const initials = parts.length >1 ? parts[0][0] + parts[1][0] : parts[0][0];

    return (
        <View style = {styles.defaultAvatar}>
            <Text style = {styles.defaultAvatarText}>{initials}</Text>
        </View>
    )
}

function PlayerSlot({player, onPress}:{player?: any, onPress: () => void}) {
    return (
        <View style= {styles.teamPositionProfileSet}>
            <Pressable
                onPress={onPress}
                style={styles.teamPositionProfile}
            >
                {player? (
                    player.image ? (
                        <Image source={{uri:player.image}}/>
                    ): (
                        <DefaultAvatar name={player.name}/>
                    )
                ) : (
                    <DefaultAvatar name='+'/>
                    )}
            </Pressable>
            <Text style={styles.teamPositionName}>{player?.name?.split(" ")[0] ?? ""}</Text>
        </View>
    )}

function TeamPositionRow({label, players, slots, onPlayerPress, onEmptyPress}:{label:string, players:any[], slots:number, onPlayerPress: (player:any) => void, onEmptyPress: () => void}) {

    return (
        <View style = {styles.teamPositionCard}>
            <Text style = {styles.teamMediumTitleCentered}>{label}</Text>
            <View style = {styles.teamPositionRow}>
                {Array.from({length:slots}, (_,i) => {
                    const player = players[i];
                    return (
                        <PlayerSlot
                            key  = {player?.user_id ?? `empty-${label}-${i}`}
                            player={player}
                            onPress={() => player ? onPlayerPress(player) : onEmptyPress()}
                        />
                    )
                })}
            </View>
        </View>
    )}

export default function Game() {
    const {id} = useLocalSearchParams<{id:string}>();
    const [game, setGame] = useState<GameResponse|null>(null)  // game === null from first render *
    const [isTeamView, setIsTeamView] = useState(false)
    const [imgReady, setImgReady]= useState(false)
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);

            const data = await getGame(id);
            if (!data || cancelled) return;

            setGame(data);

            await Image.prefetch(data.img).catch(() => {});
            if (!cancelled) setImgReady(true);

            setLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, [id]); //render again after id changes

    const translateX = useSharedValue(0);
    const screenWidth = Dimensions.get('window').width;

    const pan = Gesture.Pan()
        .activeOffsetX([-15, 15])   // must move horizontally enough before activating
        .failOffsetY([-10, 10])  // allow vertical scroll
        .onChange((e) => {
            let x = Math.max(0, e.translationX);

            // resistance after 60% drag
            if (x > screenWidth * 0.6) {
                x = screenWidth * 0.6 + (x - screenWidth * 0.6) * 0.3;
            }

            translateX.value = Math.min(x * 0.9, screenWidth);
        })
        .onEnd((e) => {
            const shouldClose =
                e.translationX > screenWidth * 0.25 || e.velocityX > 800;

            if (shouldClose) {
                translateX.value = withSpring(
                    screenWidth,
                    {
                        damping: 18,
                        stiffness: 220,
                        mass: 0.8,
                    },
                    (finished) => {
                        if (finished) {
                            runOnJS(setIsTeamView)(false);
                        }
                    }
                );
            } else {
                translateX.value = withSpring(0, {
                    damping: 20,
                    stiffness: 150,
                });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    if (!game) return <Text> Loading game... </Text> // we need to define what to show on the first render *

    const showTeamView = () => {
        translateX.value = 0;
        setIsTeamView(true)
    };

    {/****To be modified later for other sports****/}
    const positions = [
        { key: "setter", label: "SETTERS" },
        { key: "outside", label: "OUTSIDES" },
        { key: "middle", label: "MIDDLES" },
        { key: "opposite", label: "OPPOSITES" },
        { key: "libero", label: "LIBEROS" },
    ];


    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ParallaxScrollView
                    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
                    headerImage={
                    <Image source={{ uri: game.img }} style={styles.gameImage}
                        onLoadEnd={()=> setImgReady(true)}
                    />
                }>
                    <Text style={styles.gameTitle}>{game.title.toUpperCase()} </Text>
                    <View style = {[styles.gameInfoRow, {marginBottom:0}]}>
                        {/*<Text style={styles.gameHost}>{game.organizer.name} I</Text>*/}
                        <Text style={[styles.gameLevel]}>{game.level_required.toUpperCase()}</Text>
                    </View>
                    <View style={styles.gameDetailsRow}>
                        <View style ={styles.gameInfoRow}>
                            <Ionicons name="calendar-outline" size ={16} color ="gray"/>
                            <Text style={styles.gameInfo}>{formatGameDate(game.date)}</Text>
                        </View>
                        <View style ={styles.gameInfoRow}>
                            <Ionicons name="location" size ={16} color ="gray"/>
                            <Text style={styles.gameInfo}>{game.location}</Text>
                        </View>
                    </View>
                    <View style={styles.gameDetailsRow}>
                        <View style ={styles.gameInfoRow}>
                            <Ionicons name="time" size ={16} color ="gray"/>
                            <Text style={styles.gameInfo}>{`${formatTime(game.start_time)}-${formatTime(game.end_time)}`}</Text>
                        </View>
                        <View style ={styles.gameInfoRow}>
                            <Ionicons name="person" size ={16} color ="gray"/>
                            <Text style={styles.gameInfo}>{game.gender.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.horizontalLine}/>
                    {isTeamView?
                        <GestureDetector gesture={pan}>
                            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                                    {positions.map(({ key, label }) => {
                                        const playersForPosition = game.players.filter(
                                            (p) => p.position === key
                                        );
                                        const slotsForPositions = game.position_slots?.[key] ?? 0;

                                        return (
                                            <TeamPositionRow
                                                key={key}
                                                label={label}
                                                players={playersForPosition}
                                                slots={slotsForPositions}
                                                onPlayerPress={(player) =>
                                                    router.push({
                                                        pathname: "./profile",
                                                        params: { id: player.user_id },
                                                    })
                                                }
                                                onEmptyPress={() =>
                                                    router.push({
                                                        pathname: "./checkout",
                                                        params: {
                                                            gameId: game.id,
                                                            position: key,
                                                            gameTitle: game.title,
                                                            price: game.price_per_spot,
                                                            image: game.img,
                                                        },
                                                    })
                                                }
                                            />
                                        );
                                    })}
                            </Animated.View>
                        </GestureDetector>
                    :
                        <>
                            <Text style={styles.mediumTitle}>YOUR HOST</Text>
                                <View style={styles.mediumHostCard}>
                                    <View style={styles.hostSquareProfile}/>
                                    <View style ={styles.mediumHostText}>
                                        <Text style={styles.gameHost}>{game.organizer.name.toUpperCase()}</Text>
                                        <Text style={[styles.gameHost, {color: "#D81159"}]}>{`${game.organizer.games_organized} GAMES HOSTED`}</Text>
                                    </View>
                                </View>
                            <Text style={styles.mediumTitle}>YOUR TEAM</Text>
                            <View style={styles.mediumTeamCard}>
                                <Pressable style ={styles.teamCircleProfileGroup} onPress = {showTeamView}>
                                    <View style={[styles.teamCircleProfile, {marginLeft:15}]}/>
                                    <View style={styles.teamCircleProfile}/>
                                    <View style={styles.teamCircleProfile}/>
                                    <View style={styles.teamCircleProfile}/>
                                </Pressable>
                                <Text style={[styles.gameInfo,{marginEnd:10}]}>{`${game.reserved_spots}/${game.total_spots} `}</Text>
                            </View>
                            <Text style={[styles.sectionTitle]}>About This Game</Text>
                            <View style = {styles.sectionCard}>
                                <Text style={styles.sectionText} numberOfLines={ expanded? undefined:3}>
                                    {game.description}
                                </Text>
                                <View style={styles.descriptionFooter}>
                                    <Pressable onPress={() => setExpanded(!expanded)}>
                                        <Text style={styles.expandText}>
                                        {expanded ? "Show less" : "Read more"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                            <Text style={[styles.sectionTitle]}>Refund Policy</Text>
                            <View style = {[styles.sectionCard, {marginBottom: 50}]}>
                                <Text style={styles.sectionText}>
                                    This game has a 24-hour cancellation policy, and if you cancel within that period, you'll be eligible for a full 100% refund.
                                </Text>
                            </View>
                        </>
                    }
                </ParallaxScrollView>
                {!isTeamView && (
                    <View style={styles.joinGameCard}>
                        <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
                            <Text style={styles.priceLabel}>SINGLE ENTRY</Text>
                            <Text style={[styles.priceValue, { marginBottom: 4 }]}>
                                {`£${game.price_per_spot}`}
                            </Text>
                        </View>

                        <Pressable style={styles.joinGameButton} onPress={showTeamView}>
                            <Text style={styles.joinGameText}>Join Game</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </GestureHandlerRootView>
    )
}

export const styles = StyleSheet.create({
    layout: {
        flex: 1,
        paddingTop: 70,
        backgroundColor: 'aliceblue'
    },
    horizontalLine:{
        height:1,
        backgroundColor:'silver',
        marginTop:2,
        marginBottom:10,
        width:'100%'
    },
    gameTitle: {
        fontSize: 23,
        fontWeight: "600",
        color:'black',
        textAlign:"left"
    },
    gameImage: {
        width: '100%',
        height: '100%'
    },
    gameHost: {
        fontSize: 11,
        fontWeight: "600",
        marginBottom: 2,
        marginTop:2,
        color: "dark-grey",
        marginLeft:10
    },
    gameLevel: {
        fontSize: 13,
        fontWeight: "500",
        paddingHorizontal: 2,
        marginBottom: 6,
        color: "#D81159",
        marginTop:-6
    },
    gameInfoRow: {
        flexDirection:'row',
        alignItems:'center'
    },
    gameDetailsRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:3
    },
    gameInfo: {
        fontSize: 12.5,
        fontWeight: "400",
        paddingHorizontal: 4,
        color: "dark-grey",
    },
    gameCard: {
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 18,
        marginBottom: 12,
        paddingBottom:8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        overflow: "hidden",   //

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },

        elevation: 2,
    },
    mediumTitle:{
        fontSize: 13,
        fontWeight: "700",
        color: "#27253F"
    },
    mediumHostCard:{
        backgroundColor: "#ecf1f5",
        alignItems:'center',
        flexDirection:"row",
        height:50,
        borderRadius:10,
        marginTop:-9
    },
    hostSquareProfile:{
        width: 34,           // circle diameter
        height: 34,          // same as width
        borderRadius: 5,    // half of width/height
        backgroundColor: 'white',
        borderColor:'rgba(128,128,128,0.5)',
        borderWidth:1,
        marginLeft:15
    },
    mediumTeamCard:{
        backgroundColor: "#ecf1f5",
        flexDirection:"row",
        height:50,
        alignItems:'center',
        borderRadius:10,
        marginTop:-9,
        justifyContent:'space-between'
    },
    teamCircleProfile:{
        width: 24,           // circle diameter
        height: 24,          // same as width
        borderRadius: 12,    // half of width/height
        backgroundColor: 'white',
        borderColor:'rgba(128,128,128,0.5)',
        borderWidth:1,
        marginHorizontal:-2,
    },
    teamCircleProfileGroup:{
        flexDirection:'row',
        alignItems:'center'
    },
    expandText:{
        color:"#D81159",
        fontSize:13,
        fontWeight:"500",
        marginRight:10,
        marginBottom:-8,
        marginTop:-4
    },
    descriptionFooter: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    sectionCard: {
        alignItems:'flex-start',
        flexDirection:"column",
        flex:1,
        borderRadius:10,
        marginTop:-12,
    },
    sectionText: {
        fontSize: 13,
        fontWeight: "400",
        color: "grey",
        marginHorizontal:1,
        marginBottom:10
    },
    sectionTitle: {
        fontSize:14,
        fontWeight: "700",
        color: "#27253F",
        marginTop:10,
        marginStart:0
    },
    joinGameCard:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        borderRadius: 15,
        paddingVertical: 5,
        backgroundColor: "#27253F" ,
        elevation: 3,
        height:48,
        position: "absolute",
        bottom: 0,
        left: 10,
        right: 10,
    },
    priceText:{
        color:"white",
        fontSize:11.5,
        fontWeight:"600",
        paddingHorizontal: 16,
        marginBottom:1,
        marginTop:3
    },
    mediumHostText:{
        flexDirection:'column',
        justifyContent: 'center',
        flex:1
    },
    joinGameButton: {
        justifyContent:'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal:15,
        backgroundColor: "#D81159",
        shadowColor: "#D81159",
        height:33
    },
    joinGameText:{
        color:"white",
        fontSize:14,
        fontWeight:"700",
        marginHorizontal:12
    },
    teamBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    teamPanel: {
        position: "absolute",    //placed on top of the normal layout
        bottom: 0,
        width: "100%",
        height:"80%",
        backgroundColor: "white",
        padding: 20,
    },
    teamPositionProfile:{
        width: 50,           // circle diameter
        height: 50,          // same as width
        borderRadius: 9,    // half of width/height
        backgroundColor: "#ecf1f5",
        borderColor:"#ecf1f5",
        borderWidth:1,
        marginHorizontal:6,
        marginBottom:4
    },
    teamPositionProfileSet:{
        flexDirection:'column',
        alignItems:'center',
        marginBottom:9,
    },
    teamPositionCard:{
        alignItems:'flex-start',
        flexDirection:"column",
        marginTop:2,
        marginBottom:17,
    },
    teamPositionRow:{
        alignItems:'center',
        flexDirection:"row",
        marginTop:10,
        flexWrap:'wrap'
    },
    teamPositionName:{
        fontSize:13
    },
    teamMediumTitleCentered: {
        fontSize: 13,
        fontWeight: "700",
        color: "#27253F",
        width:'100%'
    },
    defaultAvatar: {
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'100%'
    },
    defaultAvatarText: {
        fontSize:16,
        fontWeight:300,
        color: "#57547a",
    },
    priceLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 10,
        fontWeight: "500",
    },
    priceValue: {
        color: "white",
        fontSize: 15,
        fontWeight: "700",
    }
})
