import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../../../services/api';

interface User {
    id: string;
    email: string;
    name: string | null;
}

interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            try {
                const storagedUser = await SecureStore.getItemAsync('@ConstruApp:user');

                if (storagedUser) {
                    setUser(JSON.parse(storagedUser));
                }
            } catch (error) {
                console.error('Erro ao carregar dados do storage:', error);
            } finally {
                setLoading(false);
            }
        }

        loadStorageData();
    }, []);

    async function signIn(email: string, password: string) {
        try {
            const response = await api.post('/auth/login', { email, password });
            const userData = response.data;

            setUser(userData);
            await SecureStore.setItemAsync('@ConstruApp:user', JSON.stringify(userData));
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao entrar. Verifique suas credenciais.';
            throw new Error(message);
        }
    }

    async function signUp(email: string, password: string, name: string) {
        try {
            const response = await api.post('/auth/register', { email, password, name });
            const userData = response.data;

            setUser(userData);
            await SecureStore.setItemAsync('@ConstruApp:user', JSON.stringify(userData));
        } catch (error: any) {
            const message = error.response?.data?.error || 'Erro ao cadastrar. Tente novamente.';
            throw new Error(message);
        }
    }

    async function signOut() {
        await SecureStore.deleteItemAsync('@ConstruApp:user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
