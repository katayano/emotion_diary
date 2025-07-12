import { EmotionAnalysis, EmotionType } from '@/types/diary';

// シンプルな感情分析機能（実際のプロジェクトではAI APIを使用）
export function analyzeEmotion(text: string): EmotionAnalysis {
    const emotionKeywords: Record<EmotionType, string[]> = {
        joy: ['嬉しい', '楽しい', '幸せ', '喜び', '満足', '良かった', '最高', 'ハッピー'],
        sadness: ['悲しい', '辛い', '落ち込む', '憂鬱', '寂しい', '絶望', '涙'],
        anger: ['怒り', '腹立つ', 'イライラ', '許せない', 'ムカつく', '頭にくる'],
        fear: ['怖い', '不安', '心配', '恐れ', 'ドキドキ', '緊張'],
        surprise: ['驚き', 'びっくり', '驚いた', '予想外', '意外'],
        disgust: ['嫌', '気持ち悪い', '不快', '嫌悪'],
        trust: ['信頼', '安心', '頼れる', '信じる', '任せる'],
        anticipation: ['期待', '楽しみ', 'ワクワク', '待ち遠しい', '希望']
    };

    const scores: Record<EmotionType, number> = {
        joy: 0, sadness: 0, anger: 0, fear: 0,
        surprise: 0, disgust: 0, trust: 0, anticipation: 0
    };

    const foundKeywords: string[] = [];

    // キーワードマッチングによる簡易感情分析
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        keywords.forEach(keyword => {
            if (text.includes(keyword)) {
                scores[emotion as EmotionType] += 1;
                foundKeywords.push(keyword);
            }
        });
    });

    // 最も高いスコアの感情を取得
    const sortedEmotions = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .filter(([, score]) => score > 0);

    const primary = sortedEmotions[0]?.[0] as EmotionType || 'trust';
    const secondary = sortedEmotions[1]?.[0] as EmotionType;

    const maxScore = Math.max(...Object.values(scores));
    const intensity = Math.min(maxScore / 3, 1); // 最大3キーワードで強度1.0
    const confidence = maxScore > 0 ? 0.7 : 0.3; // キーワードが見つかった場合の信頼度

    return {
        primary,
        secondary,
        intensity,
        confidence,
        keywords: foundKeywords
    };
}

export function getEmotionLabel(emotion: EmotionType): string {
    const labels: Record<EmotionType, string> = {
        joy: '喜び',
        sadness: '悲しみ',
        anger: '怒り',
        fear: '恐れ',
        surprise: '驚き',
        disgust: '嫌悪',
        trust: '信頼',
        anticipation: '期待'
    };
    return labels[emotion];
}

export function getEmotionColor(emotion: EmotionType): string {
    const colors: Record<EmotionType, string> = {
        joy: 'text-yellow-500',
        sadness: 'text-blue-500',
        anger: 'text-red-500',
        fear: 'text-purple-500',
        surprise: 'text-orange-500',
        disgust: 'text-green-500',
        trust: 'text-emerald-500',
        anticipation: 'text-pink-500'
    };
    return colors[emotion];
}
