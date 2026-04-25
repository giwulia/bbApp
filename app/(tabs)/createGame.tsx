import { 
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Modal,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import type { SkillLevel, Category } from "../../src/api/types";
import { useRef, useState } from "react"
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Octicons, Ionicons } from '@expo/vector-icons'
import { useRouter, Link} from "expo-router";

export default function createGame() {
    const [sessionName, setSessionName] = useState("");
    const [level, setLevel] = useState<SkillLevel | null>(null);
    const [showLevelDropdown, setShowLevelDropdown]=useState(false)
    const [location, setLocation] = useState("")
    const [price, setPrice] = useState<number>()
    const [image, setImage] = useState<string | null>(null)
    const [date, setDate] = useState<Date | null>(null)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [time, setTime] = useState<Date | null>(null)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [gender, setGender] =useState<string|null>(null)
    const [showGenderDropdown, setShowGenderDropDown]=useState(false)
    const [description, setDescription]=useState("")
    const [step, setStep]=useState(1)
    const [preset, setPreset] = useState<string>('Custom')
    const [showPresetDropdown, setShowPresetDropdown]=useState(false)
    const [presetName, setPresetName]= useState("")
    const [showSavePresetModal,setShowSavePresetModal] =useState(false)
    const [categories, setCategories] =useState<Category[]>([
        {position:'', slots:0}
    ])

    const router = useRouter();

    const descriptionRef = useRef<TextInput>(null)
    const steps=["Details","Date & Location", "Team Sheet"]
    const levelOptions=['Beginner','Intermediate','Advanced','Competitive']
    const genderOptions=['Female','Male','Mixed']
    const presetOptions=["None","Custom","5:1 (18)", "5:1 (12)"]
    const [presetOptionsList, setPresetOptionsList] = useState<string[]>(presetOptions)

    const presetOptionsConfig: Record<string, Category[]>={
        "5:1 (18)": [
            {position:'Setter', slots:3},
            {position:'Outside', slots:6},
            {position:'Libero', slots:3},
            {position:'Opposite', slots:3},
            {position:'Middle', slots:3},
        ],
        "5:1 (12)":[
            {position:'Setter', slots:2},
            {position:'Outside', slots:4},
            {position:'Libero', slots:2},
            {position:'Opposite', slots:2},
            {position:'Middle', slots:2},   
        ]}

    const uploadImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    const removeSlot = (index:number) => {
        const updated =[...categories]
        updated[index] = {
            ...updated[index],
        slots: Math.max(0, updated[index].slots - 1)
        }
        setCategories(updated)
    }

    const addSlot = (index:number) => {
        const updated =[...categories]
        updated[index] = {
            ...updated[index],
            slots:updated[index].slots + 1
        }
        setCategories(updated)
    }

    const addCantegoryBox = () => {
        setCategories([...categories, {position:'',slots:0}])
    }

    const deleteCategory = (index: number) => {
        setCategories(categories.filter((_,i)=> i !== index))
    }

    const updateCategory =(index: number, field: 'position'|'slots', value:string | number) => {
        const updated =[...categories]
        updated[index] = {...updated[index], [field]:value}
        setCategories(updated)
    }
    
    const updatePresetOptions= (savedPreset:string) => {
        setPresetOptionsList([...presetOptions, savedPreset])
    }

    const saveAsPreset =()=>setShowSavePresetModal(true)

    const canProceedFromStep3 = 
        preset == 'None' ||
        (categories.length> 0 &&
        categories.every(cat => 
            cat.position.trim() !=='' &&
            cat.slots>0
        ))
    
    const canSavePreset =
        categories.length>1 &&
        categories.every(cat =>
            cat.position.trim() !== '' && cat.slots>0
        )


    return (
        <View style={[{backgroundColor:'white'},{ flex: 1 }]}>
            <KeyboardAvoidingView
            style={{flex:1}}
            behavior={Platform.OS === 'ios'? 'padding':'height'}
        >
            <Pressable style={styles.coverPhotoLayout} onPress={uploadImage}>
                <Text style={[styles.inputFieldTitle, { color: 'white' }]}>TAP TO UPLOAD COVER PHOTO</Text>
                    <View style={{ position: 'absolute', bottom: 10, left: 20 }}>
                <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>CREATE GAME</Text>
                </View>
            </Pressable>
            <View style={styles.layout}>
                    <View style={styles.stepCard}>
                        {steps.map((item,index) =>(
                        <View key={item} style={styles.stepColumn}>
                                <View style={[styles.horizontalLine, step === index + 1 && { backgroundColor: '#D81159'}]}/>
                                <Text style={[styles.stepTitle, step ==index +1 && {color:'#D81159'}]}>{item}</Text>
                        </View>
                        ))}
                    </View>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>
                <View style={styles.layout}>

                    {step === 1 && (
                        <>
                            {/* SESSION NAME */}
                            <Text style={styles.inputFieldTitle}>SESSION NAME</Text>
                            <View style={styles.inputFieldBar}>
                                <TextInput
                                    style={[styles.inputFieldText, { flex: 1 }]}
                                    onChangeText={setSessionName}
                                    value={sessionName}
                                    placeholder="Enter name"
                                    placeholderTextColor="silver"
                                />
                            </View>

                            {/* LEVEL */}
                            <Text style={styles.inputFieldTitle}>LEVEL</Text>
                            <Pressable style={styles.inputFieldBar} onPress={() => setShowLevelDropdown(!showLevelDropdown)}>
                                <Text style={[styles.inputFieldText,{ color: level ? "#27253F" : "silver" }]}>{level ?? 'Select level'}</Text>
                            </Pressable>
                            {showLevelDropdown && (
                                <View style={styles.dropdown}>
                                    {levelOptions.map(option => (
                                        <Pressable
                                            key={option}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setLevel(option as SkillLevel)
                                                setShowLevelDropdown(false)
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>
                                                {option}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}

                            {/* GENDER */}
                            <Text style={styles.inputFieldTitle}>GENDER</Text>
                            <Pressable style={styles.inputFieldBar} onPress={() => setShowGenderDropDown(!showGenderDropdown)}>
                                <Text style={[styles.inputFieldText,{ color: gender ? "#27253F" : "silver" }]}>
                                    {gender ?? 'Select Gender'}
                                </Text>
                            </Pressable>
                            {showGenderDropdown && (
                                <View style={styles.dropdown}>
                                    {genderOptions.map(option => (
                                        <Pressable
                                            key={option}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setGender(option)
                                                setShowGenderDropDown(false)
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>
                                                {option}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}

                            {/* PRICE */}
                            <Text style={styles.inputFieldTitle}>PRICE</Text>
                            <View style={styles.inputFieldBar}>
                                <TextInput
                                    style={[styles.inputFieldText, { flex: 1 }]}
                                    onChangeText={(val) => setPrice(Number(val))}
                                    value={price?.toString() ?? ""}
                                    placeholder="£00.00"
                                    keyboardType="numeric"
                                    placeholderTextColor="silver"
                                />
                            </View>

                            {/* DESCRIPTION */}
                            <Text style={styles.inputFieldTitle}>DESCRIPTION</Text>
                            <Pressable
                                style={styles.inputFieldBarLarge}
                                onPress={() => descriptionRef.current?.focus()}
                            >
                                <TextInput
                                    ref={descriptionRef}
                                    style={styles.inputFieldText}
                                    onChangeText={setDescription}
                                    value={description}
                                    placeholder="Add game description"
                                    placeholderTextColor="silver"
                                    multiline
                                    textAlignVertical="top"
                                />
                            </Pressable>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* DATE & TIME */}
                            <Text style={styles.inputFieldTitle}>DATE & TIME</Text>
                            <View style={styles.inputFieldDual}>
                                <Pressable style={[styles.inputFieldBar, { flex: 1, marginRight: 12 }]} onPress={() => setShowDatePicker(!showDatePicker)}>
                                    <Text style={[styles.inputFieldText,{color: date ? "#27253F" :"silver"}]}>
                                        {date ? date.toLocaleDateString('en-GB') : 'DD/MM/YYYY'}
                                    </Text>
                                </Pressable>
                                <Pressable style={[styles.inputFieldBar, { flex: 1 }]} onPress={() => setShowTimePicker(!showTimePicker)}>
                                    <Text style={[styles.inputFieldText,{color: time ? "#27253F" :"silver"}]}>
                                        {time ? time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'HH:MM'}
                                    </Text>
                                </Pressable>
                            </View>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date ?? new Date()}
                                    mode="date"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false)
                                        if (selectedDate) setDate(selectedDate)
                                    }}
                                />
                            )}
                            {showTimePicker && (
                                <DateTimePicker
                                    value={time ?? new Date()}
                                    mode="time"
                                    display="spinner"
                                    onChange={(event, selectedTime) => {
                                        setShowTimePicker(false)
                                        if (selectedTime) setTime(selectedTime)
                                    }}
                                />
                            )}
                            <Pressable style={styles.recurringEventButton}>
                                <Text style={[styles.inputFieldText, {color:'white'}]}>SET RECURRING EVENT</Text>
                            </Pressable>

                            {/* LOCATION */}
                            <Text style={styles.inputFieldTitle}>LOCATION</Text>
                            <View style={styles.inputFieldBar}>
                                <TextInput
                                    style={[styles.inputFieldText, { flex: 1 }]}
                                    onChangeText={setLocation}
                                    value={location}
                                    placeholder="Enter address"
                                    placeholderTextColor="silver"
                                />
                            </View>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            {/*PRESET */}
                            <Text style= {styles.inputFieldTitle}>PRESET</Text>
                            <Pressable style = {styles.inputFieldBar} onPress={()=> setShowPresetDropdown(!showPresetDropdown)}>
                                <Text style ={styles.inputFieldText}>{preset}</Text>
                            </Pressable>
                            {showPresetDropdown && (
                                <View style={styles.dropdown}>
                                    {presetOptionsList.map(option => (
                                        <Pressable
                                            key={option}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setPreset(option)
                                                setShowPresetDropdown(false)
                                                if (option == 'None'){
                                                    setCategories([])
                                                } else if (option == 'Custom') {
                                                    setCategories([{position:'', slots:0}])
                                                } else {
                                                    const presetData = presetOptionsConfig[option]
                                                    const copiedData = presetData.map(item => ({
                                                        position:item.position,
                                                        slots:item.slots
                                                    }))
                                                    setCategories(copiedData)
                                                }
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}

                            {/*CUSTOM*/}
                            {preset=='Custom' &&
                                <>
                                {categories.map((item,index) =>(
                                    <View  style = {styles.categoryCard} key={index}>
                                        <View style={styles.categoryFirstRow}>
                                            <Text style={styles.inputFieldTitle}>{`CATEGORY ${index +1}`}</Text>
                                            {categories.length >1 && (
                                                <Pressable onPress={()=> deleteCategory(index)}>
                                                    <Octicons name="x" size={16} color="dimgray" />
                                                </Pressable>
                                            )}
                                        </View>
                                        <View style={styles.inputFieldBar}>
                                            <TextInput
                                                style={[styles.inputFieldText, { flex: 1 }]}
                                                onChangeText={(val) => updateCategory(index,'position',val)}
                                                value={item.position ?? ""}
                                                placeholder="Example: Setter/Outside/Opposite"
                                                blurOnSubmit={false}
                                                placeholderTextColor="silver"
                                            />
                                        </View>
                                        <View style={styles.inputFieldBar}>
                                            <TextInput
                                                style={[styles.inputFieldText, { flex: 1 }]}
                                                keyboardType="numeric"
                                                onChangeText={(val)=> {
                                                    const num = parseInt(val)
                                                    updateCategory(index,'slots', isNaN(num)? 0:num)}}
                                                value={item.slots > 0 ? item.slots.toString() : ""}
                                                placeholder="Number of Slots"
                                                placeholderTextColor="silver"
                                            />
                                        </View>
                                        {index === categories.length - 1 && (
                                            <>
                                                <Pressable style={styles.addCategoryButton} onPress={addCantegoryBox}>
                                                    <Text style={styles.nextStepText}>ADD CATEGORY</Text>
                                                </Pressable>
                                                {canSavePreset && (
                                                    <Pressable style={styles.savePresetButton} onPress={saveAsPreset}>
                                                        <Text style={styles.savePresetText}>Save settings as preset →</Text>
                                                    </Pressable>
                                                )}
                                            </>
                                        )}
                                    </View>
                                    ))}
                                </>
                            }

                            {/* PRESET CONFIG */}
                            {preset !== 'Custom' && preset != 'None'&& 
                            <>
                            <View style = {styles.presetConfigBox}>
                                {categories.map((item, index) => (
                                    <View key={index} style={styles.presetConfigRow}>
                                        {/* LEFT SIDE */}
                                        <View style={styles.leftSide}>
                                            <Text style={styles.presetPosition}>{item.position}</Text>
                                        </View>

                                        {/* RIGHT SIDE (icon + box grouped) */}
                                        <View style={styles.rightSide}>
                                            <Ionicons name="person" size={16} color="gray" />

                                            <View style={styles.presetNumberBox}>
                                                <Pressable
                                                    style={styles.stepButton}
                                                    onPress={() => removeSlot(index)}
                                                    disabled={item.slots === 0}
                                                >
                                                    <Text style={{ opacity: item.slots === 0 ? 0.3 : 1 }}>-</Text>
                                                </Pressable>

                                                <Text style={styles.slotText}>{item.slots}</Text>

                                                <Pressable style={styles.stepButton} onPress={() => addSlot(index)}>
                                                    <Text>+</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                ) )}
                            </View>
                            </>
                            }

                            {/*NONE*/}
                            {preset == 'None' &&
                            <>
                                <Text style={{ color: 'gray', marginTop: 10 }}>
                                    No positions defined for this game
                                </Text>
                            </>
                            }
                        </>
                    )}

                </View>
            </ScrollView>
            <Modal 
                visible={showSavePresetModal}
                transparent
                animationType="fade">
                    <View style={styles.savePresetBackdrop}>
                        <View style = {styles.savePresetModal}>
                            <Text style = {[styles.inputFieldTitle, {marginBottom:20}]}>NAME YOUR PRESET</Text>
                            <View style={styles.inputFieldBar}>
                                <TextInput
                                style={[styles.inputFieldText, {flex:1}]}
                                onChangeText={setPresetName}
                                value={presetName}
                                placeholder="Example: My 5:1 Setup"
                                placeholderTextColor="silver"
                            />
                            </View>
                            <View style={styles.savePresetModalRow}>
                                <Pressable onPress ={()=>setShowSavePresetModal(false)}>
                                    <Text>CANCEL</Text>
                                </Pressable>
                                <Pressable onPress={() => {
                                    if (presetName.trim()) {
                                        updatePresetOptions(presetName.trim())
                                        setPresetName("")
                                        setShowSavePresetModal(false)
                                    }
                                }}>
                                    <Text style={styles.savePresetModalButton}>Save</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
            </Modal>
        </KeyboardAvoidingView>
        <Pressable 
            style={[
                styles.nextStepButton,
                step === 3 && !canProceedFromStep3 && { opacity: 0.4 }
            ]} 
            onPress={() => {
            if (step == 3) {
                if (!canProceedFromStep3) return
                    router.push({
                        pathname: "/reviewGame",
                        params: {
                            sessionName,
                            level,
                            location,
                            price,
                            image,
                            gender,
                            description,
                            date: date?.toISOString(),
                            time: time?.toISOString(),
                            categories: JSON.stringify(categories)
                        }
                    })
            } else {
                setStep(step+1)
            }}}
        >
            <Text style={styles.nextStepText}>{step !== 3 ? 'Next' : 'Review Game'}</Text>
        </Pressable>
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
    createGameTitle: {
        fontSize: 28,
        fontWeight: "600",
        color: 'black',
        marginTop: 20,
        marginBottom:5
    },
    stepCard:{
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    stepColumn:
    {
        flex:1,
        flexDirection:'column',
        marginBottom:35
    },
    horizontalLine:{
        height:1,
        backgroundColor:'silver',
        marginTop:20,
        marginRight:10
    },
    stepTitle:{
        fontSize: 13,
        fontWeight: "500",
        color: 'dimgray',
        marginTop: 5, 
    },
    inputFieldDual: {
        flexDirection: "row",
        alignItems: 'center',
    },
    inputFieldTitle: {
        fontSize: 15,
        color: '#27253F',
        fontWeight: "500",
        marginBottom: 7,
    },
    inputFieldText: {
        fontSize: 14,
        color: '#27253F',
        fontWeight: "400",
    },
    inputFieldBar: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
        height: 44,
        borderColor: "silver",
        borderRadius: 8,
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: 10,
    },
    inputFieldBarLarge: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 18,
        height: 200,
        borderColor: "silver",
        borderRadius: 8,
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: 10,
        paddingTop:10
    },
    recurringEventButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#27253F",
        elevation: 2,
        height: 33,
        width: '100%',
        marginBottom: 23,
    },
    dropdown: {
        borderColor: 'silver',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownText: {
    fontSize: 14,
    color: '#27253F',
    fontWeight: "400",
    },
    nextStepButton: {
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal:15,
        backgroundColor: "#D81159",
        elevation: 3,
        height:38
    },
    nextStepText:{
        color:'white',
        fontSize:14,
        fontWeight:500
    },
    addCategoryButton:{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#27253F",
        elevation: 2,
        height: 33,
        width: '100%',
        marginBottom: 18,
    },
    categoryCard:{
        flexDirection:'column',
        marginTop:18
    },
    categoryFirstRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    savePresetButton:{
        alignSelf: 'flex-end',
        alignItems: 'center',
        marginTop:40
    },
    savePresetText:{
        color:'#27253F',
        fontSize:13,
        fontWeight:400
    },
    savePresetModalRow:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    savePresetBackdrop:{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 30
    },
    savePresetModal:{
        backgroundColor:'#ecf1f5',
        alignSelf:'center',
        paddingHorizontal:20,
        paddingVertical:20,
        borderRadius:8
    },
    savePresetModalButton:{ 
        color: '#D81159',
        fontWeight: '600' 
    },
    presetConfigBox:{
        marginTop:20,
        marginHorizontal:4
    },
    presetConfigRow:{
        flexDirection:'row',
        marginBottom:20,
        alignItems:'center'
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
    presetNumberBox:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 30,
        borderColor:'#ddd',
        width:100,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 4,
        backgroundColor: '#f7f7f7',
    },
    presetPosition:{
        fontSize:16,
        fontWeight:500,
        color:'black'
    },
    stepButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
        color: '#27253F',
    },
}
)