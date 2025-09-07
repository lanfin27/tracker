/**
 * YouTube/Instagram/TikTok 카테고리별 구독자/팔로워 가치 멀티플
 * 기준: 실제 거래 데이터 및 업계 벤치마크 분석
 * 2025년 한국 시장 기준
 */

import { getAdjustedFollowerValue } from './platform-conversion-rates';

// YouTube 카테고리별 구독자당 가치 (원)
export const YOUTUBE_CATEGORY_MULTIPLES = {
  '교육/강의': {
    name: '교육/강의',
    subscriberValue: 450,
    premium: 1.5,
    description: '교육 콘텐츠, 온라인 강의, 튜토리얼',
    benchmarks: {
      high: { subs: 100000, value: 67500000 }, // 6.75억
      medium: { subs: 10000, value: 6750000 },  // 675만원
      low: { subs: 1000, value: 675000 }        // 67.5만원
    }
  },
  '금융/경제': {
    name: '금융/경제',
    subscriberValue: 520,
    premium: 1.8,
    description: '재테크, 투자, 경제 분석, 부동산',
    benchmarks: {
      high: { subs: 100000, value: 93600000 },
      medium: { subs: 10000, value: 9360000 },
      low: { subs: 1000, value: 936000 }
    }
  },
  '테크/IT': {
    name: '테크/IT',
    subscriberValue: 380,
    premium: 1.3,
    description: 'IT 리뷰, 기술 분석, 프로그래밍',
    benchmarks: {
      high: { subs: 100000, value: 49400000 },
      medium: { subs: 10000, value: 4940000 },
      low: { subs: 1000, value: 494000 }
    }
  },
  '뷰티/패션': {
    name: '뷰티/패션',
    subscriberValue: 320,
    premium: 1.2,
    description: '메이크업, 패션, 스타일링, 하울',
    benchmarks: {
      high: { subs: 100000, value: 38400000 },
      medium: { subs: 10000, value: 3840000 },
      low: { subs: 1000, value: 384000 }
    }
  },
  '요리/먹방': {
    name: '요리/먹방',
    subscriberValue: 360,
    premium: 1.1,
    description: '요리, 먹방, 맛집 리뷰, 레시피',
    benchmarks: {
      high: { subs: 100000, value: 39600000 },
      medium: { subs: 10000, value: 3960000 },
      low: { subs: 1000, value: 396000 }
    }
  },
  '엔터테인먼트': {
    name: '엔터테인먼트',
    subscriberValue: 280,
    premium: 1.0,
    description: '예능, 코미디, 버라이어티, 토크쇼',
    benchmarks: {
      high: { subs: 100000, value: 28000000 },
      medium: { subs: 10000, value: 2800000 },
      low: { subs: 1000, value: 280000 }
    }
  },
  '일상/브이로그': {
    name: '일상/브이로그',
    subscriberValue: 420,
    premium: 1.4,
    description: '일상 기록, 브이로그, 라이프스타일',
    benchmarks: {
      high: { subs: 100000, value: 58800000 },
      medium: { subs: 10000, value: 5880000 },
      low: { subs: 1000, value: 588000 }
    }
  },
  '게임': {
    name: '게임',
    subscriberValue: 250,
    premium: 0.9,
    description: '게임 플레이, 게임 리뷰, e스포츠',
    benchmarks: {
      high: { subs: 100000, value: 22500000 },
      medium: { subs: 10000, value: 2250000 },
      low: { subs: 1000, value: 225000 }
    }
  },
  '키즈': {
    name: '키즈',
    subscriberValue: 390,
    premium: 1.3,
    description: '어린이 콘텐츠, 키즈 교육, 장난감',
    benchmarks: {
      high: { subs: 100000, value: 50700000 },
      medium: { subs: 10000, value: 5070000 },
      low: { subs: 1000, value: 507000 }
    }
  },
  '기타': {
    name: '기타',
    subscriberValue: 300,
    premium: 1.0,
    description: '기타 카테고리',
    benchmarks: {
      high: { subs: 100000, value: 30000000 },
      medium: { subs: 10000, value: 3000000 },
      low: { subs: 1000, value: 300000 }
    }
  }
};

