// SNS 비즈니스 전용 가치 평가 멀티플 및 로직

export interface SNSMetrics {
  businessType: 'youtube' | 'instagram' | 'tiktok';
  subscribers: number;        // 구독자/팔로워 수
  avgViews?: number;         // 평균 조회수
  avgLikes?: number;         // 평균 좋아요
  engagementRate?: number;   // 참여율
  category?: string;         // 콘텐츠 카테고리
  monthlyRevenue: number;    // 월 매출
  monthlyProfit: number;     // 월 수익
  businessAge: string;       // 운영 기간
}

export interface ValuationResult {
  financial: {
    value: number;
    display: string;
    weight: number;
  };
  audience: {
    value: number;
    display: string;
    weight: number;
  };
  growth: {
    value: number;
    display: string;
    weight: number;
  };
  final: {
    conservative: number;  // 최소값
    moderate: number;      // 가중평균
    optimistic: number;    // 최대값
  };
}

// 2024년 한국 시장 기준 실제 구독자/팔로워 멀티플
export const audienceMultiples = {
  youtube: {
    // 구독자 구간별 가치 (원)
    tiers: [
      { min: 0, max: 1000, valuePerSub: 500, label: '시작 단계' },
      { min: 1000, max: 10000, valuePerSub: 1000, label: '성장 단계' },
      { min: 10000, max: 50000, valuePerSub: 1800, label: '중소 채널' },
      { min: 50000, max: 100000, valuePerSub: 2500, label: '중견 채널' },
      { min: 100000, max: 500000, valuePerSub: 3000, label: '대형 채널' },
      { min: 500000, max: 1000000, valuePerSub: 3500, label: '메가 채널' },
      { min: 1000000, max: Infinity, valuePerSub: 4000, label: '톱 크리에이터' }
    ],
    
    // 카테고리별 프리미엄 배수
    categoryMultiplier: {
      '교육/강의': 1.5,
      '금융/경제': 1.4,
      '테크/IT': 1.3,
      '부동산': 1.4,
      '뷰티/패션': 1.2,
      '요리/먹방': 1.1,
      '엔터테인먼트': 1.0,
      '일상/브이로그': 0.9,
      '게임': 1.1,
      '키즈': 1.3,
      '기타': 1.0
    },
    
    // 참여율 기반 보너스
    engagementBonus: {
      high: 1.3,    // 조회수/구독자 > 20%
      medium: 1.0,  // 조회수/구독자 10-20%
      low: 0.7      // 조회수/구독자 < 10%
    },
    
    // 실제 거래 벤치마크
    benchmarks: [
      { subscribers: 1000, value: 1000000, desc: '1천 구독자' },
      { subscribers: 10000, value: 18000000, desc: '1만 구독자' },
      { subscribers: 50000, value: 125000000, desc: '5만 구독자' },
      { subscribers: 100000, value: 300000000, desc: '10만 구독자' },
      { subscribers: 500000, value: 1750000000, desc: '50만 구독자' },
      { subscribers: 1000000, value: 4000000000, desc: '100만 구독자' }
    ]
  },
  
  instagram: {
    tiers: [
      { min: 0, max: 1000, valuePerFollower: 300, label: '나노 인플루언서' },
      { min: 1000, max: 5000, valuePerFollower: 600, label: '마이크로 인플루언서' },
      { min: 5000, max: 10000, valuePerFollower: 1000, label: '소형 인플루언서' },
      { min: 10000, max: 50000, valuePerFollower: 1500, label: '중형 인플루언서' },
      { min: 50000, max: 100000, valuePerFollower: 2200, label: '대형 인플루언서' },
      { min: 100000, max: 500000, valuePerFollower: 2800, label: '메가 인플루언서' },
      { min: 500000, max: Infinity, valuePerFollower: 3500, label: '셀럽' }
    ],
    
    categoryMultiplier: {
      '패션': 1.4,
      '뷰티': 1.5,
      '피트니스': 1.3,
      '여행': 1.2,
      '음식': 1.1,
      '라이프스타일': 1.0,
      '사진': 1.1,
      '예술': 1.0,
      '펫': 1.2,
      '기타': 1.0
    },
    
    engagementBonus: {
      high: 1.4,    // 좋아요율 > 5%
      medium: 1.0,  // 좋아요율 2-5%
      low: 0.6      // 좋아요율 < 2%
    },
    
    benchmarks: [
      { followers: 1000, value: 600000, desc: '1천 팔로워' },
      { followers: 10000, value: 15000000, desc: '1만 팔로워' },
      { followers: 50000, value: 110000000, desc: '5만 팔로워' },
      { followers: 100000, value: 280000000, desc: '10만 팔로워' },
      { followers: 500000, value: 1400000000, desc: '50만 팔로워' }
    ]
  },
  
  tiktok: {
    tiers: [
      { min: 0, max: 1000, valuePerFollower: 100, label: '시작 단계' },
      { min: 1000, max: 10000, valuePerFollower: 300, label: '성장 단계' },
      { min: 10000, max: 50000, valuePerFollower: 600, label: '중소 크리에이터' },
      { min: 50000, max: 100000, valuePerFollower: 1000, label: '중견 크리에이터' },
      { min: 100000, max: 500000, valuePerFollower: 1500, label: '대형 크리에이터' },
      { min: 500000, max: 1000000, valuePerFollower: 2000, label: '메가 크리에이터' },
      { min: 1000000, max: Infinity, valuePerFollower: 2500, label: '톱 크리에이터' }
    ],
    
    categoryMultiplier: {
      '댄스/음악': 1.2,
      '코미디': 1.1,
      '교육': 1.4,
      '요리': 1.2,
      '뷰티': 1.3,
      '게임': 1.1,
      '펫': 1.2,
      '일상': 0.9,
      '기타': 1.0
    },
    
    // 바이럴 보너스 (평균 조회수 기반)
    viralBonus: {
      mega: 1.5,    // 평균 조회수 > 1M
      high: 1.3,    // 평균 조회수 100K-1M
      medium: 1.1,  // 평균 조회수 10K-100K
      low: 1.0      // 평균 조회수 < 10K
    },
    
    benchmarks: [
      { followers: 10000, value: 6000000, desc: '1만 팔로워' },
      { followers: 50000, value: 50000000, desc: '5만 팔로워' },
      { followers: 100000, value: 100000000, desc: '10만 팔로워' },
      { followers: 500000, value: 750000000, desc: '50만 팔로워' },
      { followers: 1000000, value: 2000000000, desc: '100만 팔로워' }
    ]
  }
};

