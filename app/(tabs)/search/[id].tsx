import ParallaxScrollView from '@/components/parallax-scroll-view';
import { getGame } from '@/src/api/client';
import { GameResponse } from '@/src/api/types';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatGameDate, formatTime } from "../../../src/utils/format";

export default function Game() {
    const {id} = useLocalSearchParams<{id:string}>();
    const [game, setGame] = useState<GameResponse|null>(null)  // game === null from first render *
    const [imgReady, setImgReady]= useState(false)


    useEffect(() => {
        let cancelled = false;
        (async() => {
            setGame(null);
            setImgReady(false);

            const data = await getGame(id);
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

    if (!game || !imgReady) return <Text> Loading game... </Text> // we need to define what to show on the first render *

    return (
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
                <Text style={styles.mediumTitle}>THE HOST</Text>
                    <View style={styles.mediumHostCard}>
                        <View style={styles.hostSquareProfile}/>
                        <Text style={styles.gameHost}>{game.organizer.name}</Text>
                    </View>
                <Text style={styles.mediumTitle}>THE TEAM</Text>
                <View style={styles.mediumTeamCard}>
                    <View style ={styles.teamCircleProfileGroup}>
                        <View style={[styles.teamCircleProfile, {marginLeft:15}]}/>
                        <View style={styles.teamCircleProfile}/>
                        <View style={styles.teamCircleProfile}/>
                        <View style={styles.teamCircleProfile}/>
                    </View>
                    <Text style={[styles.gameInfo,{marginEnd:10}]}>{`${game.reserved_spots}/${game.total_spots} spots `}</Text>
                </View>
                <Text style={[styles.gameTitle, {fontSize:21, marginTop:18, color: "dark-grey"}]}>DESCRIPTION</Text>
                <Text style={styles.gameDescription}>{game.description} </Text>
            </ParallaxScrollView>
            <View style = {styles.joinGameCard}>
                <Text style={styles.priceText}>
                    {game.price_per_spot}
                </Text>
                <Pressable style={styles.joinGameButton}>
                    <Text style={styles.joinGameText}>Join Game</Text>
                </Pressable>
            </View>
        </View>
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
        marginBottom:2,
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
        fontSize: 11.5,
        fontWeight: "500",
        marginBottom: 6,
        color: "dark-grey",
        marginLeft:10
    },
    gameLevel: {
        fontSize: 13,
        fontWeight: "500",
        paddingHorizontal: 2,
        marginBottom: 6,
        color: "dodgerblue",
        marginTop:-4
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
        color: "dark-grey"
    },
    mediumHostCard:{
        backgroundColor: "rgba(30,144,255,0.1)",
        flexDirection:"row",
        height:50,
        alignItems:'center',
        borderRadius:10,
        marginTop:-8
    },
    hostSquareProfile:{
        width: 34,           // circle diameter
        height: 34,          // same as width
        borderRadius: 5,    // half of width/height
        backgroundColor: 'white',
        borderColor:'rgba(128,128,128,0.5)',
        borderWidth:1,
        marginInlineStart:15
    },
    mediumTeamCard:{
        backgroundColor: "rgba(30,144,255,0.1)",
        flexDirection:"row",
        height:50,
        alignItems:'center',
        borderRadius:10,
        marginTop:-8,
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
    gameDescription: {
        fontSize: 14,
        fontWeight: "300",
        color: "dark-grey",
    },
    joinGameCard:{
        flexDirection:'row',
        alignItems:'stretch',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 0,
        marginHorizontal:20,
        backgroundColor: "rgba(128,128,128,0.3)" ,
        shadowColor: "#1E90FF",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        height:40
    },
    priceText:{
        color:"white",
        fontSize:15,
        fontWeight:"600",
    },
    joinGameButton: {
        justifyContent:'flex-end',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 12,
        marginHorizontal:90,
        backgroundColor: "rgba(30,144,255,0.8)",
        shadowColor: "#1E90FF",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    joinGameText:{
        color:"white",
        fontSize:15,
        fontWeight:"600"
    }
})