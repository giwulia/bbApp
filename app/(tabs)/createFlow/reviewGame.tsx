import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Modal
} from "react-native";
import type { Category, CreateGameBody, GameGender, GameType, SkillLevel } from "../../../src/api/types";
import {createGames} from "../../../src/api/client";

export default function ReviewGame() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [gamePosted, setGamePosted] = useState(false)
    const [message, setMessage] = useState('')

    type Params = {
        title: string
        type: string
        level_required: string
        price_per_spot: string
        gender: string
        description: string
        image: string
        date: string
        start_time: string
        end_time: string
        location: string
        location_url: string
        categories: string,
        total_spots:string,
        preset: string
    }

    const params = useLocalSearchParams<Params>()

    const details = {
        title: params.title,
        type: params.type,
        level_required: params.level_required,
        price_per_spot: Number(params.price_per_spot),
        gender: params.gender,
        description: params.description,
    }

    const timeLocation = {
        date: params.date ? new Date(params.date) : null,
        time: params.start_time ? new Date(params.start_time) : null,
        endTime: params.end_time ? new Date(params.end_time) : null,
        location: params.location,
        locationUrl: params.location_url,
    }

    const timeRange =
    timeLocation.time && timeLocation.endTime
        ? `${timeLocation.time.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        })} - ${timeLocation.endTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        })}`
        : "-";

    const teamSheet ={
        totalSpots: params.total_spots,
        preset: params.preset,
        categories: params.categories
        ? (JSON.parse(params.categories) as Category[])
        : []
    }

    const detailsRows = [
        {
            label: "GAME TITLE",
            value: details.title
        },
        {
            label: "SESSION TYPE",
            value: details.type
        },
        {
            label: "LEVEL",
            value: details.level_required
        },
        {
            label: "PRICE (£)",
            value: details.price_per_spot
        },
        {
            label: "GENDER",
            value: details.gender
        },
        {
            label: "DESCRIPTION",
            value: details.description,
            lines: 1
        },
    ]

    const timeLocationRows = [
        {
            label: "DATE",
            value: timeLocation.date
            ? timeLocation.date.toLocaleDateString("en-GB")
            : "-",
        },
        {
            label: "TIME",
            value: timeRange,
        },
        {
            label: "LOCATION",
            value: timeLocation.location ?? "-",
            lines: 1
        },
    ]

    const teamSheetRows = [
        {
            label: "PLAYERS",
            value: teamSheet.totalSpots ?? "-",
        },
        {
            label: "PRESET",
            value: teamSheet.preset ?? "-",
        },
        {
            label: "POSITIONS",
            value: teamSheet.categories.length
            ? teamSheet.categories
                .map((cat) => `${cat.position} (${cat.slots})`)
                .join(", ")
            : "-",
        },
    ]

    function InfoRow({label,value,numberOfLines} : {label:string; value:string|number, numberOfLines?:number}) {
        return(
            <View style={styles.infoRow}>
                <View style={styles.leftSide}>
                    <Text style={styles.text}>{label}</Text>
                </View>
                <View style={styles.rightSide}>
                    <Text style={[styles.text, {color:"black", flex: 1, textAlign: 'right', fontWeight: '500'}]} numberOfLines={numberOfLines} ellipsizeMode="tail">{value? value : '-'}</Text>
                </View>
            </View>
        )
    }

    const goBackEdit = (step: number) => {
        router.push({
            pathname: "/createFlow/createGame",
            params: {
                step: String(step),
                title: params.title,
                type: params.type,
                level_required: params.level_required,
                price_per_spot: params.price_per_spot,
                image: params.image,
                gender: params.gender,
                description: params.description,
                date: params.date,
                start_time: params.start_time,
                end_time: params.end_time,
                location: params.location,
                location_url: params.location_url,
                total_spots: params.total_spots,
                preset: params.preset,
                categories: params.categories,
            }
        })
    }


    return (
        <View style={[{backgroundColor:'white'},{ flex: 1 }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
            <View style={{ position: 'relative' }}>
                <Image source={{uri: params.image}} style = {styles.coverPhotoLayout}/>
                <Pressable style={styles.closeButton} onPress={() => router.back()}>
                    <Ionicons name="close" size={22} color="white" />
                </Pressable>
            </View>
            <View style={styles.layout}>
                <View style={[styles.box, {marginTop:10}]}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.leftSide}>
                            <Text style={styles.title}>Details</Text>
                        </View>
                        <View style={styles.rightSide}>
                            <Pressable onPress={()=> goBackEdit(1)}>
                                    <Feather name='edit-3' size={16} color="#D81159" />
                            </Pressable>
                        </View>
                    </View>
                    {detailsRows.map((row) => (
                        <InfoRow key={row.label} label={row.label} value={String(row.value)} numberOfLines={row.lines} />
                    ))}
                </View>
                <View style={styles.box}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.leftSide}>
                            <Text style={styles.title}>Date & Location</Text>
                        </View>
                        <View style={styles.rightSide}>
                            <Pressable onPress={()=> goBackEdit(2)}>
                                    <Feather name='edit-3' size={16} color="#D81159" />
                            </Pressable>
                        </View>
                    </View>
                        {timeLocationRows.map((row) => (
                            <InfoRow key={row.label} label={row.label} value={row.value} />
                        ))}
                </View>
                <View style={styles.box}>
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.leftSide}>
                            <Text style={styles.title}>Team Sheet</Text>
                        </View>
                        <View style={styles.rightSide}>
                            <Pressable onPress={()=> goBackEdit(3)}>
                                    <Feather name='edit-3' size={16} color="#D81159" />
                            </Pressable>
                        </View>
                    </View>
                {teamSheetRows.map((row)=> (
                    <InfoRow key={row.label} label ={row.label} value={row.value}/>
                ))}
            </View>
            </View>
            </ScrollView>
            {error ? <Text style={{ color: '#D81159', textAlign: 'center', marginBottom: 8, marginHorizontal: 15 }}>{error}</Text> : null}
            <Pressable
                style={[styles.publishButton, loading && { opacity: 0.6 }]}
                disabled={loading}
                onPress={async () => {
                    if (loading) return;
                    setLoading(true);
                    setError('');
                    try {
                        const gameType = (params.type ?? '').toLowerCase() as GameType;
                        const categories: Category[] = params.categories ? JSON.parse(params.categories) : [];
                        const position_slots = gameType === 'game' && categories.length > 0
                            ? categories.reduce<Record<string, number>>((acc, cat) => ({
                                ...acc,
                                [cat.position.toLowerCase()]: cat.slots,
                            }), {})
                            : null;

                        const d = new Date(params.date);
                        const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        const start_time = new Date(params.start_time).toTimeString().split(' ')[0];
                        const end_time = new Date(params.end_time).toTimeString().split(' ')[0];

                        const body: CreateGameBody = {
                            title: params.title,
                            type: gameType,
                            level_required: (params.level_required ?? '').toLowerCase() as SkillLevel,
                            date,
                            start_time,
                            end_time,
                            location: params.location ?? '',
                            location_url: params.location_url ?? '',
                            gender: (params.gender ?? '').toLowerCase() as GameGender,
                            total_spots: Number(params.total_spots),
                            price_per_spot: Number(params.price_per_spot),
                            description: params.description ?? '',
                            img: params.image,
                            position_slots,
                            reserved_spots: 0,
                            template_id: null,
                        };

                        const game = await createGames(body);
                        router.replace({ pathname: '/search/[id]', params: { id: game.id } });
                        setGamePosted(true);
                        setMessage('Game published successfully!');
                    } catch (e: any) {
                        setError(e.message ?? 'Failed to publish game');
                        setMessage(e.message ?? 'Failed to publish game');
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                {loading
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.publishButtonText}>Publish Game</Text>
                }
            </Pressable>
            <Modal
                visible={message !== ''}
                transparent
                animationType="fade"
                onRequestClose={() => setMessage('')}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalMessage}>{message}</Text>
                        <Pressable onPress={() => { setMessage(''); if (gamePosted) router.back(); }} style={styles.modalClose}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )

}