// Instagram 카테고리별 팔로워당 가치 (플랫폼 환산율 적용)
export const INSTAGRAM_CATEGORY_MULTIPLES = {
  '패션': {
    name: '패션',
    followerValue: getAdjustedFollowerValue('instagram', '패션', 320), // YouTube 뷰티/패션 320원 기준
    premium: 1.4,
    description: '패션, 스타일링, OOTD',
    benchmarks: {
      high: { followers: 100000, value: 6667000 },  // 환산 적용
      medium: { followers: 10000, value: 667000 },
      low: { followers: 1000, value: 66700 }
    }
  },
  '뷰티': {
    name: '뷰티',
    followerValue: getAdjustedFollowerValue('instagram', '뷰티', 320), // YouTube 뷰티/패션 320원 기준
    premium: 1.5,
    description: '메이크업, 스킨케어, 뷰티 리뷰',
    benchmarks: {
      high: { followers: 100000, value: 6933000 },  // 환산 적용
      medium: { followers: 10000, value: 693300 },
      low: { followers: 1000, value: 69330 }
    }
  },
  '피트니스': {
    name: '피트니스',
    followerValue: getAdjustedFollowerValue('instagram', '피트니스', 300), // 기본값 300원 기준
    premium: 1.3,
    description: '운동, 다이어트, 건강 관리',
    benchmarks: {
      high: { followers: 100000, value: 5750000 },  // 환산 적용
      medium: { followers: 10000, value: 575000 },
      low: { followers: 1000, value: 57500 }
    }
  },
  '여행': {
    name: '여행',
    followerValue: getAdjustedFollowerValue('instagram', '여행', 300), // 기본값 300원
    premium: 1.2,
    description: '여행, 숙소, 맛집',
    benchmarks: {
      high: { followers: 100000, value: 5500000 },  // 환산 적용
      medium: { followers: 10000, value: 550000 },
      low: { followers: 1000, value: 55000 }
    }
  },
  '음식': {
    name: '음식',
    followerValue: getAdjustedFollowerValue('instagram', '음식', 360), // YouTube 요리/먹방 360원
    premium: 1.1,
    description: '음식, 카페, 맛집',
    benchmarks: {
      high: { followers: 100000, value: 6600000 },  // 환산 적용
      medium: { followers: 10000, value: 660000 },
      low: { followers: 1000, value: 66000 }
    }
  },
  '라이프스타일': {
    name: '라이프스타일',
    followerValue: getAdjustedFollowerValue('instagram', '라이프스타일', 420), // YouTube 일상/브이로그 420원
    premium: 1.0,
    description: '일상, 라이프스타일, 인테리어',
    benchmarks: {
      high: { followers: 100000, value: 8400000 },  // 환산 적용
      medium: { followers: 10000, value: 840000 },
      low: { followers: 1000, value: 84000 }
    }
  },
  '사진': {
    name: '사진',
    followerValue: getAdjustedFollowerValue('instagram', '사진', 250), // 기본값
    premium: 1.1,
    description: '사진, 포토그래피',
    benchmarks: {
      high: { followers: 100000, value: 3958000 },  // 환산 적용
      medium: { followers: 10000, value: 395800 },
      low: { followers: 1000, value: 39580 }
    }
  },
  '예술': {
    name: '예술',
    followerValue: getAdjustedFollowerValue('instagram', '예술', 250), // 기본값
    premium: 1.0,
    description: '예술, 창작, 디자인',
    benchmarks: {
      high: { followers: 100000, value: 3958000 },  // 환산 적용
      medium: { followers: 10000, value: 395800 },
      low: { followers: 1000, value: 39580 }
    }
  },
  '펫': {
    name: '펫',
    followerValue: getAdjustedFollowerValue('instagram', '펫', 300), // 기본값
    premium: 1.2,
    description: '반려동물, 펫 관련',
    benchmarks: {
      high: { followers: 100000, value: 5000000 },  // 환산 적용
      medium: { followers: 10000, value: 500000 },
      low: { followers: 1000, value: 50000 }
    }
  },
  '기타': {
    name: '기타',
    followerValue: getAdjustedFollowerValue('instagram', '기타', 300), // YouTube 기타 300원
    premium: 1.0,
    description: '기타 카테고리',
    benchmarks: {
      high: { followers: 100000, value: 5000000 },  // 환산 적용
      medium: { followers: 10000, value: 500000 },
      low: { followers: 1000, value: 50000 }
    }
  }
};

