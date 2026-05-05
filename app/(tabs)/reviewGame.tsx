import { 
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Modal,
    KeyboardAvoidingView,
    Image
} from "react-native";
import type { SkillLevel, Category } from "../../src/api/types";
import { useRef, useState } from "react"
import * as ImagePicker from 'expo-image-picker'
import { Octicons, Ionicons,Feather } from '@expo/vector-icons'
import { useRouter, Link, useLocalSearchParams} from "expo-router";

export default function reviewGame() {
    const router = useRouter()

    type Params = {
        gameTitle: string
        type: string
        level: string
        price: string
        gender: string
        description: string
        image: string
        date: string
        time: string
        endTime:string
        location: string
        locationUrl: string
        categories: string,
        totalSpots:string,
        preset: string
    }

    const params = useLocalSearchParams<Params>()

    const details = {
        gameTitle: params.gameTitle,
        type: params.type,
        level: params.level,
        price: Number(params.price),
        gender: params.gender,
        description: params.description,
    }

    const timeLocation = {
        date: params.date ? new Date(params.date) : null,
        time: params.time ? new Date(params.time) : null,
        endTime:params.endTime? new Date(params.endTime): null,      
        location: params.location,
        locationUrl: params.locationUrl,
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
        totalSpots: params.totalSpots,
        preset: params.preset,
        categories: params.categories
        ? (JSON.parse(params.categories) as Category[])
        : []
    }

    const detailsRows = [
        {
            label: "GAME TITLE",
            value: details.gameTitle
        },
        {
            label: "SESSION TYPE",
            value: details.type
        },
        {
            label: "LEVEL",
            value: details.level
        },
        { 
            label: "PRICE (£)",
            value: details.price 
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
                    <Text style={[styles.text, {color:"black", flex: 1, textAlign: 'right'}]} numberOfLines={numberOfLines} ellipsizeMode="tail">{value}</Text>
                </View>
            </View>
        )
    }

    const goBackEdit = (step: number) => {
    router.push({
        pathname: "/createGame",
        params: {
            step: String(step)
        }
    })
}


    return (
        <View style={[{backgroundColor:'white'},{ flex: 1 }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
            <Image source={{uri: params.image}} style = {styles.coverPhotoLayout}/>
            <View style={styles.layout}>
                <Pressable style={styles.buttonContent} onPress={()=> router.back()}>
                    <Ionicons name="arrow-back" size={16} color="#D81159" />
                    <Text style={styles.backButton}>BACK</Text>
                </Pressable>
                <View style={styles.box}>
                    <View style={[styles.infoRow, {marginBottom:12}]}>
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
                    <View style={[styles.infoRow, {marginBottom:12}]}>
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
                    <View style={[styles.infoRow, {marginBottom:12}]}>
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
            <Pressable style={styles.publishButton}>
                <Text style={styles.publishButtonText}>Publish Game</Text>
            </Pressable>
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
        marginBottom:15
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
        padding:12
    },
    title:{
        fontSize:15,
        fontWeight:'500',
    },
    infoRow:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:7
    },
    text:{
        fontSize:12.5,
        fontWeight:'500',
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
})