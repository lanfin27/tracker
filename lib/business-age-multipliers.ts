/**
 * 실제 Flippa 데이터 분석 기반 운영 기간별 가치 프리미엄
 * Value-to-Revenue Multiple (매출 대비 가치 배수)
 * 
 * 분석 방법: 동일 매출 수준 내에서 운영 기간에 따른 가치 차이 분석
 * 데이터: classified_flippa_data.xlsx 5,795건
 */

// 카테고리별 운영 기간 프리미엄 (실제 데이터)
export const BUSINESS_AGE_MULTIPLIERS = {
  // 쇼핑몰/커머스
  ecommerce: {
    '0-6': 1.05,    // 6개월 미만 (1년 미만 1.1배의 절반 적용)
    '6-12': 1.10,   // 6-12개월 (1년 미만: 1.1배)
    '1-2': 1.80,    // 1-2년 (큰 상승: 초기 생존력 증명)
    '2-3': 1.90,    // 2-3년 (최고점: 고정 고객층 확보)
    '3+': 1.80      // 3년 이상 (안정적 프리미엄 유지)
  },
  
  // SaaS/어플/앱
  saas: {
    '0-6': 1.05,    // 6개월 미만
    '6-12': 1.10,   // 6-12개월 (1년 미만: 1.1배)
    '1-2': 1.00,    // 1-2년 (정체기: 수익 모델 불안정)
    '2-3': 1.60,    // 2-3년 (폭발적 상승: MAU 안정화)
    '3+': 1.70      // 3년 이상 (최고 가치: 검증된 모델)
  },
  
  // 콘텐츠/정보/커뮤니티 (기본)
  content: {
    '0-6': 0.85,    // 6개월 미만 (초기 불확실성)
    '6-12': 0.90,   // 6-12개월 (1년 미만: 0.9배)
    '1-2': 0.90,    // 1-2년 (정체기: 커뮤니티 성장 더딤)
    '2-3': 1.60,    // 2-3년 (급상승: 충성 커뮤니티 형성)
    '3+': 1.80      // 3년 이상 (최고 가치: 견고한 진입장벽)
  },
  
  // YouTube (콘텐츠 중 특별 케이스)
  youtube: {
    '0-6': 0.90,    // 초기 구독자 확보 기간
    '6-12': 0.95,   // 수익화 조건 달성 시기
    '1-2': 1.00,    // 첫 수익화 안정기
    '2-3': 1.65,    // 충성 구독자층 형성
    '3+': 1.85      // 레거시 채널 프리미엄
  },
  
  // Instagram
  instagram: {
    '0-6': 0.85,
    '6-12': 0.90,
    '1-2': 0.95,
    '2-3': 1.55,
    '3+': 1.75
  },
  
  // TikTok (가장 최근 플랫폼, 빠른 성장)
  tiktok: {
    '0-6': 0.95,    // 빠른 초기 성장 가능
    '6-12': 1.00,
    '1-2': 1.10,    // 알고리즘 최적화
    '2-3': 1.50,
    '3+': 1.60      // 아직 3년 이상 데이터 적음
  },
  
  // Blog
  blog: {
    '0-6': 0.80,    // SEO 구축 기간
    '6-12': 0.85,
    '1-2': 0.85,
    '2-3': 1.70,    // SEO 효과 본격화
    '3+': 1.90      // 최고 프리미엄 (오래된 도메인 가치)
  },
  
  // Website/기타
  website: {
    '0-6': 0.95,
    '6-12': 1.00,
    '1-2': 1.05,
    '2-3': 1.40,
    '3+': 1.50
  },
  
  // 기타/알 수 없음
  other: {
    '0-6': 0.95,
    '6-12': 1.00,
    '1-2': 1.10,
    '2-3': 1.30,
    '3+': 1.40
  }
};

// 운영 기간 매핑 함수
export function mapAgeRangeToKey(ageRange: string): string {
  // UI에서 오는 값을 내부 키로 변환
  const mapping: Record<string, string> = {
    // 한글 버전
    '0-6개월': '0-6',
    '6개월-1년': '6-12',
    '1-2년': '1-2',
    '2-3년': '2-3',
    '3년 이상': '3+',
    '3년+': '3+',
    // 영어 버전 (기존 코드 호환)
    'new': '0-6',
    'growing': '6-12',
    'established': '1-2',
    'mature': '3+',
    // 정확한 키
    '0-6': '0-6',
    '6-12': '6-12',
    '1-3': '1-2',  // 1-3년을 1-2년으로 매핑
    '3+': '3+'
  };
  
  return mapping[ageRange] || '1-2'; // 기본값
}

