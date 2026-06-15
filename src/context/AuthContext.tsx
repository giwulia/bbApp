import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin, signup as apiSignup, initSession, getUser } from '@/src/api/client';
import type { User, SignUpBody } from '@/src/api/types';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signup: (fields: SignUpBody) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        SecureStore.getItemAsync('auth_user')
            .then(async stored => {
                if (!stored) return;
                const u: User = JSON.parse(stored);
                // Verify the user still exists in the current mock state.
                // If not (e.g. app restarted and in-memory data reset), clear the stale session.
                const exists = await getUser(u.id);
                if (!exists) {
                    await SecureStore.deleteItemAsync('auth_user');
                    return;
                }
                initSession(u.id);
                setUser(u);
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function login(username: string, password: string) {
        const u = await apiLogin(username, password);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(u));
        setUser(u);
    }

    async function signup(fields: SignUpBody) {
        const u = await apiSignup(fields);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(u));
        setUser(u);
    }

    async function logout() {
        await SecureStore.deleteItemAsync('auth_user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
