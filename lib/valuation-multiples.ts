// 2024년 한국 시장 기준 실제 업종별 멀티플
export const valuationMultiples = {
  youtube: {
    name: "유튜브",
    revenueMultiple: 2.5,  // 연매출 기준
    profitMultiple: 8.0,   // 순이익 기준
    subscriberValue: 2000, // 구독자당 가치 (원)
    benchmarks: {
      small: { subscribers: 10000, avgValue: 50000000 },    // 5천만원
      medium: { subscribers: 100000, avgValue: 300000000 },  // 3억원
      large: { subscribers: 1000000, avgValue: 2000000000 }  // 20억원
    },
    description: "구독자 10만 기준 평균 3억원"
  },
  
  instagram: {
    name: "인스타그램",
    revenueMultiple: 2.0,
    profitMultiple: 7.0,
    followerValue: 1500,  // 팔로워당 가치
    benchmarks: {
      small: { followers: 10000, avgValue: 30000000 },
      medium: { followers: 50000, avgValue: 150000000 },
      large: { followers: 200000, avgValue: 600000000 }
    },
    description: "팔로워 5만 기준 평균 1.5억원"
  },
  
  tiktok: {
    name: "틱톡",
    revenueMultiple: 1.8,
    profitMultiple: 6.5,
    followerValue: 1200,
    benchmarks: {
      small: { followers: 50000, avgValue: 40000000 },
      medium: { followers: 200000, avgValue: 180000000 },
      large: { followers: 1000000, avgValue: 800000000 }
    },
    description: "팔로워 20만 기준 평균 1.8억원"
  },
  
  blog: {
    name: "블로그",
    revenueMultiple: 1.8,
    profitMultiple: 6.0,
    dailyVisitorValue: 50000,  // 일 방문자당 가치
    benchmarks: {
      small: { visitors: 1000, avgValue: 30000000 },
      medium: { visitors: 10000, avgValue: 200000000 },
      large: { visitors: 50000, avgValue: 800000000 }
    },
    description: "일 방문자 1만 기준 평균 2억원"
  },
  
  ecommerce: {
    name: "이커머스",
    revenueMultiple: 1.2,
    profitMultiple: 5.0,
    customerValue: 100000,  // 고객당 LTV
    benchmarks: {
      small: { revenue: 10000000, avgValue: 100000000 },   // 월 1천만원 매출
      medium: { revenue: 50000000, avgValue: 500000000 },   // 월 5천만원 매출
      large: { revenue: 200000000, avgValue: 2000000000 }   // 월 2억원 매출
    },
    description: "월 매출 5천만원 기준 평균 5억원"
  },
  
  saas: {
    name: "SaaS",
    revenueMultiple: 4.0,  // ARR 기준
    profitMultiple: 12.0,
    mrrMultiple: 48,       // 월 반복 매출 배수
    benchmarks: {
      small: { mrr: 5000000, avgValue: 240000000 },     // MRR 500만원
      medium: { mrr: 20000000, avgValue: 960000000 },    // MRR 2천만원
      large: { mrr: 100000000, avgValue: 4800000000 }    // MRR 1억원
    },
    description: "MRR 2천만원 기준 평균 9.6억원"
  },
  
  website: {
    name: "웹사이트",
    revenueMultiple: 2.2,
    profitMultiple: 7.5,
    monthlyVisitorValue: 1000,  // 월 방문자당 가치
    benchmarks: {
      small: { visitors: 10000, avgValue: 50000000 },
      medium: { visitors: 100000, avgValue: 300000000 },
      large: { visitors: 1000000, avgValue: 1500000000 }
    },
    description: "월 방문자 10만 기준 평균 3억원"
  }
};

// 정확한 가치 계산 함수
export const calculateBusinessValue = (
  businessType: string,
  monthlyRevenue: number,  // 원 단위
  monthlyProfit: number,   // 원 단위
  subscribers?: number,    // 구독자/팔로워 수
  businessAge?: string     // 사업 기간
): number => {
  const multiple = valuationMultiples[businessType as keyof typeof valuationMultiples] || {
    name: "기타",
    revenueMultiple: 1.5,
    profitMultiple: 6.0
  };
  
  // 연간 금액으로 변환
  const annualRevenue = monthlyRevenue * 12;
  const annualProfit = monthlyProfit * 12;
  
  // 기본 가치 계산 (매출 배수와 이익 배수 중 높은 값)
  let baseValue = Math.max(
    annualRevenue * multiple.revenueMultiple,
    annualProfit * multiple.profitMultiple
  );
  
  // SNS 비즈니스의 경우 구독자/팔로워 가치 추가
  if (subscribers && ['youtube', 'instagram', 'tiktok'].includes(businessType)) {
    let perSubscriberValue = 0;
    if (businessType === 'youtube' && 'subscriberValue' in multiple) {
      perSubscriberValue = multiple.subscriberValue;
    } else if ((businessType === 'instagram' || businessType === 'tiktok') && 'followerValue' in multiple) {
      perSubscriberValue = (multiple as any).followerValue;
    }
    const subscriberValue = subscribers * perSubscriberValue;
    // 구독자 가치와 재무 가치 중 높은 값 선택
    baseValue = Math.max(baseValue, subscriberValue);
  }
  
  // SaaS의 경우 MRR 배수 적용
  if (businessType === 'saas' && 'mrrMultiple' in multiple) {
    const mrrValue = monthlyRevenue * multiple.mrrMultiple;
    baseValue = Math.max(baseValue, mrrValue);
  }
  
  // 사업 기간에 따른 조정
  let ageMultiplier = 1.0;
  switch(businessAge) {
    case 'new':
      ageMultiplier = 0.9;  // 신규 사업 할인
      break;
    case 'growing':
      ageMultiplier = 1.0;  // 기본
      break;
    case 'established':
      ageMultiplier = 1.1;  // 안정기 프리미엄
      break;
    case 'mature':
      ageMultiplier = 1.2;  // 검증된 사업 프리미엄
      break;
  }
  
  return Math.round(baseValue * ageMultiplier);
};

// 벤치마크 대비 위치 계산
export const getBenchmarkPosition = (
  businessType: string,
  value: number
): { level: string; percentile: number } => {
  const multiple = valuationMultiples[businessType as keyof typeof valuationMultiples];
  
  if (!multiple || !multiple.benchmarks) {
    return { level: '평가중', percentile: 50 };
  }
  
  const benchmarks = multiple.benchmarks;
  
  // benchmarks의 첫 번째 키의 avgValue를 가져옴
  const values = Object.values(benchmarks);
  const smallValue = values[0]?.avgValue || 0;
  const mediumValue = values[1]?.avgValue || 0;
  const largeValue = values[2]?.avgValue || 0;
  
  if (value < smallValue) {
    return { level: '초기', percentile: 20 };
  } else if (value < mediumValue) {
    return { level: '성장', percentile: 50 };
  } else if (value < largeValue) {
    return { level: '성숙', percentile: 80 };
  } else {
    return { level: '최상위', percentile: 95 };
  }
};

// 업종별 평균 정보 가져오기
export const getIndustryAverage = (businessType: string): string => {
  const multiple = valuationMultiples[businessType as keyof typeof valuationMultiples];
  return multiple?.description || "업종 평균 정보 없음";
};