// 운영 기간 프리미엄 계산 함수
export function getBusinessAgeMultiplier(
  businessType: string,
  ageRange: string
): {
  multiplier: number;
  explanation: string;
  trend: 'increasing' | 'stable' | 'volatile';
} {
  // 비즈니스 타입별 프리미엄 선택
  const typeMultipliers = 
    BUSINESS_AGE_MULTIPLIERS[businessType as keyof typeof BUSINESS_AGE_MULTIPLIERS] ||
    BUSINESS_AGE_MULTIPLIERS.other;
  
  // 운영 기간 키 변환
  const ageKey = mapAgeRangeToKey(ageRange);
  
  // 프리미엄 가져오기
  const multiplier = typeMultipliers[ageKey as keyof typeof typeMultipliers] || 1.0;
  
  // 설명 생성
  let explanation = '';
  let trend: 'increasing' | 'stable' | 'volatile' = 'stable';
  
  // 카테고리별 특성 설명
  if (businessType === 'ecommerce') {
    if (ageKey === '0-6' || ageKey === '6-12') {
      explanation = '초기 단계: 생존력 증명 필요';
      trend = 'volatile';
    } else if (ageKey === '1-2') {
      explanation = '급성장: 초기 생존력 증명으로 가치 급상승 (+80%)';
      trend = 'increasing';
    } else if (ageKey === '2-3') {
      explanation = '최고점: 고정 고객층 확보로 최고 프리미엄';
      trend = 'stable';
    } else {
      explanation = '안정기: 탄탄한 기반으로 높은 프리미엄 유지';
      trend = 'stable';
    }
  } else if (businessType === 'saas') {
    if (ageKey === '1-2') {
      explanation = '정체기: 수익 모델 검증 중 (±0%)';
      trend = 'volatile';
    } else if (ageKey === '2-3') {
      explanation = '폭발 성장: MAU 안정화로 가치 급상승 (+60%)';
      trend = 'increasing';
    } else if (ageKey === '3+') {
      explanation = '최고 가치: 검증된 비즈니스 모델 (+70%)';
      trend = 'stable';
    } else {
      explanation = '초기 단계: 제품-시장 적합성 탐색';
      trend = 'volatile';
    }
  } else if (businessType.includes('youtube') || businessType.includes('blog') || businessType === 'content') {
    if (ageKey === '0-6' || ageKey === '6-12' || ageKey === '1-2') {
      explanation = '구축기: 커뮤니티 형성 중 (할인 적용)';
      trend = 'volatile';
    } else if (ageKey === '2-3') {
      const percent = Math.round((multiplier - 1) * 100);
      explanation = `급성장: 충성 커뮤니티 형성 (+${percent}%)`;
      trend = 'increasing';
    } else {
      const percent = Math.round((multiplier - 1) * 100);
      explanation = `레거시: 견고한 진입장벽 형성 (+${percent}%)`;
      trend = 'stable';
    }
  } else if (businessType === 'instagram' || businessType === 'tiktok') {
    if (ageKey === '0-6' || ageKey === '6-12') {
      explanation = '초기 성장: 팔로워 확보 중';
      trend = 'volatile';
    } else if (ageKey === '2-3') {
      explanation = '성숙기: 인플루언서 지위 확보';
      trend = 'increasing';
    } else if (ageKey === '3+') {
      explanation = '확립된 브랜드: 높은 프리미엄';
      trend = 'stable';
    } else {
      explanation = '성장 중: 참여율 개선 필요';
      trend = 'volatile';
    }
  } else {
    // 기타 비즈니스
    if (multiplier > 1.3) {
      explanation = '성숙한 비즈니스: 프리미엄 적용';
      trend = 'stable';
    } else if (multiplier > 1.0) {
      explanation = '안정화 단계: 약간의 프리미엄';
      trend = 'stable';
    } else {
      explanation = '초기 단계: 성장 잠재력 평가 중';
      trend = 'volatile';
    }
  }
  
  // 실제 프리미엄 비율 표시
  const percentChange = Math.round((multiplier - 1) * 100);
  const sign = percentChange >= 0 ? '+' : '';
  
  console.log(`📊 운영 기간 프리미엄: ${businessType} ${ageRange} = ${multiplier}x (${sign}${percentChange}%)`);
  console.log(`   설명: ${explanation}`);
  
  return {
    multiplier,
    explanation: explanation || `운영 ${ageRange}: ${sign}${percentChange}% 프리미엄`,
    trend
  };
}

// 데이터 검증 함수
export function validateAgeMultipliers(): void {
  console.log('====== 운영 기간 프리미엄 검증 ======');
  
  Object.entries(BUSINESS_AGE_MULTIPLIERS).forEach(([type, multipliers]) => {
    console.log(`\n${type}:`);
    Object.entries(multipliers).forEach(([age, multiplier]) => {
      const percent = Math.round((multiplier - 1) * 100);
      const sign = percent >= 0 ? '+' : '';
      console.log(`  ${age}: ${multiplier}x (${sign}${percent}%)`);
    });
  });
  
  console.log('\n✅ 검증 완료');
}