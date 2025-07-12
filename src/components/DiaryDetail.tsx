'use client';

import { DiaryEntry } from '@/types/diary';
import { getEmotionLabel, getEmotionColor } from '@/lib/emotion-analysis';

interface DiaryDetailProps {
    entry: DiaryEntry;
    onBack: () => void;
    onDelete: () => void;
}

export default function DiaryDetail({ entry, onBack, onDelete }: DiaryDetailProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        }).format(date);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const intensityPercentage = Math.round(entry.emotions.intensity * 100);
    const confidencePercentage = Math.round(entry.emotions.confidence * 100);

    const handleDelete = () => {
        if (window.confirm('この日記を削除しますか？この操作は取り消せません。')) {
            onDelete();
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    日記一覧に戻る
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {entry.title}
                        </h1>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="削除"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDate(entry.date)}</span>
                        <span>作成: {formatTime(entry.createdAt)}</span>
                        {entry.updatedAt.getTime() !== entry.createdAt.getTime() && (
                            <span>更新: {formatTime(entry.updatedAt)}</span>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">内容</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {entry.content}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">感情分析結果</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">検出された感情</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <span className={`text-2xl ${getEmotionColor(entry.emotions.primary)}`}>
                                        {getEmotionIcon(entry.emotions.primary)}
                                    </span>
                                    <div>
                                        <span className={`font-medium ${getEmotionColor(entry.emotions.primary)}`}>
                                            {getEmotionLabel(entry.emotions.primary)}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">(主要)</span>
                                    </div>
                                </div>

                                {entry.emotions.secondary && (
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-xl ${getEmotionColor(entry.emotions.secondary)}`}>
                                            {getEmotionIcon(entry.emotions.secondary)}
                                        </span>
                                        <div>
                                            <span className={`font-medium ${getEmotionColor(entry.emotions.secondary)}`}>
                                                {getEmotionLabel(entry.emotions.secondary)}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">(副次)</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">感情の強さ</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>感情の強度</span>
                                        <span>{intensityPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${intensityPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>分析の信頼度</span>
                                        <span>{confidencePercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full transition-all"
                                            style={{ width: `${confidencePercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {entry.emotions.keywords.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-medium text-gray-700 mb-3">感情を示すキーワード</h3>
                            <div className="flex flex-wrap gap-2">
                                {entry.emotions.keywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
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
