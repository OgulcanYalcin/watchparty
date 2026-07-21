import { useTheme } from "../store/ThemeContext";

export function ThemeToggleButton(){
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="fixed bottom-4 left-4 z-50 w-10 h-10 rounded-full bg-surface/80 border border-purple/30 flex items-center justify-center text-xl hover:border-purple transition">
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    )
}