import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { changePassword } from "@/src/api/client";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PasswordField({ label, value, onChangeText, placeholder }: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder?: string;
}) {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.inputRow}>
                <TextInput
                    key={String(visible)}
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder ?? ''}
                    placeholderTextColor="silver"
                    secureTextEntry={!visible}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Pressable style={styles.eyeButton} onPress={() => setVisible(v => !v)}>
                    <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color="gray" />
                </Pressable>
            </View>
        </>
    );
}

export default function PasswordSecurity() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [saving, setSaving] = useState(false);
    const passwordsMatch = newPassword === confirmPassword;
    const canSave = currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch;

    async function handleSave() {
        if (!canSave || saving) return;
        setSaving(true);
        try {
            await changePassword(currentPassword, newPassword);
            router.back();
        } finally {
            setSaving(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#27253F" />
                </Pressable>
                <Text style={styles.headerTitle}>Password & Security</Text>
                <Pressable onPress={handleSave} disabled={!canSave || saving}>
                    <Text style={[styles.saveButton, (!canSave || saving) && styles.saveButtonDisabled]}>
                        {saving ? 'Saving...' : 'Save'}
                    </Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <PasswordField
                    label="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                />
                <PasswordField
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="At least 8 characters"
                />
                <PasswordField
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat new password"
                />
                {confirmPassword.length > 0 && !passwordsMatch && (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                <View style={styles.divider} />

                <Text style={styles.fieldLabel}>Permanent Changes</Text>
                <Pressable style={styles.dangerRow}>
                    <Ionicons name="log-out-outline" size={18} color="#D81159" />
                    <Text style={styles.dangerText}>Sign out of all devices</Text>
                </Pressable>
                <View style={styles.rowDivider} />
                <Pressable style={styles.dangerRow}>
                    <Ionicons name="trash-outline" size={18} color="#D81159" />
                    <Text style={styles.dangerText}>Delete Account</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#27253F',
    },
    saveButton: {
        fontSize: 15,
        fontWeight: '600',
        color: '#D81159',
    },
    saveButtonDisabled: {
        color: 'silver',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#27253F',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 10,
        marginTop: 24,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#27253F',
    },
    eyeButton: {
        padding: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#D81159',
        marginTop: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginTop: 36,
    },
    rowDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    dangerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
    },
    dangerText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#D81159',
    },
});
