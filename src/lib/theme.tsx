'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // ローカルストレージから保存されたテーマを読み込み
        const savedTheme = localStorage.getItem('theme') as Theme || 'system';
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        const updateTheme = () => {
            let shouldBeDark = false;

            if (theme === 'dark') {
                shouldBeDark = true;
            } else if (theme === 'light') {
                shouldBeDark = false;
            } else {
                // system の場合はOSの設定に従う
                shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            setIsDark(shouldBeDark);

            // HTMLのクラスを更新
            if (shouldBeDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        updateTheme();

        // システムテーマの変更を監視
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                updateTheme();
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
