import { createContext, useContext } from 'react';

interface AuthContextType {
    token: string | null;
    setAuth: (token:string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth, AuthProvider içinde kullanılmalı');
    }
    return context;
}