// 오디언스 기반 가치 계산
export const calculateAudienceValue = (metrics: SNSMetrics): number => {
  const { businessType, subscribers, avgViews, avgLikes, category } = metrics;
  const multiples = audienceMultiples[businessType];
  
  // 1. 구독자 구간 찾기
  const tier = multiples.tiers.find(t => 
    subscribers >= t.min && subscribers < t.max
  ) || multiples.tiers[multiples.tiers.length - 1];
  
  // 2. 기본 가치 계산
  let baseValue = subscribers * (tier as any).valuePerSub || subscribers * (tier as any).valuePerFollower;
  
  // 3. 카테고리 배수 적용
  const categoryMult = (multiples.categoryMultiplier as any)[category || '기타'] || 1.0;
  baseValue *= categoryMult;
  
  // 4. 참여율 보너스 적용
  if (businessType === 'youtube' && avgViews) {
    const viewRate = avgViews / subscribers;
    const engagementBonus = (multiples as any).engagementBonus;
    if (viewRate > 0.2) baseValue *= engagementBonus.high;
    else if (viewRate > 0.1) baseValue *= engagementBonus.medium;
    else baseValue *= engagementBonus.low;
  } else if (businessType === 'instagram' && avgLikes) {
    const likeRate = avgLikes / subscribers;
    const engagementBonus = (multiples as any).engagementBonus;
    if (likeRate > 0.05) baseValue *= engagementBonus.high;
    else if (likeRate > 0.02) baseValue *= engagementBonus.medium;
    else baseValue *= engagementBonus.low;
  } else if (businessType === 'tiktok' && avgViews) {
    const viralBonus = (multiples as any).viralBonus;
    if (avgViews > 1000000) baseValue *= viralBonus.mega;
    else if (avgViews > 100000) baseValue *= viralBonus.high;
    else if (avgViews > 10000) baseValue *= viralBonus.medium;
    else baseValue *= viralBonus.low;
  }
  
  return Math.round(baseValue);
};

