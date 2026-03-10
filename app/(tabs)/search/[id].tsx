import ParallaxScrollView from '@/components/parallax-scroll-view';
import { getGame } from '@/src/api/client';
import { GameResponse } from '@/src/api/types';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatGameDate, formatTime } from "../../../src/utils/format";

export default function Game() {
    const {id} = useLocalSearchParams<{id:string}>();
    const [game, setGame] = useState<GameResponse|null>(null)  // game === null from first render *
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [imgReady, setImgReady]= useState(false)


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

    if (!game || !imgReady) return <Text> Loading game... </Text> // we need to define what to show on the first render *

    const openPanel = () => setIsPanelOpen(true)

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
                        <View style ={styles.TextColumn}>
                            <Text style={styles.gameHost}>{game.organizer.name.toUpperCase()}</Text>
                            <Text style={[styles.gameHost, {color:'gray'}]}>{`${game.organizer.games_organized} GAMES HOSTED`}</Text>
                        </View>
                    </View>
                <Text style={styles.mediumTitle}>THE TEAM</Text>
                <View style={styles.mediumTeamCard}>
                    <Pressable style ={styles.teamCircleProfileGroup} onPress = {openPanel}>
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
            </ParallaxScrollView>
            <View style = {styles.joinGameCard}>
                <View style = {{flexDirection:'column'}}>
                    <Text style={styles.priceText}>SINGLE ENTRY</Text>
                    <Text style={styles.priceText}>{`£${game.price_per_spot}`}</Text>
                </View>
                <Pressable style={styles.joinGameButton}>
                    <Text style={styles.joinGameText}>Join Game</Text>
                </Pressable>
            </View>
            <Modal
                visible = {isPanelOpen}
                transparent
                animationType ="slide"
                onRequestClose = {() => setIsPanelOpen(false)}>
                <View style = {{flex:1}}>
                <Pressable style={styles.teamBackdrop} onPress={() => setIsPanelOpen(false)}/>
                <View style={styles.teamPanel}>
                    <View style={styles.teamPanelCircle}/>
                </View>
                </View>
            </Modal>
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
        fontSize: 11,
        fontWeight: "500",
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
        color: "dodgerblue",
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
        color: "dark-grey"
    },
    mediumHostCard:{
        backgroundColor: "rgba(30,144,255,0.1)",
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
        marginInlineStart:15
    },
    mediumTeamCard:{
        backgroundColor: "rgba(30,144,255,0.1)",
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
        backgroundColor: "rgba(30,144,255,0.1)",
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
        fontSize:18,
        fontWeight: "600",
        color: "dark-grey",
        marginTop:7,
        marginStart:0
    },
    joinGameCard:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        borderRadius: 15,
        paddingVertical: 5,
        marginHorizontal:15,
        backgroundColor: "#1c1f26" ,
        shadowColor: "#1E90FF",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        height:48,
    },
    priceText:{
        color:"white",
        fontSize:11.5,
        fontWeight:"600",
        marginStart:25,
        marginBottom:1,
        marginTop:3
    },
    TextColumn:{
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
        backgroundColor: "rgba(30,144,255,1)",
        shadowColor: "#1E90FF",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        height:33
    },
    joinGameText:{
        color:"white",
        fontSize:13,
        fontWeight:"700",
        marginHorizontal:13
    },
    teamBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    teamPanel: {
        position: "absolute",    //placed on top of the normal layout
        bottom: 0,
        width: "100%",
        height:"70%",
        backgroundColor: "white",
        padding: 20,
    },
    teamPanelCircle:{
        width: 48,           // circle diameter
        height: 48,          // same as width
        borderRadius: 24,    // half of width/height
        backgroundColor: 'white',
        borderColor:'rgba(128,128,128,0.5)',
        borderWidth:1,
        marginHorizontal:-2,
    },
})