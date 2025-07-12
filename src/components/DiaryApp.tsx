'use client';

import { useState, useEffect } from 'react';
import { DiaryEntry } from '@/types/diary';
import { saveDiaryEntries, loadDiaryEntries } from '@/lib/localStorage';
import DiaryForm from './DiaryForm';
import DiaryCard from './DiaryCard';
import DiaryDetail from './DiaryDetail';

export default function DiaryApp() {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // コンポーネントマウント時にデータを読み込み
    useEffect(() => {
        const savedEntries = loadDiaryEntries();
        setEntries(savedEntries);
        setIsLoading(false);
    }, []);

    // entriesが変更されるたびにlocalStorageに保存
    useEffect(() => {
        if (!isLoading) {
            saveDiaryEntries(entries);
        }
    }, [entries, isLoading]);

    const handleSaveEntry = (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newEntry: DiaryEntry = {
            ...entryData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setEntries(prev => [newEntry, ...prev]);
        setShowForm(false);
    };

    const handleDeleteEntry = (id: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
        setSelectedEntry(null);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">日記を読み込み中...</span>
                </div>
            </div>
        );
    }

    if (selectedEntry) {
        return (
            <DiaryDetail
                entry={selectedEntry}
                onBack={() => setSelectedEntry(null)}
                onDelete={() => handleDeleteEntry(selectedEntry.id)}
            />
        );
    }

    if (showForm) {
        return (
            <DiaryForm
                onSave={handleSaveEntry}
                onCancel={() => setShowForm(false)}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">感情日記</h1>
                    <p className="text-gray-600 mt-2">
                        今日の気持ちを記録して、感情の変化を見つめましょう
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    新しい日記を書く
                </button>
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">
                        まだ日記がありません
                    </h2>
                    <p className="text-gray-500 mb-6">
                        最初の日記を書いて、感情分析を体験してみましょう
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        日記を書き始める
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {entries.map((entry) => (
                        <DiaryCard
                            key={entry.id}
                            entry={entry}
                            onClick={() => setSelectedEntry(entry)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
