import { createContext, useContext } from "react";

interface ThemeContextType {
    theme : 'light' | 'dark';
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error('useTheme, ThemeProvider içinde kullanılmalı')
    }
    return context;
}