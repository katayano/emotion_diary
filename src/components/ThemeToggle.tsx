'use client';

import { useTheme } from '@/lib/theme';

export default function ThemeToggle() {
    const { theme, setTheme, isDark } = useTheme();

    const themes = [
        { value: 'light', label: 'ライト', icon: '☀️' },
        { value: 'dark', label: 'ダーク', icon: '🌙' },
        { value: 'system', label: 'システム', icon: '💻' }
    ] as const;

    return (
        <div className="relative">
            <button
                onClick={() => {
                    const currentIndex = themes.findIndex(t => t.value === theme);
                    const nextIndex = (currentIndex + 1) % themes.length;
                    setTheme(themes[nextIndex].value);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                title="テーマを変更"
            >
                <span className="text-lg">
                    {themes.find(t => t.value === theme)?.icon}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {themes.find(t => t.value === theme)?.label}
                </span>
            </button>
        </div>
    );
}
