'use client';

import { DiaryEntry, EmotionType } from '@/types/diary';
import { EmotionStats, calculateEmotionStats } from '@/lib/stats';
import { getEmotionLabel, getEmotionColor } from '@/lib/emotion-analysis';
import { useState } from 'react';

interface StatsDashboardProps {
    entries: DiaryEntry[];
    onBack: () => void;
}

// 型安全なヘルパー関数
const safeGetEmotionLabel = (emotion: string): string => {
    const validEmotions: EmotionType[] = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'trust', 'anticipation'];
    if (validEmotions.includes(emotion as EmotionType)) {
        return getEmotionLabel(emotion as EmotionType);
    }
    return emotion;
};

const safeGetEmotionColor = (emotion: string): string => {
    const validEmotions: EmotionType[] = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'trust', 'anticipation'];
    if (validEmotions.includes(emotion as EmotionType)) {
        return getEmotionColor(emotion as EmotionType);
    }
    return 'bg-gray-400';
};

interface StatsDashboardProps {
    entries: DiaryEntry[];
    onBack: () => void;
}

export default function StatsDashboard({ entries, onBack }: StatsDashboardProps) {
    const [timeRange, setTimeRange] = useState<7 | 30 | 90 | 'all'>('all');
    const stats = calculateEmotionStats(entries, timeRange === 'all' ? 365 * 10 : timeRange); // 10年分で実質全期間

    const emotionEntries = Object.entries(stats.emotionFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8);

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        return `${year}年${month}月`;
    };

    const getBarWidth = (value: number, max: number) => {
        return Math.max((value / max) * 100, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto p-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onBack}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                        >
                            <span className="text-xl">←</span>
                            <span>戻る</span>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">感情統計ダッシュボード</h1>
                    </div>

                    {/* 期間選択 */}
                    <div className="flex space-x-2">
                        {(['all', 7, 30, 90] as const).map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimeRange(period)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === period
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {period === 'all' ? 'すべて' : `${period}日間`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* 感情頻度チャート */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            感情の出現頻度
                        </h2>
                        <div className="space-y-3">
                            {emotionEntries.length > 0 ? (
                                emotionEntries.map(([emotion, count]) => (
                                    <div key={emotion} className="flex items-center space-x-3">
                                        <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {safeGetEmotionLabel(emotion)}
                                        </div>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                                            <div
                                                className={`h-6 rounded-full ${safeGetEmotionColor(emotion)} bg-opacity-80`}
                                                style={{ width: `${getBarWidth(count, emotionEntries[0][1])}%` }}
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-white">
                                                {Math.round(count * 10) / 10}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    選択した期間にデータがありません
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 平均感情強度 */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            感情の平均強度
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(stats.averageIntensity)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 8)
                                .map(([emotion, intensity]) => (
                                    <div key={emotion} className="flex items-center space-x-3">
                                        <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {safeGetEmotionLabel(emotion)}
                                        </div>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                                            <div
                                                className={`h-6 rounded-full ${safeGetEmotionColor(emotion)} bg-opacity-80`}
                                                style={{ width: `${intensity * 100}%` }}
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800 dark:text-white">
                                                {Math.round(intensity * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* 時系列グラフ */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            感情強度の推移
                        </h2>
                        <div className="h-64 flex items-end space-x-1 overflow-x-auto">
                            {stats.timeRangeData.map((data, index) => (
                                <div key={data.date} className="flex-shrink-0 flex flex-col items-center">
                                    <div
                                        className="bg-blue-500 w-8 rounded-t"
                                        style={{ height: `${Math.max(data.intensity * 200, 4)}px` }}
                                        title={`${data.date}: ${Math.round(data.intensity * 100)}%`}
                                    />
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transform -rotate-45 origin-top-left">
                                        {data.date.split('-')[2]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 週間パターン */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            曜日別パターン
                        </h2>
                        <div className="grid grid-cols-7 gap-2">
                            {Object.entries(stats.weeklyPattern).map(([day, emotions]) => {
                                const totalEmotions = Object.values(emotions).reduce((sum, count) => sum + count, 0);
                                const topEmotion = Object.entries(emotions).sort(([, a], [, b]) => b - a)[0];

                                return (
                                    <div key={day} className="text-center">
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                            {day}
                                        </div>
                                        <div
                                            className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white text-xs font-bold ${topEmotion ? safeGetEmotionColor(topEmotion[0]) : 'bg-gray-300'
                                                }`}
                                        >
                                            {Math.round(totalEmotions)}
                                        </div>
                                        {topEmotion && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {safeGetEmotionLabel(topEmotion[0])}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 統計サマリー */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                            統計サマリー
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">総日記数:</span>
                                <span className="font-semibold text-gray-800 dark:text-white">
                                    {stats.totalEntries}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">記録された感情種類:</span>
                                <span className="font-semibold text-gray-800 dark:text-white">
                                    {Object.keys(stats.emotionFrequency).length}
                                </span>
                            </div>
                            {emotionEntries.length > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">最も多い感情:</span>
                                    <span className="font-semibold text-gray-800 dark:text-white">
                                        {safeGetEmotionLabel(emotionEntries[0][0])}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-300">平均記録頻度:</span>
                                <span className="font-semibold text-gray-800 dark:text-white">
                                    {timeRange === 'all'
                                        ? `${stats.totalEntries} 件`
                                        : `${timeRange > 0 ? Math.round((stats.totalEntries / timeRange) * 10) / 10 : 0} 回/日`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
