import { 
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Image
} from "react-native";
import { useState } from "react"
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";



export default function CheckoutScreen() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [cardHolderName, setCardHolderName] =useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')
    const router = useRouter();


    const { gameId, gameTitle, position, price, image } = useLocalSearchParams<{
        gameId: string;
        gameTitle: string;
        position: string;
        price: string;
        image: string;
    }>();

    const handleCheckout = async() => {
        setIsProcessing(true);
    }

    return (
        <View style = {{flex:1}}>
            <View style = {styles.orderDetailsPanel}>
                <Pressable onPress={()=> router.back()}>
                    <Ionicons name="arrow-back" size={30} color="#111827" style={{ marginTop: 60 }} />
                </Pressable>
            </View>
            <ScrollView style = {styles.scrollContent}>
                <Text style = {styles.mediumTitle}>Summary</Text>
                <View style = {styles.horizontalLine}/>
                <View style = {styles.basket}>
                    <View style = {styles.basketGamepPic}>
                        <Image source={{uri: image}} style={{width: '100%', height: '100%', borderRadius: 30}}/>
                    </View>
                    <View style = {{flexDirection:'column', justifyContent:'center'}}>
                        <Text style = {styles.basketGameTitle}>{gameTitle}</Text>
                        <Text style = {styles.basketGamePosition}>{position} x1</Text>
                    </View>
                    <Text style = {styles.basketGamePrice}>£{price}</Text>
                </View>
                <View style = {styles.horizontalLine}/>
                <Text style = {[styles.mediumTitle, { marginBottom: 22 }]}>Card Details</Text>

                {/* PROMO CODE */}
                <Text style = {styles.inputFieldTitle}>Promo Code</Text>
                <TextInput 
                    style={[styles.inputFieldBar, { flex: 1 }]}
                    onChangeText={setPromoCode}
                    value={promoCode}
                    placeholder="Enter promo code"
                    placeholderTextColor="silver"
                />

                {/* CARD NUMBER */}
                <Text style = {styles.inputFieldTitle}>Card Number</Text>
                <TextInput
                    style={[styles.inputFieldBar, { flex: 1 }]}
                    onChangeText={setCardNumber}
                    value={cardNumber}
                    placeholder="Enter card number"
                    keyboardType="numeric"
                    placeholderTextColor="silver"
                />

                {/* CARDHOLDER NAME */}
                <Text style = {styles.inputFieldTitle}>Cardholder Name</Text>
                <TextInput 
                    style={[styles.inputFieldBar, { flex: 1 }]}
                    onChangeText={setCardHolderName}
                    value={cardHolderName}
                    placeholder="Enter name"
                    placeholderTextColor="silver"
                />

                {/* EXPIRY DATE & CVV */}
                <View style = {styles.inputFieldDual}>
                    <View style = {{flex:1, marginRight:10}}>
                        <Text style = {styles.inputFieldTitle}>Expiry Date</Text>
                        <TextInput
                            style={[styles.inputFieldBar, { flex: 1 }]}
                            onChangeText={setExpiryDate}
                            value={expiryDate}
                            placeholder="MM/YY"
                            keyboardType="numeric"
                            placeholderTextColor="silver"
                        />
                    </View>
                    <View style = {{flex:1, marginLeft:10}}>
                        <Text style = {styles.inputFieldTitle}>CVV</Text>
                        <TextInput
                            style={[styles.inputFieldBar, { flex: 1 }]}
                            onChangeText={setCvv}
                            value={cvv}
                            placeholder="CVV"
                            keyboardType="numeric"
                            secureTextEntry={true}
                            placeholderTextColor="silver"
                        />
                    </View>
                </View>
            </ScrollView>

            <View style = {styles.joinGameCard}>
                <View style = {{flexDirection:'column', paddingHorizontal: 20}}>
                    <Text style={styles.priceLabel}>CHECKOUT</Text>
                    <Text style={styles.priceValue}>£{price}</Text>
                </View>
                <Pressable style={styles.joinGameButton}>
                    <Text style={styles.joinGameText}>Join Game</Text>
                </Pressable>
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    layout: {
        flex: 1,
        paddingTop: 90,
        paddingHorizontal: 30,
        backgroundColor: "whitesmoke",
    },
    mediumTitle:{
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
    },
    orderDetailsPanel: {
        position: "absolute",    //placed on top of the normal layout
        right: 0,
        top: 0,
        left: 0,
        backgroundColor: "#FFFFFF",
        padding: 20,
        height:130,
        zIndex: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    scrollContent: {
        paddingTop:160,
        paddingHorizontal: 30,
        backgroundColor: "#ecf1f5",
    },
    horizontalLine:{
        height:1,
        backgroundColor:'silver',
        marginTop:2,
        marginBottom:28,
        width:'100%'
    },
    basket:{
        flexDirection:'row',
        marginBottom:25
    },
    basketGamepPic: {
        width: 66,           // circle diameter
        height: 66,          // same as width
        borderRadius: 33,    // half of width/height
        backgroundColor: 'white',
        borderColor:'rgba(128,128,128,0.5)',
        borderWidth:1,
    },
    basketGameTitle: {
        fontSize: 15,
        fontWeight: "500",
        color: "black",
        marginLeft: 15,
        marginBottom:5
    },
    basketGamePrice: {
        fontSize: 15,
        fontWeight: "500",
        color: "black",
        marginLeft:'auto',
        marginRight: 15,
        marginTop:35
    },
    basketGamePosition:{
        fontSize: 14,
        fontWeight: "400",
        color: "#D81159",
        marginLeft: 15,
        fontStyle: "italic"
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
        height: 40,
        borderColor: "#E5E7EB",
        borderRadius: 8,
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: "#FFFFFF"
    },
    inputFieldDual: {
        flexDirection: "row",
        alignItems: 'center',
    },
    joinGameCard:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        borderRadius: 15,
        paddingVertical: 5,
        marginHorizontal:15,
        backgroundColor: "#27253F" ,
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
    joinGameButton: {
        justifyContent:'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal:15,
        backgroundColor: "#D81159",
        shadowColor: "#D81159",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        height:33
    },
    joinGameText:{
        color:"white",
        fontSize:14,
        fontWeight:"700",
        marginHorizontal:12
    },
    priceLabel: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 10,
        fontWeight: "500",
    },
    priceValue: {
        color: "white",
        fontSize: 15,
        fontWeight: "700",
        marginBottom:4
    }
})