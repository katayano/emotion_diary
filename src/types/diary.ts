export interface DiaryEntry {
    id: string;
    title: string;
    content: string;
    date: Date;
    emotions: EmotionAnalysis;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmotionAnalysis {
    primary: EmotionType;
    secondary?: EmotionType;
    intensity: number; // 0-1の範囲
    confidence: number; // 0-1の範囲
    keywords: string[];
}

export type EmotionType =
    | 'joy'      // 喜び
    | 'sadness'  // 悲しみ
    | 'anger'    // 怒り
    | 'fear'     // 恐れ
    | 'surprise' // 驚き
    | 'disgust'  // 嫌悪
    | 'trust'    // 信頼
    | 'anticipation'; // 期待

export interface EmotionStats {
    date: string;
    emotions: Record<EmotionType, number>;
    averageIntensity: number;
}