export const styles = StyleSheet.create({
    coverPhotoLayout: {
        width: '100%',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(117, 117, 118)',
        marginBottom:15,
    },
    layout: {
        marginHorizontal: 20,
    },
    box: {
        width:'100%',
        borderWidth: 1,
        borderColor:'silver',
        borderRadius:5,
        marginBottom:20,
        padding:13,
    },
    title:{
        fontSize:15,
        fontWeight:'500',
        color:'#27253F',
    },
    infoRow:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:8
    },
    sectionHeaderRow:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:12
    },
    text:{
        fontSize:13,
        fontWeight:'400',
        color:'gray',
    },
    leftSide: {
        flex: 1,
    },
    rightSide: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
    },
    backButton:{
        color:'#D81159',
        fontWeight:'600',
        fontSize:14
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // small spacing between icon + text
        marginVertical:20
    },
    publishButton: {
        position: 'absolute',
        bottom: 0,
        left: 15,
        right: 15,
        justifyContent:'center',
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "#D81159",
        shadowColor: "#D81159",
        paddingVertical: 10,
    },
    publishButtonText:{
        color:"white",
        fontSize:14,
        fontWeight:"700",
        marginHorizontal:12,
        alignSelf:'center'
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 20,
        padding: 4,
    },
        modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxWidth: 400,
        width: '100%',
    },
    modalMessage: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27253F',
    },
    modalClose: {
        marginTop: 20,
        alignSelf: 'flex-end',
    },
    modalCloseText: {
        color: '#D81159',
        fontWeight: '600',
    },
})