// 성장 잠재력 가치 계산
export const calculateGrowthValue = (metrics: SNSMetrics): number => {
  const { businessType, subscribers, avgViews, businessAge } = metrics;
  
  // 성장 단계별 배수
  const growthStageMultiplier: { [key: string]: number } = {
    'new': 1.5,           // 6개월 미만: 초고속 성장 가능성
    'growing': 1.3,       // 6개월-1년: 높은 성장 가능성
    'established': 1.1,   // 1-3년: 안정적 성장
    'mature': 1.0         // 3년 이상: 성숙 단계
  };
  
  // 기본 가치 (오디언스 가치의 변형)
  let growthValue = calculateAudienceValue(metrics);
  
  // 성장 단계 배수 적용
  growthValue *= growthStageMultiplier[businessAge] || 1.0;
  
  // 성장률 추가 보정 (조회수 기반)
  if (avgViews && subscribers) {
    const performanceRatio = avgViews / subscribers;
    if (performanceRatio > 0.5) growthValue *= 1.2;  // 매우 활발
    else if (performanceRatio > 0.2) growthValue *= 1.1;  // 활발
  }
  
  return Math.round(growthValue);
};

// 기존 재무 기반 가치 계산 함수
const calculateFinancialValue = (
  businessType: string,
  monthlyRevenue: number,
  monthlyProfit: number,
  businessAge: string
): number => {
  // 기존 로직 사용
  const multiples: { [key: string]: { revenue: number; profit: number } } = {
    youtube: { revenue: 2.5, profit: 8.0 },
    instagram: { revenue: 2.0, profit: 7.0 },
    tiktok: { revenue: 1.8, profit: 6.0 }
  };
  
  const multiple = multiples[businessType];
  if (!multiple) return 0;
  
  const annualRevenue = monthlyRevenue * 12;
  const annualProfit = monthlyProfit * 12;
  
  let baseValue = Math.max(
    annualRevenue * multiple.revenue,
    annualProfit * multiple.profit
  );
  
  // 사업 기간 조정
  const ageMultiplier: { [key: string]: number } = {
    'new': 0.9,
    'growing': 1.0,
    'established': 1.1,
    'mature': 1.2
  };
  
  return Math.round(baseValue * (ageMultiplier[businessAge] || 1.0));
};

// 종합 SNS 가치 계산
export const calculateSNSValue = (metrics: SNSMetrics): ValuationResult => {
  // 1. 재무 기반 가치 (기존 방식)
  const financialValue = calculateFinancialValue(
    metrics.businessType,
    metrics.monthlyRevenue,
    metrics.monthlyProfit,
    metrics.businessAge
  );
  
  // 2. 오디언스 기반 가치
  const audienceValue = calculateAudienceValue(metrics);
  
  // 3. 성장 잠재력 가치
  const growthValue = calculateGrowthValue(metrics);
  
  // 4. 최종 통합 가치
  return {
    financial: {
      value: financialValue,
      display: `매출 기준: ${formatValue(financialValue)}`,
      weight: 0.3
    },
    audience: {
      value: audienceValue,
      display: `구독자 기준: ${formatValue(audienceValue)}`,
      weight: 0.5
    },
    growth: {
      value: growthValue,
      display: `성장성 기준: ${formatValue(growthValue)}`,
      weight: 0.2
    },
    final: {
      conservative: Math.min(financialValue, audienceValue, growthValue),
      moderate: Math.round(financialValue * 0.3 + audienceValue * 0.5 + growthValue * 0.2),
      optimistic: Math.max(financialValue, audienceValue, growthValue)
    }
  };
};

// 가치 포맷팅 함수
export const formatValue = (value: number): string => {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
  if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만`;
  return `${(value / 10000).toFixed(0)}만`;
};

// 성장 예측 함수
export const predictGrowth = (
  currentSubscribers: number,
  currentValue: number,
  businessType: string
): Array<{ subscribers: number; value: number; timeframe: string }> => {
  const multiples = audienceMultiples[businessType as keyof typeof audienceMultiples];
  const predictions: Array<{ subscribers: number; value: number; timeframe: string }> = [];
  
  // 구독자 성장 시나리오
  const growthScenarios = [
    { multiplier: 2, timeframe: '6개월 후' },
    { multiplier: 5, timeframe: '1년 후' },
    { multiplier: 10, timeframe: '2년 후' }
  ];
  
  growthScenarios.forEach(scenario => {
    const futureSubscribers = currentSubscribers * scenario.multiplier;
    const futureTier = multiples.tiers.find(t => 
      futureSubscribers >= t.min && futureSubscribers < t.max
    ) || multiples.tiers[multiples.tiers.length - 1];
    
    const futureValue = futureSubscribers * ((futureTier as any).valuePerSub || (futureTier as any).valuePerFollower);
    
    predictions.push({
      subscribers: futureSubscribers,
      value: futureValue,
      timeframe: scenario.timeframe
    });
  });
  
  return predictions;
};