import { EmotionAnalysis, EmotionType } from '@/types/diary';

// 中性的な感情を推測する関数
function inferNeutralEmotion(text: string): EmotionType {
    // 文章の長さや内容から推測
    const length = text.length;

    // 疑問文が多い場合は「期待」
    if (text.includes('？') || text.includes('?') || text.includes('どう') || text.includes('なぜ')) {
        return 'anticipation';
    }

    // 過去形が多い場合は「信頼」（振り返り）
    if (text.includes('した') || text.includes('だった') || text.includes('でした')) {
        return 'trust';
    }

    // 未来形が多い場合は「期待」
    if (text.includes('する予定') || text.includes('したい') || text.includes('だろう') || text.includes('でしょう')) {
        return 'anticipation';
    }

    // 短い文章は「信頼」（日常的な記録）
    if (length < 30) {
        return 'trust';
    }

    // 長い文章は軽い「期待」（何かを期待して書いている）
    if (length > 150) {
        return 'anticipation';
    }

    // デフォルトは「信頼」（中性的）
    return 'trust';
}

// シンプルな感情分析機能（実際のプロジェクトではAI APIを使用）
export function analyzeEmotion(text: string): EmotionAnalysis {
    const emotionKeywords: Record<EmotionType, string[]> = {
        joy: ['嬉しい', '楽しい', '幸せ', '喜び', '満足', '良かった', '最高', 'ハッピー', '笑顔', '笑った', '楽しめた', '充実', '素晴らしい', '感動', '達成'],
        sadness: ['悲しい', '辛い', '落ち込む', '憂鬱', '寂しい', '絶望', '涙', '泣いた', '残念', '失望', '切ない', '沈む', '暗い'],
        anger: ['怒り', '腹立つ', 'イライラ', '許せない', 'ムカつく', '頭にくる', '腹が立つ', '怒った', '不満', '文句', 'ストレス'],
        fear: ['怖い', '不安', '心配', '恐れ', 'ドキドキ', '緊張', '震える', '怯える', '恐怖', '不安定', '動揺'],
        surprise: ['驚き', 'びっくり', '驚いた', '予想外', '意外', '驚く', '想像以上', '思わず', '突然', '急に'],
        disgust: ['嫌', '気持ち悪い', '不快', '嫌悪', '嫌だ', '苦手', '受け入れられない', '拒否', '嫌気'],
        trust: ['信頼', '安心', '頼れる', '信じる', '任せる', '安全', '落ち着く', '平和', '穏やか', '安らぎ', '普通', '日常'],
        anticipation: ['期待', '楽しみ', 'ワクワク', '待ち遠しい', '希望', '楽しみにしている', '期待している', '待っている', '将来', '未来']
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
    });    // 最も高いスコアの感情を取得
    const sortedEmotions = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .filter(([, score]) => score > 0);

    // 感情が検出されない場合の処理を改善
    let primary: EmotionType;
    let secondary: EmotionType | undefined;
    let intensity: number;
    let confidence: number;

    if (sortedEmotions.length === 0) {
        // キーワードが見つからない場合は中性的な感情を推測
        primary = inferNeutralEmotion(text);
        secondary = undefined;
        intensity = 0.1; // 非常に低い強度
        confidence = 0.2; // 低い信頼度
    } else {
        primary = sortedEmotions[0][0] as EmotionType;
        secondary = sortedEmotions[1]?.[0] as EmotionType;
        const maxScore = Math.max(...Object.values(scores));
        intensity = Math.min(maxScore / 3, 1); // 最大3キーワードで強度1.0
        confidence = maxScore > 0 ? 0.7 : 0.3; // キーワードが見つかった場合の信頼度
    }

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
