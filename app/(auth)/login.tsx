import { useState } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    async function handleLogin() {
        if (!username.trim() || !password) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await login(username.trim(), password);
        } catch (e: any) {
            setError(e.message ?? 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.inner}
            >
                <View style={styles.logoSection}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>bb</Text>
                    </View>
                </View>

                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>

                <Text style={styles.label}>USERNAME</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Your username"
                    placeholderTextColor="silver"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.passwordRow}>
                    <TextInput
                        style={[styles.input, styles.passwordInput]}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Your password"
                        placeholderTextColor="silver"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        textContentType="oneTimeCode"
                    />
                    <Pressable style={styles.eyeButton} onPress={() => setShowPassword(v => !v)}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
                    </Pressable>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="white" />
                        : <Text style={styles.buttonText}>Log In</Text>
                    }
                </Pressable>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Pressable onPress={() => router.push('/(auth)/signup')}>
                        <Text style={styles.footerLink}>Sign up</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    inner: { flex: 1, paddingHorizontal: 24 },
    logoSection: { alignItems: 'center', marginTop: 48, marginBottom: 36 },
    logoBox: {
        width: 68, height: 68, borderRadius: 18,
        backgroundColor: '#D81159', justifyContent: 'center', alignItems: 'center',
    },
    logoText: { fontSize: 28, fontWeight: '800', color: 'white', letterSpacing: 1 },
    title: { fontSize: 26, fontWeight: '700', color: '#27253F', marginBottom: 8 },
    subtitle: { fontSize: 15, color: 'gray', marginBottom: 32 },
    label: {
        fontSize: 12, fontWeight: '600', color: '#27253F',
        textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 20,
    },
    input: {
        height: 48, borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 10, paddingHorizontal: 14, fontSize: 15, color: '#27253F',
    },
    passwordRow: { position: 'relative' },
    passwordInput: { paddingRight: 46 },
    eyeButton: { position: 'absolute', right: 14, top: 14 },
    errorText: { color: '#D81159', fontSize: 13, marginTop: 12 },
    button: {
        height: 50, backgroundColor: '#D81159', borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginTop: 28,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
    footer: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', marginTop: 32,
    },
    footerText: { fontSize: 14, color: 'gray' },
    footerLink: { fontSize: 14, color: '#D81159', fontWeight: '600' },
});
