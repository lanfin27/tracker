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
export const calculateAudienceValue = (metrics: SNSMetrics, calcId?: string): number => {
  const { businessType, subscribers, avgViews, avgLikes, category } = metrics;
  const multiples = audienceMultiples[businessType];
  const id = calcId || `AUD_${Date.now()}`;
  
  console.log(`\n[${id}] 📊 오디언스 가치 계산 시작`);
  console.log(`[${id}] 입력 데이터:`, {
    businessType,
    subscribers,
    avgViews: avgViews || 0,
    avgLikes: avgLikes || 0,
    category: category || '없음'
  });
  
  // 1. 구독자 구간 찾기
  const tier = multiples.tiers.find(t => 
    subscribers >= t.min && subscribers < t.max
  ) || multiples.tiers[multiples.tiers.length - 1];
  
  console.log(`[${id}] 📈 구독자 구간:`, {
    tierRange: `${tier.min} ~ ${tier.max === Infinity ? '∞' : tier.max}`,
    tierLabel: tier.label,
    valuePerUnit: (tier as any).valuePerSub || (tier as any).valuePerFollower,
    unit: businessType === 'youtube' ? '구독자' : '팔로워'
  });
  
  // 2. 기본 가치 계산
  const perUnitValue = (tier as any).valuePerSub || (tier as any).valuePerFollower;
  let baseValue = subscribers * perUnitValue;
  
  console.log(`[${id}] 💵 기본 가치:`, {
    formula: `${subscribers} × ${perUnitValue}원`,
    baseValue: Math.round(baseValue),
    baseValueKRW: `${(baseValue / 100000000).toFixed(2)}억원`
  });
  
  // 3. 카테고리 배수 적용
  const categoryMult = (multiples.categoryMultiplier as any)[category || '기타'] || 1.0;
  const beforeCategory = baseValue;
  baseValue *= categoryMult;
  
  console.log(`[${id}] 🏷️ 카테고리 조정:`, {
    category: category || '기타',
    multiplier: categoryMult,
    beforeAdjustment: Math.round(beforeCategory),
    afterAdjustment: Math.round(baseValue),
    impact: `${((categoryMult - 1) * 100).toFixed(0)}%`
  });
  
  // 4. 참여율 보너스 적용
  let engagementMultiplier = 1.0;
  let engagementType = 'none';
  
  if (businessType === 'youtube' && avgViews) {
    const viewRate = avgViews / subscribers;
    const engagementBonus = (multiples as any).engagementBonus;
    
    if (viewRate > 0.2) {
      engagementMultiplier = engagementBonus.high;
      engagementType = 'high';
    } else if (viewRate > 0.1) {
      engagementMultiplier = engagementBonus.medium;
      engagementType = 'medium';
    } else {
      engagementMultiplier = engagementBonus.low;
      engagementType = 'low';
    }
    
    console.log(`[${id}] 👥 참여율 보너스 (YouTube):`, {
      avgViews,
      subscribers,
      viewRate: `${(viewRate * 100).toFixed(1)}%`,
      engagementLevel: engagementType,
      multiplier: engagementMultiplier,
      impact: `${((engagementMultiplier - 1) * 100).toFixed(0)}%`
    });
    
  } else if (businessType === 'instagram' && avgLikes) {
    const likeRate = avgLikes / subscribers;
    const engagementBonus = (multiples as any).engagementBonus;
    
    if (likeRate > 0.05) {
      engagementMultiplier = engagementBonus.high;
      engagementType = 'high';
    } else if (likeRate > 0.02) {
      engagementMultiplier = engagementBonus.medium;
      engagementType = 'medium';
    } else {
      engagementMultiplier = engagementBonus.low;
      engagementType = 'low';
    }
    
    console.log(`[${id}] ❤️ 참여율 보너스 (Instagram):`, {
      avgLikes,
      subscribers,
      likeRate: `${(likeRate * 100).toFixed(2)}%`,
      engagementLevel: engagementType,
      multiplier: engagementMultiplier,
      impact: `${((engagementMultiplier - 1) * 100).toFixed(0)}%`
    });
    
  } else if (businessType === 'tiktok' && avgViews) {
    const viralBonus = (multiples as any).viralBonus;
    
    if (avgViews > 1000000) {
      engagementMultiplier = viralBonus.mega;
      engagementType = 'mega';
    } else if (avgViews > 100000) {
      engagementMultiplier = viralBonus.high;
      engagementType = 'high';
    } else if (avgViews > 10000) {
      engagementMultiplier = viralBonus.medium;
      engagementType = 'medium';
    } else {
      engagementMultiplier = viralBonus.low;
      engagementType = 'low';
    }
    
    console.log(`[${id}] 🚀 바이럴 보너스 (TikTok):`, {
      avgViews,
      viralLevel: engagementType,
      multiplier: engagementMultiplier,
      impact: `${((engagementMultiplier - 1) * 100).toFixed(0)}%`
    });
  }
  
  const beforeEngagement = baseValue;
  baseValue *= engagementMultiplier;
  
  if (engagementMultiplier !== 1.0) {
    console.log(`[${id}] 🎯 참여율 적용 결과:`, {
      beforeEngagement: Math.round(beforeEngagement),
      afterEngagement: Math.round(baseValue),
      totalImpact: `${(((baseValue / (subscribers * perUnitValue)) - 1) * 100).toFixed(0)}%`
    });
  }
  
  const finalValue = Math.round(baseValue);
  
  console.log(`[${id}] ✅ 오디언스 가치 계산 완료:`, {
    finalValue,
    finalValueKRW: `${(finalValue / 100000000).toFixed(2)}억원`,
    calculation: `${subscribers} × ${perUnitValue} × ${categoryMult} × ${engagementMultiplier}`
  });
  
  return finalValue;
};

