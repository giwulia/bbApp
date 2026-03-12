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
import { createGames } from "../../src/api/client";
import type { GameResponse, SkillLevel } from "../../src/api/types";
import { formatDateFilter, formatGameDate, formatTime } from "../../src/utils/format";
import { ScrollView } from "react-native-gesture-handler";
import {useEffect, useState} from "react"

export default function createGame() {
    const[sessionName, setSessionName] = useState("");
    const[level, setLevel] = useState<SkillLevel>();
    const[location, setLocation] = useState("")
    const[price, setPrice]= useState<number>()
    

    return (
        <ScrollView>
            <View style = {styles.inputField}>
                <Text style = {styles.inputFieldTitle}>SESSION NAME</Text>
                <View style = {styles.inputFieldBar}>
                    <TextInput 
                        style = {styles.inputFieldText}
                        onChangeText={setSessionName}
                        value={sessionName}
                        placeholder="Enter name"
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export const styles = StyleSheet.create({
    inputField:{
        alignItems:'flex-start',
        flexDirection:"column",
        marginTop:2,
        marginBottom:13
    },
    inputFieldTitle:{
        fontSize:14,
        color:'black',
        fontWeight:400
    },
    inputFieldText:{
        fontSize:14,
        color:'gray',
        fontWeight:400
    },
    inputFieldBar:{
        flexDirection: "row",
        alignItems:"center",
        justifyContent:'space-between',
        marginBottom:16,
        height: 40,
        borderColor: "dodgerblue",
        borderRadius: 25,
        borderWidth: 1,
        paddingHorizontal: 30,
    },
})
