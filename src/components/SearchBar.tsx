'use client';

import { useState } from 'react';
import { SearchFilters, defaultFilters } from '@/types/search';
import { getQuickDateRange } from '@/lib/search';
import { getEmotionLabel } from '@/lib/emotion-analysis';
import { EmotionType } from '@/types/diary';

interface SearchBarProps {
    onFiltersChange: (filters: SearchFilters) => void;
    totalEntries: number;
    filteredEntries: number;
}

export default function SearchBar({ onFiltersChange, totalEntries, filteredEntries }: SearchBarProps) {
    const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFiltersChange(updatedFilters);
    };

    const handleQuickDateRange = (range: 'today' | 'week' | 'month' | 'year') => {
        const { from, to } = getQuickDateRange(range);
        handleFilterChange({ dateFrom: from, dateTo: to });
    };

    const handleReset = () => {
        setFilters(defaultFilters);
        onFiltersChange(defaultFilters);
    };

    const emotions: (EmotionType | 'all')[] = [
        'all', 'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'trust', 'anticipation'
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
            {/* 基本検索 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="キーワードを入力..."
                        value={filters.keyword}
                        onChange={(e) => handleFilterChange({ keyword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <select
                    value={filters.emotion}
                    onChange={(e) => handleFilterChange({ emotion: e.target.value as EmotionType | 'all' })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    {emotions.map(emotion => (
                        <option key={emotion} value={emotion}>
                            {emotion === 'all' ? 'すべての感情' : getEmotionLabel(emotion)}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    {showAdvanced ? '詳細を隠す' : '詳細検索'}
                </button>
            </div>

            {/* 詳細検索 */}
            {showAdvanced && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">開始日</label>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">終了日</label>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">並び順</label>
                            <div className="flex gap-2">
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange({ sortBy: e.target.value as 'date' | 'emotion' | 'title' })}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="date">日付</option>
                                    <option value="title">タイトル</option>
                                    <option value="emotion">感情</option>
                                </select>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="desc">降順</option>
                                    <option value="asc">昇順</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* クイック日付選択 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">クイック選択</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleQuickDateRange('today')}
                                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                今日
                            </button>
                            <button
                                onClick={() => handleQuickDateRange('week')}
                                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                過去1週間
                            </button>
                            <button
                                onClick={() => handleQuickDateRange('month')}
                                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                過去1か月
                            </button>
                            <button
                                onClick={() => handleQuickDateRange('year')}
                                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                過去1年
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        フィルターをリセット
                    </button>
                </div>
            )}

            {/* 検索結果の表示 */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {totalEntries}件中 <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredEntries}件</span> を表示
                </p>
            </div>
        </div>
    );
}
