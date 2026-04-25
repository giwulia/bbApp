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
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Octicons, Ionicons } from '@expo/vector-icons'
import { useRouter, Link, useLocalSearchParams} from "expo-router";

export default function reviewGame() {

    type Params = {
        sessionName: string
        level: string
        price: string
        gender: string
        description: string
        image: string
        date: string
        time: string
        location: string
        categories: string
    }

    const params = useLocalSearchParams<Params>()

    const details = {
        sessionName: params.sessionName,
        level: params.level,
        price: Number(params.price),
        gender: params.gender,
        description: params.description,
    }

    const detailsLabels = {
        sessionName: "NAME",
        level: "LEVEL",
        price: "PRICE (£)",
        gender: "GENDER",
        description: "DESCRIPTION"
    }

    const timeLocation = {
        date: params.date ? new Date(params.date) : null,
        time: params.time ? new Date(params.time) : null,
        location: params.location
    }

    const timeLocationLabels = {
        date: "DATE",
        time: "TIME",
        location: "LOCATION"
    }

    const categories = params.categories ? JSON.parse(params.categories) :[]

    return (
        <View style={[{backgroundColor:'white'},{ flex: 1 }]}>
            <Image source={{uri: params.image}} style = {styles.coverPhotoLayout}/>
            <View style={styles.layout}>
                <Pressable style={{marginVertical:20}}>
                    <Text style={styles.backButton}>BACK</Text>
                </Pressable>
                <View style={styles.box}>
                    <Text style={styles.title}>Details</Text>
                        {Object.entries(details).map(([key, value]) => (
                            <View key={key} style={styles.infoRow}>
                                <View style={styles.leftSide}>
                                    <Text style={styles.text}>{detailsLabels[key]?? key}</Text>
                                </View>
                                <View style={styles.rightSide}>
                                    <Text style={[styles.text, {color:'black'}]}>{String(value)}</Text>
                                </View>
                            </View>
                        ))}
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Date & Location</Text>
                        {Object.entries(timeLocation).map(([key, value]) => (
                            <View key={key} style={styles.infoRow}>
                                <View style={styles.leftSide}>
                                    <Text style={styles.text}>{timeLocationLabels[key]?? key}</Text>
                                </View>
                                <View style={styles.rightSide}>
                                    <Text style={[styles.text, {color:'black'}]}>{value instanceof Date
                                    ? value.toLocaleDateString()
                                    : value ?? "-"}</Text>
                                </View>
                            </View>
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
        fontSize:16,
        fontWeight:'500',
        marginBottom:15
    },
    infoRow:{
        flexDirection:'row'
    },
    text:{
        fontSize:13,
        fontWeight:'400',
        color:'gray',
        marginBottom:8
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
        fontWeight:'500',
        fontSize:14
    }
})