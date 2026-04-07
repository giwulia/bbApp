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


export default function Game() {
    const {id} = useLocalSearchParams<{id:string}>();
    const [game, setGame] = useState<GameResponse|null>(null)  // game === null from first render *
    const [isTeamView, setIsTeamView] = useState(false)
    const [imgReady, setImgReady]= useState(false)
    const router = useRouter();


    useEffect(() => {
        let cancelled = false;
        (async() => {
            setGame(null);
            setImgReady(false);

            const data = await getGame(id);
            if (!data) return;
            if (cancelled) return;  // if this effect is no longer valid, stop immediately

            setGame(data);

            try {
                await Image.prefetch(data.img)
                }
            finally {
                if (!cancelled) setImgReady(true)
            }
        })()

        return () => {
            cancelled = true;
        }
    }, [id]) //render again after id changes

    const translateX= useSharedValue(0);
    const screenWidth = Dimensions.get('window').width;
    const pan = Gesture.Pan()
        .onChange((e) => {
            translateX.value = e.translationX
        })
        .onEnd((e) => {
                if (e.translationX > screenWidth / 4) {
            // user swiped more than half the screen → go back
            runOnJS(setIsTeamView)(false);
            translateX.value = withSpring(screenWidth); // optional: animate to full page width
            } else {
            // snap back to start
            translateX.value = withSpring(0);
            }
        }).failOffsetY([-5,5])

    const animatedStyle= useAnimatedStyle(()=> ({
        transform:[{ translateX: translateX.value}]
    }))

    if (!game || !imgReady) return <Text> Loading game... </Text> // we need to define what to show on the first render *

    const showTeamView = () => setIsTeamView(true)

    const DefaultAvatar = ({name}:{name:string}) => {
        const parts = name.split(" ")
        const initials = 
            parts.length>1? parts[0][0] + parts[1][0]: parts[0][0]

        return (
            <View style = {styles.defaultAvatar}>
                <Text style = {styles.defaultAvatarText}>{initials}</Text>
            </View>
        )
    }

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
                        <GestureDetector gesture={Gesture.Simultaneous(pan)}>
                            <ScrollView style={{ flex: 1 }}>
                            <Animated.View style={animatedStyle}>
                                {positions.map(({key, label}) => {
                                    const playersForPosition = game.players.filter(p => p.position === key);
                                    const slotsForPositions = game.position_slots?.[key] ?? 0;
                                    return (
                                        <View key={key} style = {styles.teamPositionCard}>
                                            <Text style={styles.teamMediumTitleCentered}>{label}</Text>
                                            <View style = {styles.teamPositionRow}>
                                                {Array.from({length:slotsForPositions},(_,i) => {
                                                    const player = playersForPosition[i];
                                                    return (
                                                        <View key = {player?.user_id ?? `empty-${key}-${i}`} style = {styles.teamPositionProfileSet}>
                                                                {player ? (
                                                                    <>
                                                                    <Pressable
                                                                        onPress={() =>
                                                                        router.push({
                                                                            pathname: "./profile",
                                                                            params: { id: player.user_id },
                                                                        })
                                                                        }
                                                                        style={styles.teamPositionProfile}
                                                                    >
                                                                        {player.image ? (
                                                                        <Image source={{ uri: player.image }} />
                                                                        ) : (
                                                                        <DefaultAvatar name={player.name} />
                                                                        )}
                                                                    </Pressable>

                                                                    <Text style={styles.teamPositionName}>
                                                                        {player.name.split(" ")[0]}
                                                                    </Text>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                    <Pressable
                                                                        onPress={() =>
                                                                        router.push({
                                                                            pathname: "./checkout",
                                                                            params: {
                                                                            gameId: game.id,
                                                                            gameTitle: game.title,
                                                                            position: key, // 🔥 dynamic now
                                                                            price: game.price_per_spot,
                                                                            image: game.img,
                                                                            },
                                                                        })
                                                                        }
                                                                        style={styles.teamPositionProfile}
                                                                    >
                                                                        <DefaultAvatar name="+" />
                                                                    </Pressable>

                                                                    <Text style={styles.teamPositionName}></Text>
                                                                    </>
                                                                )}

                                                                </View>
                                                            );
                                                            })}
                                                        </View>
                                                        </View>
                                                    );
                                                    })}
                            </Animated.View>
                            </ScrollView>
                        </GestureDetector>
                    :
                        <>
                            <Text style={styles.mediumTitle}>THE HOST</Text>
                                <View style={styles.mediumHostCard}>
                                    <View style={styles.hostSquareProfile}/>
                                    <View style ={styles.mediumHostText}>
                                        <Text style={styles.gameHost}>{game.organizer.name.toUpperCase()}</Text>
                                        <Text style={[styles.gameHost, {color: "#D81159"}]}>{`${game.organizer.games_organized} GAMES HOSTED`}</Text>
                                    </View>
                                </View>
                            <Text style={styles.mediumTitle}>THE TEAM</Text>
                            <View style={styles.mediumTeamCard}>
                                <Pressable style ={styles.teamCircleProfileGroup} onPress = {showTeamView}>
                                    <View style={[styles.teamCircleProfile, {marginLeft:15}]}/>
                                    <View style={styles.teamCircleProfile}/>
                                    <View style={styles.teamCircleProfile}/>
                                    <View style={styles.teamCircleProfile}/>
                                </Pressable>
                                <Text style={[styles.gameInfo,{marginEnd:10}]}>{`${game.reserved_spots}/${game.total_spots} spots `}</Text>
                            </View>
                            <Text style={[styles.gameDescriptionTitle]}>DESCRIPTION</Text>
                            <View style = {styles.gameDescriptionCard}>
                                <Text style={styles.gameDescription}>{game.description} </Text>
                            </View>
                        </>
                    }
                </ParallaxScrollView>
                <View style = {styles.joinGameCard}>
                    <View style = {{flexDirection:'column', paddingHorizontal: 20}}>
                        <Text style={styles.priceLabel}>SINGLE ENTRY</Text>
                        <Text style={[styles.priceValue, {marginBottom:4}]}>{`£${game.price_per_spot}`}</Text>
                    </View>
                    <Pressable style={styles.joinGameButton}
                        onPress={() => router.push({
                            pathname: "./checkout",
                            params: {
                                gameId: game.id,
                                gameTitle: game.title,
                                price: game.price_per_spot,
                                image: game.img,
                            }
                        })}>
                        <Text style={styles.joinGameText}>Join Game</Text>
                    </Pressable>
                </View>
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
    gameDescriptionCard: {
        backgroundColor: "#ecf1f5",
        alignItems:'flex-start',
        flexDirection:"column",
        flex:1,
        borderRadius:10,
        marginTop:-9,
    },
    gameDescription: {
        fontSize: 14,
        fontWeight: "300",
        color: "dark-grey",
        marginStart:12,
        marginTop:10,
        marginBottom:10
    },
    gameDescriptionTitle: {
        fontSize:13,
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
        marginHorizontal:15,
        backgroundColor: "#27253F" ,
        elevation: 3,
        height:48,
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
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
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