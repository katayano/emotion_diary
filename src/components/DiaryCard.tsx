'use client';

import { DiaryEntry } from '@/types/diary';
import { getEmotionLabel, getEmotionColor } from '@/lib/emotion-analysis';

interface DiaryCardProps {
    entry: DiaryEntry;
    onClick: () => void;
}

export default function DiaryCard({ entry, onClick }: DiaryCardProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        }).format(date);
    };

    const intensityPercentage = Math.round(entry.emotions.intensity * 100);

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {entry.title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatDate(entry.date)}
                </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                {entry.content}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <span className={`text-lg ${getEmotionColor(entry.emotions.primary)}`}>
                            {getEmotionIcon(entry.emotions.primary)}
                        </span>
                        <span className={`text-sm font-medium ${getEmotionColor(entry.emotions.primary)}`}>
                            {getEmotionLabel(entry.emotions.primary)}
                        </span>
                    </div>

                    {entry.emotions.secondary && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>+</span>
                            <span className={getEmotionColor(entry.emotions.secondary)}>
                                {getEmotionLabel(entry.emotions.secondary)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${intensityPercentage}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {intensityPercentage}%
                    </span>
                </div>
            </div>

            {entry.emotions.keywords.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-wrap gap-1">
                        {entry.emotions.keywords.slice(0, 3).map((keyword, index) => (
                            <span
                                key={index}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                            >
                                {keyword}
                            </span>
                        ))}
                        {entry.emotions.keywords.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs text-gray-400 dark:text-gray-500">
                                +{entry.emotions.keywords.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function getEmotionIcon(emotion: string): string {
    const icons: Record<string, string> = {
        joy: '😊',
        sadness: '😢',
        anger: '😠',
        fear: '😰',
        surprise: '😲',
        disgust: '😤',
        trust: '😌',
        anticipation: '🤗'
    };
    return icons[emotion] || '😐';
}