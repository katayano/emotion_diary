'use client';

import { useState } from 'react';
import { DiaryEntry } from '@/types/diary';
import { analyzeEmotion } from '@/lib/emotion-analysis';

interface DiaryFormProps {
    onSave: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

export default function DiaryForm({ onSave, onCancel }: DiaryFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('タイトルと内容を入力してください');
            return;
        }

        const emotions = analyzeEmotion(content);

        onSave({
            title: title.trim(),
            content: content.trim(),
            date: new Date(date),
            emotions
        });

        // フォームをリセット
        setTitle('');
        setContent('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">新しい日記を書く</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        日付
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        タイトル
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="今日の出来事..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        内容
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="今日はどんな一日でしたか？感じたことや考えたことを自由に書いてください..."
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        保存して感情分析
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </form>
        </div>
    );
}
