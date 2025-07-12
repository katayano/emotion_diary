import { DiaryEntry } from '@/types/diary';
import { SearchFilters } from '@/types/search';

export function filterDiaryEntries(entries: DiaryEntry[], filters: SearchFilters): DiaryEntry[] {
    let filteredEntries = [...entries];

    // キーワード検索
    if (filters.keyword.trim()) {
        const keyword = filters.keyword.toLowerCase();
        filteredEntries = filteredEntries.filter(entry =>
            entry.title.toLowerCase().includes(keyword) ||
            entry.content.toLowerCase().includes(keyword)
        );
    }

    // 感情フィルタ
    if (filters.emotion !== 'all') {
        filteredEntries = filteredEntries.filter(entry =>
            entry.emotions.primary === filters.emotion ||
            entry.emotions.secondary === filters.emotion
        );
    }

    // 日付範囲フィルタ
    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        filteredEntries = filteredEntries.filter(entry => entry.date >= fromDate);
    }

    if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // 日付の終わりまで含める
        filteredEntries = filteredEntries.filter(entry => entry.date <= toDate);
    }

    // ソート
    filteredEntries.sort((a, b) => {
        let comparison = 0;

        switch (filters.sortBy) {
            case 'date':
                comparison = a.date.getTime() - b.date.getTime();
                break;
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'emotion':
                comparison = a.emotions.primary.localeCompare(b.emotions.primary);
                break;
        }

        return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filteredEntries;
}

export function getQuickDateRange(range: 'today' | 'week' | 'month' | 'year'): { from: string; to: string } {
    const today = new Date();
    const from = new Date();

    switch (range) {
        case 'today':
            from.setHours(0, 0, 0, 0);
            break;
        case 'week':
            from.setDate(today.getDate() - 7);
            break;
        case 'month':
            from.setMonth(today.getMonth() - 1);
            break;
        case 'year':
            from.setFullYear(today.getFullYear() - 1);
            break;
    }

    return {
        from: from.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0]
    };
}
