import DefaultAvatar from "@/components/DefaultAvatar";
import GameCard from "@/components/GameCard";
import { getUser, getUserGames } from '@/src/api/client';
import { GameResponse, User } from "@/src/api/types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [pastGames, setPastGames] = useState<GameResponse[]>([]);
    const [incomingGames, setIncomingGames] = useState<GameResponse[]>([])
    const [gamesView, setGamesView] = useState<'upcoming'|'past'>('upcoming')

    const router = useRouter();

    useFocusEffect(useCallback(() => {
        getUser('giwu').then(setUser);
        getUserGames('upcoming').then(setIncomingGames);
        getUserGames('past').then(setPastGames);
    }, []));

    const pastGamesCount = pastGames.length;

    if (!user) return null;

    return (
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <View style={styles.topSection}>
                <View style={styles.settingsRow}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <Pressable style={styles.addButton} onPress={() => router.push('/createFlow/createGame')}>
                        <Ionicons name="add" size={28} color="#27253F" />
                    </Pressable>
                    <Pressable style={styles.settingsButton} onPress={() => 
                        router.push({
                            pathname:'/profile/settings', 
                            params: { user: JSON.stringify(user) }
                        })}>
                        <Ionicons name="settings" size={26} color="#27253F" />
                    </Pressable>
                </View>
                <View style={styles.divider} />
                <View style={styles.profileDetailsContainer}>
                    {user.image ? (
                        <Image source={{ uri: user.image }} style={styles.profilePicture} />
                    ) : (
                        <DefaultAvatar name={user.name} size={86} fontSize={26} />
                    )}
                    <View style={styles.profileDetailsColumn}>
                        <Text style ={styles.name}>{user.name}</Text>
                        <Text style={styles.gamesPlayed}><Text style={styles.gamesCount}>{pastGamesCount}</Text> played</Text>
                    </View>
                </View>
                <View style={styles.gamesHeaderRow}>
                    <Pressable style={[styles.gamesButton, gamesView === 'upcoming' && styles.gamesButtonActive]} onPress={()=>setGamesView('upcoming')}>
                        <Text style={[styles.gamesButtonText, gamesView === 'upcoming' && styles.gamesButtonTextActive]}>Upcoming</Text>
                    </Pressable>
                    <Pressable style={[styles.gamesButton, gamesView === 'past' && styles.gamesButtonActive]} onPress={()=>setGamesView('past')}>
                        <Text style={[styles.gamesButtonText, gamesView === 'past' && styles.gamesButtonTextActive]}>Past</Text>
                    </Pressable>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {gamesView === 'upcoming'
                    ? incomingGames.map(item =>
                        <GameCard
                            key={item.id}
                            item={item}
                            onPress={() => router.push({ pathname: "/search/[id]", params: { id: item.id } })}
                        />
                    )
                    : pastGames.map(item =>
                        <GameCard
                            key={item.id}
                            item={item}
                            onPress={() => router.push({ pathname: "/search/[id]", params: { id: item.id } })}
                        />
                    )
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topSection:{
        backgroundColor:'white'
    },
    settingsRow: {
        flexDirection:'row',
        marginBottom:15,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal: 20,
    },
    addButton: {
        position: 'absolute',
        left: 20,
    },
    settingsButton: {
        position: 'absolute',
        right: 20,
    },
    profileDetailsContainer:{
        flexDirection:'row',
        paddingVertical:20,
        paddingHorizontal:20,
        gap:15,
        alignItems:'center'
    },
    profilePicture: {
        width: 86,
        height: 86,
        borderRadius: 43,
    },
    profileDetailsColumn:{
        flexDirection:'column'
    },
    userName:{
        fontSize:16,
        fontWeight:'700',
    },
    name:{
        fontSize:15,
        fontWeight:'500'
    },
    gamesPlayed:{
        fontSize:13,
        color:'gray',
    },
    gamesCount:{
        color:'#D81159',
        fontWeight:'700',
    },
    gamesTitle:{
        fontSize:16,
        fontWeight:'400',
        alignSelf:'center'
    },
    gamesHeaderRow:{
        flexDirection:'row',
    },
    gamesButton:{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    gamesButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#D81159',
    },
    gamesButtonText: {
        fontSize: 14,
        color: 'gray',
    },
    gamesButtonTextActive: {
        color: '#D81159',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
    }
});
