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
        sessionName: string
        level: string
        price: string
        gender: string
        description: string
        image: string
        date: string
        time: string
        endTime:string
        location: string
        categories: string,
        preset: string
    }

    const params = useLocalSearchParams<Params>()

    const details = {
        sessionName: params.sessionName,
        level: params.level,
        price: Number(params.price),
        gender: params.gender,
        description: params.description,
    }

    const timeLocation = {
        date: params.date ? new Date(params.date) : null,
        time: params.time ? new Date(params.time) : null,
        endTime:params.endTime? new Date(params.endTime): null,      
        location: params.location
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

    const timeSheet ={
        preset: params.preset,
        categories: params.categories
        ? (JSON.parse(params.categories) as Category[])
        : []
    }

    const detailsRows = [
        { 
            label: "NAME",
            value: details.sessionName 
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
            label: "PRESET",
            value: timeSheet.preset ?? "-",
        },
        {
            label: "POSITIONS",
            value: timeSheet.categories.length
            ? timeSheet.categories
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
                    <Text style={[styles.text, {color:"black"}]} numberOfLines={numberOfLines}  ellipsizeMode="tail">{value}</Text>
                </View>
            </View>
        )
    }

    const goBackEdit = (step:number) => {
        router.push({
            pathname:'/createGame',
            params:{
                ...params,
                step:String(step)
            }
        })
    }


    return (
        <View style={[{backgroundColor:'white'},{ flex: 1 }]}>
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
                                    <Feather name='edit-3' size={16} color="gray" />
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
                                    <Feather name='edit-3' size={16} color="gray" />
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
                                    <Feather name='edit-3' size={16} color="gray" />
                            </Pressable>                        
                        </View>
                    </View>
                {teamSheetRows.map((row)=> (
                    <InfoRow key={row.label} label ={row.label} value={row.value}/>
                ))}
            </View>
            </View>
        </View>
    )

}

export const styles = StyleSheet.create({
    coverPhotoLayout: {
        width: '100%',
        height: 250,
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
        borderRadius:4,
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
        flex: 2,
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
})