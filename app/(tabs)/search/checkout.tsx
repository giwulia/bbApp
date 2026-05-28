import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CheckoutScreen() {
    const [promoCode, setPromoCode] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const router = useRouter();

    const { gameTitle, position, price, image } = useLocalSearchParams<{
        gameTitle: string;
        position: string;
        price: string;
        image: string;
    }>();

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#27253F" />
                </Pressable>
                <View>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <Text style={styles.headerSub}>{gameTitle} · {position}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {/* SUMMARY */}
                <Text style={styles.sectionTitle}>Summary</Text>
                <View style={styles.summaryCard}>
                    <Image source={{ uri: image }} style={styles.summaryImage} />
                    <View style={styles.summaryInfo}>
                        <Text style={styles.summaryGameTitle} numberOfLines={1}>{gameTitle}</Text>
                        <Text style={styles.summaryPosition}>{position} × 1</Text>
                    </View>
                    <Text style={styles.summaryPrice}>£{price}</Text>
                </View>

                {/* PROMO */}
                <Text style={styles.sectionTitle}>Promo Code</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.inputField}
                        onChangeText={setPromoCode}
                        value={promoCode}
                        placeholder="Enter promo code"
                        placeholderTextColor="silver"
                        autoCapitalize="characters"
                    />
                    <Pressable style={styles.applyButton}>
                        <Text style={styles.applyButtonText}>Apply</Text>
                    </Pressable>
                </View>

                {/* CARD DETAILS */}
                <Text style={styles.sectionTitle}>Card Details</Text>

                <Text style={styles.fieldLabel}>Card Number</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={setCardNumber}
                    value={cardNumber}
                    placeholder="0000 0000 0000 0000"
                    keyboardType="numeric"
                    placeholderTextColor="silver"
                    maxLength={19}
                />

                <Text style={styles.fieldLabel}>Cardholder Name</Text>
                <TextInput
                    style={styles.inputField}
                    onChangeText={setCardHolderName}
                    value={cardHolderName}
                    placeholder="Name on card"
                    placeholderTextColor="silver"
                />

                <View style={styles.dualRow}>
                    <View style={styles.dualField}>
                        <Text style={styles.fieldLabel}>Expiry</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={setExpiryDate}
                            value={expiryDate}
                            placeholder="MM/YY"
                            keyboardType="numeric"
                            placeholderTextColor="silver"
                            maxLength={5}
                        />
                    </View>
                    <View style={styles.dualField}>
                        <Text style={styles.fieldLabel}>CVV</Text>
                        <TextInput
                            style={styles.inputField}
                            onChangeText={setCvv}
                            value={cvv}
                            placeholder="•••"
                            keyboardType="numeric"
                            secureTextEntry
                            placeholderTextColor="silver"
                            maxLength={3}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* CTA */}
            <View style={styles.footer}>
                <Pressable style={styles.payButton}>
                    <Text style={styles.payButtonText}>Confirm & Pay  £{price}</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        gap: 12,
    },
    backButton: {
        marginRight: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27253F',
    },
    headerSub: {
        fontSize: 12,
        color: 'gray',
        marginTop: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 32,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#27253F',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginTop: 24,
    },
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f7f9',
        borderRadius: 12,
        padding: 12,
        gap: 12,
    },
    summaryImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: '#ddd',
    },
    summaryInfo: {
        flex: 1,
    },
    summaryGameTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#27253F',
        marginBottom: 4,
    },
    summaryPosition: {
        fontSize: 13,
        color: '#D81159',
        fontStyle: 'italic',
    },
    summaryPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: '#27253F',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#27253F',
        marginBottom: 6,
        marginTop: 14,
    },
    inputField: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#27253F',
        backgroundColor: 'white',
    },
    applyButton: {
        height: 44,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#27253F',
        justifyContent: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    dualRow: {
        flexDirection: 'row',
        gap: 12,
    },
    dualField: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    payButton: {
        backgroundColor: '#D81159',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});
