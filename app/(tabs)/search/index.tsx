import { Feather, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { listGames } from "../../../src/api/client";
import type { GameResponse, SkillLevel } from "../../../src/api/types";
import { formatDateFilter, formatGameDate, formatTime } from "../../../src/utils/format";


export default function Games() {
    const [games, setGames] = useState<GameResponse[]>([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPanelOpen, setIsPanelOpen] = useState(false) // useState only inside components
    const [filters, setFilters] = useState ({
        sport: "",
        city: "",
        level: "",
        gender: "",
        datePreset: "",
        date: null,
    })
    const [date, setDate] = useState("");

    //Loading Games
    const loadGames = async() => {
        setIsLoading(true)
        try {
            const res = await listGames();
            setGames(res.games);
        } catch (e) {
            setError("Failed to load games");
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {loadGames()}, [])

    //Defining filters
    const openPanel = () => {
        setIsPanelOpen(true)
    }

    const selectDate =(date:string) => {
        setDate(date)
    }

    const cities = ["London", "Manchester", "Brighton", "Newcastle", "Birmingham"]
    const selectCity = (city:string) => {
        setFilters(prev => ({
            ...prev,
            city: prev.city === city ? "" : city
        }));
    };

    const skillLevels: SkillLevel[] = ["beginner", "intermediate", "advanced", "competitive"]
    const selectLevel = (level: SkillLevel) => {
        setFilters(prev => ({
            ...prev,
            level: prev.level === level ? "" : level
        }));
    };

    const gender = ["male","female","mixed"]
    const selectGender = (gender:string) => {
        setFilters(prev=> ({
            ...prev,
            gender: prev.gender === gender ? "":gender
        }))
    }

    const filteredGames = useMemo(() => {
        const q = query.trim().toLowerCase();
        const level = filters.level;
        const city = filters.city
        const gender = filters.gender
        const dateFilter = date

        const getFilterDate = (date:string) => {
            const now = new Date();

            const today = new Date(now).setHours(0,0,0,0)

            const tomorrowDate = new Date(now)
            tomorrowDate.setDate(tomorrowDate.getDate() +1)
            const tomorrow = tomorrowDate.setHours(0,0,0,0)

            // This Week: today -> end of week (Sunday)
            const endOfWeek = new Date(now);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            const end = endOfWeek.setHours(23, 59, 59, 999)
            const start = today;

            if (date === "Today") return {type: "single" as const, value:today}
            if (date === "Tomorrow") return {type: "single" as const, value:tomorrow}
            if (date === "This Week") return  {type: "range" as const, start: today, end };
            if (date === "Anytime" ) return {type: "any" as const};
            return {type: "any" as const}
        }

        const filter = getFilterDate(dateFilter);

        const isMatchDate = (gameDayT: number, filter: ReturnType<typeof getFilterDate>) => {
            if (filter.type === "any") return true;
            if (filter?.type === "single") return gameDayT===filter.value
            return gameDayT >= filter.start && gameDayT <= filter.end
        }

        return games.filter((g) => {
            // normalize API value
            const gameLevel = (g.level_required ?? "").trim().toLowerCase();
            const gameTitle = (g.title ?? "").toLowerCase();
            const gameLocation = (g.location ?? "").toLowerCase();
            const gameCity = (g.city ?? "").trim().toLowerCase()
            const gameGender = (g.gender ?? "").trim().toLowerCase()
            const gameDayT = formatDateFilter(g.date)
            const gameOrganizer = (g.organizer.name ?? "").trim().toLowerCase()

            const matchesCity = !city || gameCity === city  //if city is empty string  then first condition is true
            const matchesLevel = !level || gameLevel === level;
            const matchesGender = !gender || gameGender === gender;
            const matchesQuery = !q || gameTitle.includes(q) || gameLocation.includes(q) || gameOrganizer.includes(q);
            const matchesDate = isMatchDate(gameDayT, filter)
            return matchesLevel && matchesQuery && matchesCity && matchesGender && matchesDate
            });
        }, [games, query, filters.level, filters.city,filters.gender, date]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="small" color="lightblue" />
            </View>
        );
    }

    if (error) {
        return <Text>Failed to load games</Text>;
    }

    return (
        <View style={styles.layout}>
            <View style ={styles.searchBarCard}>
                <Feather name='search' size={15}/>
                <TextInput
                    style={styles.searchBarText}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search games"
                />
                <Pressable onPress = {openPanel} style={styles.filterButton}>
                    <Ionicons name="filter" size={20} />
                </Pressable>
            </View>
            <View style = {styles.filterDatesRow}>
                <Pressable onPress={()=> selectDate("Anytime")} style={[styles.filterDateButton, date ==="Anytime" && styles.filterSelectedDateButton]}>
                    <Text style={styles.filterDateText}>Anytime</Text>
                </Pressable>
                <Pressable onPress={()=> selectDate("Today")} style={[styles.filterDateButton, date ==="Today" && styles.filterSelectedDateButton]}>
                    <Text style={styles.filterDateText}>Today</Text>
                </Pressable>
                <Pressable onPress={()=> selectDate("Tomorrow")} style={[styles.filterDateButton, date ==="Tomorrow" && styles.filterSelectedDateButton]}>
                    <Text style={styles.filterDateText}>Tomorrow</Text>
                </Pressable>
                <Pressable onPress={()=> selectDate("This Week")} style={[styles.filterDateButton, date ==="This Week" && styles.filterSelectedDateButton]}>
                    <Text style={styles.filterDateText}>This Week</Text>
                </Pressable>
            </View>
            <FlatList
                data={filteredGames}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.gameCard}>
                        <Image source={{ uri: item.img }} style={styles.gameImage}
                            onLoadEnd={()=> setIsLoading(false)}/>
                        <Link
                            href={{
                            pathname: "/(tabs)/search/[id]",
                            params: { id: item.id },
                            }}
                            asChild
                        >
                        <Pressable>
                            <View style = {styles.gameInfoRow}>
                                <Text style={styles.gameHost}>{item.organizer.name} I</Text>
                                <Text style={[styles.gameLevel]}>{item.level_required.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.gameTitle}>{item.title}</Text>
                            <View style={styles.gameDetailsRow}>
                                <View style ={styles.gameInfoRow}>
                                    <Ionicons name="calendar-outline" size ={14} color ="gray"/>
                                    <Text style={styles.gameInfo}>{formatGameDate(item.date)}</Text>
                                </View>
                                <View style ={styles.gameInfoRow}>
                                    <Ionicons name="location" size ={14} color ="gray"/>
                                    <Text style={styles.gameInfo}>{item.location}</Text>
                                </View>
                            </View>
                            <View style={styles.gameDetailsRow}>
                                <View style ={styles.gameInfoRow}>
                                    <Ionicons name="time" size ={14} color ="gray"/>
                                    <Text style={styles.gameInfo}>{`${formatTime(item.start_time)}-${formatTime(item.end_time)}`}</Text>
                                </View>
                                <View style ={styles.gameInfoRow}>
                                    <Ionicons name="person" size ={14} color ="gray"/>
                                    <Text style={styles.gameInfo}>{`${item.reserved_spots}/${item.total_spots}`}</Text>
                                </View>
                            </View>
                        </Pressable>
                        </Link>
                    </View>
                )}
                onRefresh ={loadGames}
                refreshing ={isLoading}
            />
                <Modal
                    visible = {isPanelOpen}
                    transparent
                    animationType ="none"
                    onRequestClose = {() => setIsPanelOpen(false)}>
                        <View style = {{flex:1}}>
                            <Pressable style={styles.filterBackdrop} onPress={() => setIsPanelOpen(false)}/>
                            <View style={styles.filterPanel}>
                            <Text style ={{paddingTop: 70, paddingHorizontal: 10, fontSize: 15, fontWeight: "600", paddingBottom:20}}>
                                Filters</Text>
                                <Text> City</Text>
                                <View style = {styles.filterPanelTabs}>
                                    {cities.map(item=> (
                                        <Pressable key={item} onPress={() => selectCity(item)}>
                                        <Text> {item} </Text>
                                        </Pressable>
                                    ))}
                                </View>
                                <Text> Skill Level </Text>
                                <View style = {styles.filterPanelTabs}>
                                    {skillLevels.map(item=> (
                                        <Pressable key={item} onPress={() => selectLevel(item)}>
                                        <Text> {item} </Text>
                                        </Pressable>
                                    ))}
                                </View>
                                <Text> Gender </Text>
                                <View style = {styles.filterPanelTabs}>
                                    {gender.map(item=> (
                                        <Pressable key={item} onPress={() => selectGender(item)}>
                                        <Text> {item} </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        </View>
                </Modal>
        </View>
    );
    }

export const styles = StyleSheet.create({
    layout: {
        flex: 1,
        paddingTop: 70,
        paddingHorizontal: 20,
        backgroundColor: "whitesmoke",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
        color: "#253341",
    },
    searchBarCard:{
        flexDirection: "row",
        alignItems:"center",
        justifyContent:'space-between',
        marginBottom:16,
        height: 40,
        borderColor: "#D81159",
        borderRadius: 25,
        borderWidth: 1,
        paddingHorizontal: 30,
    },
    searchBarText: {
        paddingHorizontal:2,
        fontSize:13,
        fontWeight:"300",
        color:"black"
    },
    filterDatesRow:{
        flexDirection:'row',
        justifyContent: 'space-between',
        paddingHorizontal:10,
        marginRight:10,
        marginBottom:8
    },
    filterDateButton:{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
    },
    filterSelectedDateButton:{
        backgroundColor: "#f7b5cb",
        shadowColor: "#D81159"

    },
    filterDateText:{
        fontSize: 13,
        fontWeight: "400",
        paddingHorizontal: 4,
        color: "#27253F",
    },
    filterButton:{
        padding: 8
    },
    filterBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    filterPanel: {
        position: "absolute",    //placed on top of the normal layout
        right: 0,
        top: 0,
        bottom: 0,
        width: "60%",
        backgroundColor: "white",
        padding: 20,
    },
    filterPanelTabs:{
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 12,
        paddingBottom:15
    },
    filterPanelDropdown:{
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 12
    },
    gameImage: {
        width: '100%',
        height: 80,
        marginBottom:6
    },
    gameHost: {
        fontSize: 12,
        fontWeight: "400",
        paddingHorizontal: 1,
        paddingTop:6,
        marginBottom: 8,
        color: "#27253F",
    },
    gameLevel: {
        fontSize: 11,
        fontWeight: "500",
        paddingHorizontal: 2,
        paddingTop:6,
        marginBottom: 8,
        color: "#D81159",
    },
    gameTitle: {
        fontSize: 13.5,
        fontWeight: "500",
        paddingHorizontal: 15,
        paddingTop:0,
        marginBottom: 10,
        color: "black",
    },
    gameInfoRow: {
        flexDirection:'row',
        paddingHorizontal: 15,
        alignItems:'center'
    },
    gameDetailsRow:{
        flexDirection:'row',
        paddingHorizontal: 2,
        justifyContent:'space-between',
        marginBottom:4
    },
    gameInfo: {
        fontSize: 11,
        fontWeight: "300",
        paddingHorizontal: 6,
        color: "dimgray",
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
    }
});