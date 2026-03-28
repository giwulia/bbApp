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
import { useState } from "react"


export function CheckoutScreen() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async() => {
        setIsProcessing(true);
    }

    return (
        <View style = {styles.layout}>
            <Text style = {styles.mediumTitle}>Summary</Text>
        </View>
    )
}

export const styles = StyleSheet.create({
    layout:{
        marginHorizontal:10,
        marginVertical: 20
    },
    mediumTitle:{
        fontSize: 13,
        fontWeight: "700",
        color: "#D81159"
    },
})