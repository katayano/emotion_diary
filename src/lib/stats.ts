import { DiaryEntry } from '@/types/diary';

export interface EmotionStats {
    emotionFrequency: Record<string, number>;
    averageIntensity: Record<string, number>;
    totalEntries: number;
    timeRangeData: {
        date: string;
        emotions: Record<string, number>;
        intensity: number;
    }[];
    weeklyPattern: Record<string, Record<string, number>>;
    monthlyTrend: {
        month: string;
        emotions: Record<string, number>;
        averageIntensity: number;
    }[];
}

export function calculateEmotionStats(entries: DiaryEntry[], days: number = 30): EmotionStats {
    if (entries.length === 0) {
        return {
            emotionFrequency: {},
            averageIntensity: {},
            totalEntries: 0,
            timeRangeData: [],
            weeklyPattern: {},
            monthlyTrend: []
        };
    }

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        const isInRange = entryDate >= startDate && entryDate <= now;
        return isInRange;
    });

    // 感情の頻度を計算
    const emotionFrequency: Record<string, number> = {};
    const emotionIntensitySum: Record<string, number> = {};
    const emotionCount: Record<string, number> = {};

    filteredEntries.forEach(entry => {
        const primary = entry.emotions.primary;
        const secondary = entry.emotions.secondary;

        emotionFrequency[primary] = (emotionFrequency[primary] || 0) + 1;
        emotionIntensitySum[primary] = (emotionIntensitySum[primary] || 0) + entry.emotions.intensity;
        emotionCount[primary] = (emotionCount[primary] || 0) + 1;

        if (secondary) {
            emotionFrequency[secondary] = (emotionFrequency[secondary] || 0) + 0.5;
            emotionIntensitySum[secondary] = (emotionIntensitySum[secondary] || 0) + entry.emotions.intensity * 0.5;
            emotionCount[secondary] = (emotionCount[secondary] || 0) + 0.5;
        }
    });

    // 平均強度を計算
    const averageIntensity: Record<string, number> = {};
    Object.keys(emotionIntensitySum).forEach(emotion => {
        averageIntensity[emotion] = emotionIntensitySum[emotion] / emotionCount[emotion];
    });

    // 時系列データを作成
    const timeRangeData = createTimeRangeData(filteredEntries, days);

    // 週間パターンを計算
    const weeklyPattern = calculateWeeklyPattern(filteredEntries);

    // 月間トレンドを計算
    const monthlyTrend = calculateMonthlyTrend(entries);

    return {
        emotionFrequency,
        averageIntensity,
        totalEntries: filteredEntries.length,
        timeRangeData,
        weeklyPattern,
        monthlyTrend
    };
}

function createTimeRangeData(entries: DiaryEntry[], days: number) {
    const now = new Date();
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateString = date.toISOString().split('T')[0];

        const dayEntries = entries.filter(entry =>
            entry.date.toISOString().split('T')[0] === dateString
        );

        const emotions: Record<string, number> = {};
        let totalIntensity = 0;

        dayEntries.forEach(entry => {
            const primary = entry.emotions.primary;
            emotions[primary] = (emotions[primary] || 0) + 1;
            totalIntensity += entry.emotions.intensity;

            if (entry.emotions.secondary) {
                emotions[entry.emotions.secondary] = (emotions[entry.emotions.secondary] || 0) + 0.5;
            }
        });

        data.push({
            date: dateString,
            emotions,
            intensity: dayEntries.length > 0 ? totalIntensity / dayEntries.length : 0
        });
    }

    return data;
}

function calculateWeeklyPattern(entries: DiaryEntry[]) {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const pattern: Record<string, Record<string, number>> = {};

    weekdays.forEach(day => {
        pattern[day] = {};
    });

    entries.forEach(entry => {
        const dayOfWeek = weekdays[entry.date.getDay()];
        const primary = entry.emotions.primary;
        const secondary = entry.emotions.secondary;

        // プライマリ感情をカウント
        pattern[dayOfWeek][primary] = (pattern[dayOfWeek][primary] || 0) + 1;

        // セカンダリ感情もカウント（重み付きではなく、単純に0.5として）
        if (secondary) {
            pattern[dayOfWeek][secondary] = (pattern[dayOfWeek][secondary] || 0) + 0.5;
        }
    });

    return pattern;
}

function calculateMonthlyTrend(entries: DiaryEntry[]) {
    const monthlyData: Record<string, { emotions: Record<string, number>, intensitySum: number, count: number }> = {};

    entries.forEach(entry => {
        const monthKey = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { emotions: {}, intensitySum: 0, count: 0 };
        }

        const primary = entry.emotions.primary;
        const secondary = entry.emotions.secondary;

        // プライマリ感情をカウント
        monthlyData[monthKey].emotions[primary] = (monthlyData[monthKey].emotions[primary] || 0) + 1;

        // セカンダリ感情もカウント
        if (secondary) {
            monthlyData[monthKey].emotions[secondary] = (monthlyData[monthKey].emotions[secondary] || 0) + 0.5;
        }

        monthlyData[monthKey].intensitySum += entry.emotions.intensity;
        monthlyData[monthKey].count += 1;
    });

    return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6) // 直近6ヶ月
        .map(([month, data]) => ({
            month,
            emotions: data.emotions,
            averageIntensity: data.intensitySum / data.count
        }));
}
