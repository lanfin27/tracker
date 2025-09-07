/**
 * 플랫폼별 팔로워 가치 환산 계수 (2025년 기준)
 * 출처: Oberlo, Socialinsider, 업계 벤치마크
 */

// Engagement Rate (팔로워 대비 상호작용률)
export const PLATFORM_ENGAGEMENT_RATES = {
  youtube: {
    small: 0.019,    // 1.9% (소형 채널)
    medium: 0.0347,  // 3.47% (중대형 채널)
    average: 0.027   // 2.7% (평균)
  },
  tiktok: {
    average: 0.025   // 2.5% (전체 평균)
  },
  instagram: {
    average: 0.005   // 0.5% (전체 평균)
  }
};

// 수익화 단가 (USD/1000 views)
export const PLATFORM_RPM = {
  youtube: {
    min: 5,      // $5
    max: 15,     // $15
    average: 10  // $10
  },
  tiktok: {
    min: 0.4,    // $0.40
    max: 1.0,    // $1.00
    average: 0.7 // $0.70
  },
  instagram: {
    // 인스타는 브랜드 협찬 기준 (팔로워당 가치)
    sponsorValuePerFollower: 0.01 // $0.01/follower
  }
};

// 플랫폼 간 팔로워 가치 환산 계수
export const FOLLOWER_CONVERSION_RATES = {
  // YouTube 구독자 1명 대비 다른 플랫폼 팔로워 가치
  youtubeToTiktok: {
    engagementBased: 1.08,   // ER 기준: 2.7% / 2.5%
    revenueBased: 14.3,      // RPM 기준: $10 / $0.7
    combined: 1.5            // 가중평균 (ER 30% + Revenue 70%)
  },
  youtubeToInstagram: {
    engagementBased: 5.4,    // ER 기준: 2.7% / 0.5%
    revenueBased: 10.0,      // 스폰서 가치 기준
    combined: 6.0            // 가중평균
  }
};

// 카테고리별 보정 계수
export const CATEGORY_ADJUSTMENTS: Record<string, Record<string, number>> = {
  youtube: {
    '금융/경제': 1.2,      // 금융은 RPM이 높음
    '교육/강의': 1.15,     // 교육도 높은 편
    '게임': 0.9,           // 게임은 낮은 편
    '키즈': 0.8,           // 키즈는 광고 제한
    '일상/브이로그': 1.0,  // 기준
    '엔터테인먼트': 1.0,
    '뷰티/패션': 1.1,      // 뷰티는 스폰서 많음
    '요리/먹방': 1.05,
    '테크/IT': 1.1,
    '기타': 1.0
  },
  tiktok: {
    '엔터테인먼트': 1.1,
    '댄스/음악': 1.0,
    '코미디': 1.05,
    '교육': 1.2,
    '일상': 1.1,
    '뷰티': 1.15,
    '요리': 1.05,
    '펫': 0.9,
    '게임': 1.0,
    '기타': 1.0
  },
  instagram: {
    '라이프스타일': 1.2,
    '뷰티': 1.3,          // 인스타 뷰티는 가치 높음
    '패션': 1.25,
    '음식': 1.1,
    '피트니스': 1.15,
    '여행': 1.1,
    '사진': 0.95,
    '예술': 0.95,
    '펫': 1.0,
    '기타': 1.0
  }
};

// 플랫폼별 조정된 구독자당 가치 계산
export function getAdjustedFollowerValue(
  platform: string,
  category: string,
  baseValue: number
): number {
  let adjustedValue = baseValue;
  
  // 플랫폼별 환산 적용
  if (platform === 'tiktok') {
    // TikTok 팔로워는 YouTube 구독자보다 가치가 낮음
    adjustedValue = baseValue / FOLLOWER_CONVERSION_RATES.youtubeToTiktok.combined;
  } else if (platform === 'instagram') {
    // Instagram 팔로워는 YouTube 구독자보다 훨씬 가치가 낮음
    adjustedValue = baseValue / FOLLOWER_CONVERSION_RATES.youtubeToInstagram.combined;
  }
  
  // 카테고리별 보정 적용
  const categoryAdjustment = CATEGORY_ADJUSTMENTS[platform]?.[category] || 1.0;
  adjustedValue = adjustedValue * categoryAdjustment;
  
  return Math.round(adjustedValue);
}

// 구독자 수 기반 채널 규모 판단
export function getChannelSize(subscribers: number): 'small' | 'medium' | 'large' {
  if (subscribers < 10000) return 'small';
  if (subscribers < 100000) return 'medium';
  return 'large';
}

// 플랫폼별 최적 ER 선택
export function getPlatformER(platform: string, subscribers: number): number {
  if (platform === 'youtube') {
    const size = getChannelSize(subscribers);
    if (size === 'small') return PLATFORM_ENGAGEMENT_RATES.youtube.small;
    if (size === 'large') return PLATFORM_ENGAGEMENT_RATES.youtube.medium;
    return PLATFORM_ENGAGEMENT_RATES.youtube.average;
  }
  
  return PLATFORM_ENGAGEMENT_RATES[platform as keyof typeof PLATFORM_ENGAGEMENT_RATES]?.average || 0.01;
}