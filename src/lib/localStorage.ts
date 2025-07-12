import { DiaryEntry } from '@/types/diary';

const STORAGE_KEY = 'emotion_diary_entries';

export function saveDiaryEntries(entries: DiaryEntry[]): void {
    try {
        const serializedEntries = JSON.stringify(entries, (key, value) => {
            // Date オブジェクトを ISO 文字列に変換
            if (key === 'date' || key === 'createdAt' || key === 'updatedAt') {
                return value instanceof Date ? value.toISOString() : value;
            }
            return value;
        });
        localStorage.setItem(STORAGE_KEY, serializedEntries);
    } catch (error) {
        console.error('日記データの保存に失敗しました:', error);
    }
}

export function loadDiaryEntries(): DiaryEntry[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        // Date 文字列を Date オブジェクトに復元
        return parsed.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
            createdAt: new Date(entry.createdAt),
            updatedAt: new Date(entry.updatedAt)
        }));
    } catch (error) {
        console.error('日記データの読み込みに失敗しました:', error);
        return [];
    }
}

export function clearDiaryEntries(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('日記データの削除に失敗しました:', error);
    }
}

// データのエクスポート（バックアップ用）
export function exportDiaryEntries(): string {
    const entries = loadDiaryEntries();
    return JSON.stringify(entries, null, 2);
}

// データのインポート（バックアップからの復元用）
export function importDiaryEntries(jsonData: string): boolean {
    try {
        const entries = JSON.parse(jsonData);
        // 簡単な検証
        if (Array.isArray(entries)) {
            saveDiaryEntries(entries);
            return true;
        }
        return false;
    } catch (error) {
        console.error('日記データのインポートに失敗しました:', error);
        return false;
    }
}
