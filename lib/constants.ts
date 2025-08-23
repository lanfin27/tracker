// 화폐 변환 상수
export const CURRENCY = {
  USD_TO_KRW: 1300, // 1 USD = 1,300 KRW
  KRW_TO_WON: 10000, // 만원 단위 변환
};

// 한국 시장 조정 - 극단적으로 보수적
export const MARKET_ADJUSTMENT = {
  // 한국 시장은 미국의 1-3% 수준 (기존 10%에서 대폭 하향)
  KOREA_FACTOR: 0.01, // 1%로 극단 하향!
  
  // 카테고리별 - 모두 극소값
  CATEGORY_FACTORS: {
    content: 0.008,    // 0.8%
    ecommerce: 0.012,  // 1.2%
    saas: 0.007,       // 0.7%
    other: 0.010       // 1.0%
  }
};

// Multiple 극단 제한
export const MULTIPLE_LIMITS = {
  REVENUE: {
    MIN: 0.3,
    MAX: 1.0,    // 최대 1배 (기존 2배에서 하향)
    DEFAULT: 0.5
  },
  PROFIT: {
    MIN: 1.0,
    MAX: 2.0,    // 최대 2배 (기존 4배에서 하향)
    DEFAULT: 1.5
  }
};

// 절대 상한선 (월 매출 기준)
export const ABSOLUTE_LIMITS = {
  PER_MONTHLY_REVENUE: 40000, // 월매출 × 4만원 (기존 60만원에서 하향)
  MAX_VALUE: 500000000        // 절대 최대 5억원
};