// 성장 잠재력 가치 계산
export const calculateGrowthValue = (metrics: SNSMetrics, calcId?: string): number => {
  const { businessType, subscribers, avgViews, businessAge } = metrics;
  const id = calcId || `GRW_${Date.now()}`;
  
  console.log(`\n[${id}] 🌱 성장 잠재력 계산 시작`);
  console.log(`[${id}] 입력 데이터:`, {
    businessType,
    subscribers,
    avgViews: avgViews || 0,
    businessAge: businessAge || 'unknown'
  });
  
  // 성장 단계별 배수
  const growthStageMultiplier: { [key: string]: number } = {
    'new': 1.5,           // 6개월 미만: 초고속 성장 가능성
    'growing': 1.3,       // 6개월-1년: 높은 성장 가능성
    'established': 1.1,   // 1-3년: 안정적 성장
    'mature': 1.0         // 3년 이상: 성숙 단계
  };
  
  // 기본 가치 (오디언스 가치의 변형)
  let growthValue = calculateAudienceValue(metrics, `${id}_AUD`);
  
  console.log(`[${id}] 📊 오디언스 기반 가치: ${Math.round(growthValue)}`);
  
  // 성장 단계 배수 적용
  const stageMultiplier = growthStageMultiplier[businessAge] || 1.0;
  const beforeStage = growthValue;
  growthValue *= stageMultiplier;
  
  console.log(`[${id}] 📈 성장 단계 조정:`, {
    businessAge,
    stageMultiplier,
    beforeAdjustment: Math.round(beforeStage),
    afterAdjustment: Math.round(growthValue),
    impact: `${((stageMultiplier - 1) * 100).toFixed(0)}%`
  });
  
  // 성장률 추가 보정 (조회수 기반)
  if (avgViews && subscribers) {
    const performanceRatio = avgViews / subscribers;
    let performanceMultiplier = 1.0;
    let performanceLevel = 'normal';
    
    if (performanceRatio > 0.5) {
      performanceMultiplier = 1.2;
      performanceLevel = 'very_active';
    } else if (performanceRatio > 0.2) {
      performanceMultiplier = 1.1;
      performanceLevel = 'active';
    }
    
    const beforePerformance = growthValue;
    growthValue *= performanceMultiplier;
    
    console.log(`[${id}] 🚀 활동성 보정:`, {
      avgViews,
      subscribers,
      performanceRatio: `${(performanceRatio * 100).toFixed(1)}%`,
      performanceLevel,
      multiplier: performanceMultiplier,
      beforeAdjustment: Math.round(beforePerformance),
      afterAdjustment: Math.round(growthValue),
      impact: `${((performanceMultiplier - 1) * 100).toFixed(0)}%`
    });
  }
  
  const finalValue = Math.round(growthValue);
  
  console.log(`[${id}] ✅ 성장 잠재력 계산 완료:`, {
    finalValue,
    finalValueKRW: `${(finalValue / 100000000).toFixed(2)}억원`
  });
  
  return finalValue;
};