// TikTok 카테고리별 팔로워당 가치 (플랫폼 환산율 적용)
export const TIKTOK_CATEGORY_MULTIPLES = {
  '댄스/음악': {
    name: '댄스/음악',
    followerValue: getAdjustedFollowerValue('tiktok', '댄스/음악', 280), // YouTube 엔터 280원
    premium: 1.2,
    description: '댄스, 음악, 챌린지',
    benchmarks: {
      high: { followers: 100000, value: 12000000 },
      medium: { followers: 10000, value: 1200000 },
      low: { followers: 1000, value: 120000 }
    }
  },
  '코미디': {
    name: '코미디',
    followerValue: getAdjustedFollowerValue('tiktok', '코미디', 280),
    premium: 1.1,
    description: '코미디, 개그, 유머',
    benchmarks: {
      high: { followers: 100000, value: 12100000 },
      medium: { followers: 10000, value: 1210000 },
      low: { followers: 1000, value: 121000 }
    }
  },
  '교육': {
    name: '교육',
    followerValue: getAdjustedFollowerValue('tiktok', '교육', 450), // YouTube 교육 450원
    premium: 1.4,
    description: '교육, 정보, 지식',
    benchmarks: {
      high: { followers: 100000, value: 25200000 },
      medium: { followers: 10000, value: 2520000 },
      low: { followers: 1000, value: 252000 }
    }
  },
  '요리': {
    name: '요리',
    followerValue: getAdjustedFollowerValue('tiktok', '요리', 360), // YouTube 요리 360원
    premium: 1.1,
    description: '요리, 레시피, 먹방',
    benchmarks: {
      high: { followers: 100000, value: 15840000 },
      medium: { followers: 10000, value: 1584000 },
      low: { followers: 1000, value: 158400 }
    }
  },
  '뷰티': {
    name: '뷰티',
    followerValue: getAdjustedFollowerValue('tiktok', '뷰티', 320), // YouTube 뷰티 320원
    premium: 1.3,
    description: '뷰티, 메이크업, 스킨케어',
    benchmarks: {
      high: { followers: 100000, value: 16640000 },
      medium: { followers: 10000, value: 1664000 },
      low: { followers: 1000, value: 166400 }
    }
  },
  '게임': {
    name: '게임',
    followerValue: getAdjustedFollowerValue('tiktok', '게임', 250), // YouTube 게임 250원
    premium: 1.1,
    description: '게임, 게임 플레이',
    benchmarks: {
      high: { followers: 100000, value: 11000000 },
      medium: { followers: 10000, value: 1100000 },
      low: { followers: 1000, value: 110000 }
    }
  },
  '펫': {
    name: '펫',
    followerValue: getAdjustedFollowerValue('tiktok', '펫', 300),
    premium: 1.2,
    description: '반려동물, 펫 관련',
    benchmarks: {
      high: { followers: 100000, value: 14400000 },
      medium: { followers: 10000, value: 1440000 },
      low: { followers: 1000, value: 144000 }
    }
  },
  '일상': {
    name: '일상',
    followerValue: getAdjustedFollowerValue('tiktok', '일상', 420), // YouTube 일상 420원
    premium: 1.0,
    description: '일상, 라이프스타일',
    benchmarks: {
      high: { followers: 100000, value: 16800000 },
      medium: { followers: 10000, value: 1680000 },
      low: { followers: 1000, value: 168000 }
    }
  },
  '기타': {
    name: '기타',
    followerValue: getAdjustedFollowerValue('tiktok', '기타', 300), // YouTube 기타 300원
    premium: 1.0,
    description: '기타 카테고리',
    benchmarks: {
      high: { followers: 100000, value: 12000000 },
      medium: { followers: 10000, value: 1200000 },
      low: { followers: 1000, value: 120000 }
    }
  }
};

