import { useState } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet,
    ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import type { PlayerGender, SkillLevel } from '@/src/api/types';
import Dropdown from '@/components/Dropdown';

const skillLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'competitive'];
const genders: PlayerGender[] = ['female', 'male'];

export default function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState<PlayerGender>('female');
    const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const router = useRouter();

    async function handleSignup() {
        if (!name.trim() || !username.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await signup({
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                password,
                gender,
                skill_level: skillLevel,
            });
        } catch (e: any) {
            setError(e.message ?? 'Sign up failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="#27253F" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Create account</Text>
                    <View style={{ width: 22 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                        style={styles.input} value={name} onChangeText={setName}
                        placeholder="Your full name" placeholderTextColor="silver"
                    />

                    <Text style={styles.label}>USERNAME</Text>
                    <TextInput
                        style={styles.input} value={username} onChangeText={setUsername}
                        placeholder="Choose a username" placeholderTextColor="silver"
                        autoCapitalize="none" autoCorrect={false}
                    />

                    <Text style={styles.label}>EMAIL</Text>
                    <TextInput
                        style={styles.input} value={email} onChangeText={setEmail}
                        placeholder="Your email address" placeholderTextColor="silver"
                        autoCapitalize="none" keyboardType="email-address" autoCorrect={false}
                    />

                    <Text style={styles.label}>PASSWORD</Text>
                    <View style={styles.passwordRow}>
                        <TextInput
                            style={[styles.input, styles.passwordInput]} value={password}
                            onChangeText={setPassword} placeholder="At least 6 characters"
                            placeholderTextColor="silver" secureTextEntry={!showPassword}
                            autoCapitalize="none" textContentType="oneTimeCode"
                        />
                        <Pressable style={styles.eyeButton} onPress={() => setShowPassword(v => !v)}>
                            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                    <TextInput
                        style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword}
                        placeholder="Repeat your password" placeholderTextColor="silver"
                        secureTextEntry={!showPassword} autoCapitalize="none" textContentType="oneTimeCode"
                    />

                    <Text style={styles.label}>GENDER</Text>
                    <Dropdown options={genders} selected={gender} onSelect={setGender} placeholder="Select gender" />

                    <Text style={styles.label}>SKILL LEVEL</Text>
                    <Dropdown options={skillLevels} selected={skillLevel} onSelect={setSkillLevel} placeholder="Select level" />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Pressable
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="white" />
                            : <Text style={styles.buttonText}>Create Account</Text>
                        }
                    </Pressable>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text style={styles.footerLink}>Log in</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: '#eee',
    },
    headerTitle: { fontSize: 16, fontWeight: '600', color: '#27253F' },
    content: { paddingHorizontal: 24, paddingBottom: 40 },
    label: {
        fontSize: 12, fontWeight: '600', color: '#27253F',
        textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 24,
    },
    input: {
        height: 48, borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 10, paddingHorizontal: 14, fontSize: 15, color: '#27253F',
    },
    passwordRow: { position: 'relative' },
    passwordInput: { paddingRight: 46 },
    eyeButton: { position: 'absolute', right: 14, top: 14 },
    errorText: { color: '#D81159', fontSize: 13, marginTop: 16 },
    button: {
        height: 50, backgroundColor: '#D81159', borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginTop: 28,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
    footer: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', marginTop: 24,
    },
    footerText: { fontSize: 14, color: 'gray' },
    footerLink: { fontSize: 14, color: '#D81159', fontWeight: '600' },
});
