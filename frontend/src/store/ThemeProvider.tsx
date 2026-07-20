import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";
import { getMyProfile, updateProfile } from "../services/users";
import { useAuth } from "./AuthContext";

export function ThemeProvider({ children } : { children: ReactNode}) {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const { token } = useAuth();

    useEffect(() => {
        getMyProfile().then((profile) => setTheme(profile.theme)).catch(() => {});
    }, [token]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        updateProfile({ theme: newTheme }).catch(() => {});
    };

    useEffect(() => {
        if(theme === 'light'){
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value ={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}