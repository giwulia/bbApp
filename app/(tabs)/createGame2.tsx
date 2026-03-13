import { 
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { createGames } from "../../src/api/client";
import type { SkillLevel } from "../../src/api/types";
import { useState } from "react"
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

export default function createGame() {
    const [sessionName, setSessionName] = useState("");
    const [level, setLevel] = useState<SkillLevel | null>(null);
    const [location, setLocation] = useState("")
    const [price, setPrice] = useState<number>()
    const [image, setImage] = useState<string | null>(null)
    const [dateTime, setDateTime] = useState<Date>(new Date())
    const [showPicker, setShowPicker] = useState(false)

    const uploadImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    return (
        <ScrollView>
            <Pressable style={styles.coverPhotoLayout} onPress={uploadImage}>
                <Text style={[styles.inputFieldTitle, { color: 'white' }]}>TAP TO UPLOAD COVER PHOTO</Text>
            </Pressable>
            <View style={styles.layout}>
                <Text style={styles.createGameTitle}>CREATE GAME</Text>
                <View style={styles.inputField}>
                    <Text style={styles.inputFieldTitle}>SESSION NAME</Text>
                    <View style={styles.inputFieldBar}>
                        <TextInput
                            style={[styles.inputFieldText, { flex: 1 }]}
                            onChangeText={setSessionName}
                            value={sessionName}
                            placeholder="Enter name"
                        />
                    </View>
                </View>
                <View style={styles.inputField}>
                    <Text style={styles.inputFieldTitle}>LEVEL</Text>
                    <View style={styles.inputFieldBar}>
                        <Picker
                            selectedValue={level}
                            onValueChange={value => setLevel(value)}
                            style={{ flex: 1, color: 'gray' }}
                            dropdownIconColor="dimgray"
                        >
                            <Picker.Item label="Select Level" value={null} color="gray"/>
                            <Picker.Item label="Beginner" value="beginner" color="black"/>
                            <Picker.Item label="Intermediate" value="intermediate" color="black"/>
                            <Picker.Item label="Advanced" value="advanced" color="black"/>
                            <Picker.Item label="Competitive" value="competitive" color="black"/>
                        </Picker>
                    </View>
                </View>
                <View style={styles.inputField}>
                    <Text style={styles.inputFieldTitle}>DATE & TIME</Text>
                    <Pressable style={styles.inputFieldBar} onPress={() => setShowPicker(true)}>
                        <Text style={styles.inputFieldText}>
                            {dateTime.toLocaleDateString('en-GB')} {dateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </Pressable>
                    <DateTimePickerModal
                        isVisible={showPicker}
                        mode="datetime"
                        date={dateTime}
                        onConfirm={(selectedDate) => {
                            setDateTime(selectedDate)
                            setShowPicker(false)
                        }}
                        onCancel={() => setShowPicker(false)}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export const styles = StyleSheet.create({
    coverPhotoLayout: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'dimgray'
    },
    layout: {
        marginHorizontal: 20,
    },
    createGameTitle: {
        fontSize: 28,
        fontWeight: "600",
        color: 'black',
        marginTop: 10,
        marginBottom: 30
    },
    inputField: {
        alignItems: 'flex-start',
        flexDirection: "column",
        marginTop: 2,
        marginBottom: 13
    },
    inputFieldTitle: {
        fontSize: 15,
        color: 'black',
        fontWeight: "500",
        marginBottom: 7
    },
    inputFieldText: {
        fontSize: 14,
        color: 'gray',
        fontWeight: "400"
    },
    inputFieldBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'flex-start',
        marginBottom: 16,
        height: 40,
        borderColor: "dimgray",
        borderRadius: 8,
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: 10,
    },
})