// 기존 재무 기반 가치 계산 함수
const calculateFinancialValue = (
  businessType: string,
  monthlyRevenue: number,
  monthlyProfit: number,
  businessAge: string,
  calcId?: string
): number => {
  const id = calcId || `FIN_${Date.now()}`;
  
  console.log(`\n[${id}] 💰 재무 기반 가치 계산 시작`);
  console.log(`[${id}] 입력 데이터:`, {
    businessType,
    monthlyRevenue,
    monthlyProfit,
    businessAge
  });
  
  // 기존 로직 사용
  const multiples: { [key: string]: { revenue: number; profit: number } } = {
    youtube: { revenue: 2.5, profit: 8.0 },
    instagram: { revenue: 2.0, profit: 7.0 },
    tiktok: { revenue: 1.8, profit: 6.0 }
  };
  
  const multiple = multiples[businessType];
  if (!multiple) {
    console.log(`[${id}] ⚠️ 비즈니스 타입 ${businessType}에 대한 멀티플 없음`);
    return 0;
  }
  
  console.log(`[${id}] 📊 멀티플:`, {
    revenueMultiple: multiple.revenue,
    profitMultiple: multiple.profit
  });
  
  const annualRevenue = monthlyRevenue * 12;
  const annualProfit = monthlyProfit * 12;
  
  const revenueBasedValue = annualRevenue * multiple.revenue;
  const profitBasedValue = annualProfit * multiple.profit;
  
  let baseValue = Math.max(revenueBasedValue, profitBasedValue);
  const selectedMethod = revenueBasedValue > profitBasedValue ? 'revenue' : 'profit';
  
  console.log(`[${id}] 💵 기본 가치 계산:`, {
    annualRevenue,
    annualProfit,
    revenueBasedValue: Math.round(revenueBasedValue),
    profitBasedValue: Math.round(profitBasedValue),
    selectedMethod,
    baseValue: Math.round(baseValue)
  });
  
  // 사업 기간 조정
  const ageMultiplier: { [key: string]: number } = {
    'new': 0.9,
    'growing': 1.0,
    'established': 1.1,
    'mature': 1.2
  };
  
  const ageMult = ageMultiplier[businessAge] || 1.0;
  const beforeAge = baseValue;
  baseValue *= ageMult;
  
  console.log(`[${id}] 📅 사업 기간 조정:`, {
    businessAge,
    ageMultiplier: ageMult,
    beforeAdjustment: Math.round(beforeAge),
    afterAdjustment: Math.round(baseValue),
    impact: `${((ageMult - 1) * 100).toFixed(0)}%`
  });
  
  const finalValue = Math.round(baseValue);
  
  console.log(`[${id}] ✅ 재무 기반 계산 완료:`, {
    finalValue,
    finalValueKRW: `${(finalValue / 100000000).toFixed(2)}억원`
  });
  
  return finalValue;
};

// 종합 SNS 가치 계산
export const calculateSNSValue = (metrics: SNSMetrics): ValuationResult => {
  // 고유 계산 ID 생성
  const calcId = `SNS_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  
  console.log('\n========================================');
  console.log(`[${calcId}] 🎯 SNS 종합 가치평가 시작`);
  console.log(`[${calcId}] ⏰ 시간: ${new Date().toISOString()}`);
  console.log(`[${calcId}] 📥 전체 입력 데이터:`, {
    businessType: metrics.businessType,
    subscribers: metrics.subscribers,
    avgViews: metrics.avgViews || 0,
    avgLikes: metrics.avgLikes || 0,
    category: metrics.category || '없음',
    monthlyRevenue: metrics.monthlyRevenue,
    monthlyProfit: metrics.monthlyProfit,
    businessAge: metrics.businessAge
  });
  
  // 1. 재무 기반 가치 (기존 방식)
  console.log(`\n[${calcId}] === 1/3 재무 기반 가치 계산 ===`);
  const financialValue = calculateFinancialValue(
    metrics.businessType,
    metrics.monthlyRevenue,
    metrics.monthlyProfit,
    metrics.businessAge,
    `${calcId}_FIN`
  );
  
  // 2. 오디언스 기반 가치
  console.log(`\n[${calcId}] === 2/3 오디언스 기반 가치 계산 ===`);
  const audienceValue = calculateAudienceValue(metrics, `${calcId}_AUD`);
  
  // 3. 성장 잠재력 가치
  console.log(`\n[${calcId}] === 3/3 성장 잠재력 가치 계산 ===`);
  const growthValue = calculateGrowthValue(metrics, `${calcId}_GRW`);
  
  // 4. 최종 통합 가치
  const conservative = Math.min(financialValue, audienceValue, growthValue);
  const moderate = Math.round(financialValue * 0.3 + audienceValue * 0.5 + growthValue * 0.2);
  const optimistic = Math.max(financialValue, audienceValue, growthValue);
  
  console.log(`\n[${calcId}] 📊 종합 결과:`);
  console.log(`[${calcId}] ├─ 재무 기반: ${formatValue(financialValue)} (가중치 30%)`);  
  console.log(`[${calcId}] ├─ 오디언스 기반: ${formatValue(audienceValue)} (가중치 50%)`);
  console.log(`[${calcId}] └─ 성장 잠재력: ${formatValue(growthValue)} (가중치 20%)`);
  
  console.log(`\n[${calcId}] 💎 최종 가치 평가:`);
  console.log(`[${calcId}] ├─ 보수적: ${formatValue(conservative)} (최소값)`);
  console.log(`[${calcId}] ├─ 중립적: ${formatValue(moderate)} (가중평균)`);
  console.log(`[${calcId}] └─ 낙관적: ${formatValue(optimistic)} (최대값)`);
  
  console.log(`\n[${calcId}] 📈 가치 분포:`);
  console.log(`[${calcId}] ├─ 범위: ${formatValue(conservative)} ~ ${formatValue(optimistic)}`);
  console.log(`[${calcId}] └─ 변동폭: ${((optimistic / conservative - 1) * 100).toFixed(0)}%`);
  
  console.log(`\n[${calcId}] ✅ SNS 종합 가치평가 완료`);
  console.log(`[${calcId}] ⏱️ 계산 종료: ${new Date().toISOString()}`);
  console.log(`[${calcId}] 🔑 계산 ID: ${calcId}`);
  console.log('========================================\n');
  
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
      conservative,
      moderate,
      optimistic
    },
    calculationId: calcId
  } as ValuationResult & { calculationId: string };
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