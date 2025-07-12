import { EmotionType } from '@/types/diary';

export interface SearchFilters {
    keyword: string;
    emotion: EmotionType | 'all';
    dateFrom: string;
    dateTo: string;
    sortBy: 'date' | 'emotion' | 'title';
    sortOrder: 'asc' | 'desc';
}

export const defaultFilters: SearchFilters = {
    keyword: '',
    emotion: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc'
};