// 카테고리별 구독자 가치 조회 함수
export function getCategorySubscriberValue(
  platform: 'youtube' | 'instagram' | 'tiktok',
  category: string
): {
  value: number;
  premium: number;
  name: string;
  description: string;
} | null {
  let categoryData: any;
  
  switch (platform) {
    case 'youtube':
      categoryData = YOUTUBE_CATEGORY_MULTIPLES[category as keyof typeof YOUTUBE_CATEGORY_MULTIPLES];
      return categoryData ? {
        value: categoryData.subscriberValue,
        premium: categoryData.premium,
        name: categoryData.name,
        description: categoryData.description
      } : null;
      
    case 'instagram':
      categoryData = INSTAGRAM_CATEGORY_MULTIPLES[category as keyof typeof INSTAGRAM_CATEGORY_MULTIPLES];
      return categoryData ? {
        value: categoryData.followerValue,
        premium: categoryData.premium,
        name: categoryData.name,
        description: categoryData.description
      } : null;
      
    case 'tiktok':
      categoryData = TIKTOK_CATEGORY_MULTIPLES[category as keyof typeof TIKTOK_CATEGORY_MULTIPLES];
      return categoryData ? {
        value: categoryData.followerValue,
        premium: categoryData.premium,
        name: categoryData.name,
        description: categoryData.description
      } : null;
      
    default:
      return null;
  }
}

// 구독자 가치 계산 함수
export function calculateSubscriberValue(
  platform: 'youtube' | 'instagram' | 'tiktok',
  subscribers: number,
  category: string,
  ageMultiplier: number = 1.0
): {
  baseValue: number;
  adjustedValue: number;
  categoryInfo: any;
  formula: string;
} {
  const categoryInfo = getCategorySubscriberValue(platform, category);
  
  if (!categoryInfo) {
    return {
      baseValue: 0,
      adjustedValue: 0,
      categoryInfo: null,
      formula: '카테고리 정보 없음'
    };
  }
  
  const baseValue = subscribers * categoryInfo.value;
  const adjustedValue = Math.round(baseValue * ageMultiplier);
  
  return {
    baseValue,
    adjustedValue,
    categoryInfo,
    formula: `${subscribers.toLocaleString()}명 × ${categoryInfo.value}원 × ${ageMultiplier} = ${adjustedValue.toLocaleString()}원`
  };
}

// 동적으로 팔로워 가치 계산하는 헬퍼 함수
export function calculateDynamicFollowerValue(
  platform: 'youtube' | 'instagram' | 'tiktok',
  category: string,
  subscribers: number
): number {
  // 기본값 가져오기
  let baseValue = 300; // 기본값
  
  if (platform === 'youtube') {
    const categoryData = YOUTUBE_CATEGORY_MULTIPLES[category as keyof typeof YOUTUBE_CATEGORY_MULTIPLES];
    baseValue = categoryData?.subscriberValue || 300;
  } else {
    // YouTube 기준값에서 환산
    const youtubeEquivalent = YOUTUBE_CATEGORY_MULTIPLES[category as keyof typeof YOUTUBE_CATEGORY_MULTIPLES] || 
                             YOUTUBE_CATEGORY_MULTIPLES['기타'];
    baseValue = youtubeEquivalent?.subscriberValue || 300;
  }
  
  // 플랫폼별 환산 적용
  return getAdjustedFollowerValue(platform, category, baseValue);
}

// 플랫폼별 상위 카테고리 추천
export function getTopCategoriesByPlatform(platform: 'youtube' | 'instagram' | 'tiktok'): string[] {
  switch (platform) {
    case 'youtube':
      return ['금융/경제', '일상/브이로그', '교육/강의', '키즈', '요리/먹방'];
    case 'instagram':
      return ['뷰티', '라이프스타일', '패션', '피트니스', '펫'];
    case 'tiktok':
      return ['교육', '일상', '뷰티', '펫', '요리'];
    default:
      return [];
  }
}