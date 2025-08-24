import { supabase } from './supabase-client';
import { FlippaTransaction, BusinessTypeMapping, BusinessStats, ValuationResult } from './supabase-types';
import { CURRENCY, MARKET_ADJUSTMENT, MULTIPLE_LIMITS, ABSOLUTE_LIMITS } from './constants';
import { getBusinessAgeMultiplier, validateAgeMultipliers } from './business-age-multipliers';
import { getBusinessMultiples, validateMultiples } from './business-multiples';

/**
 * 단순화된 비즈니스 가치 계산
 * Profit이 있으면 Profit Multiple, 없으면 Revenue Multiple 사용
 */
export async function calculateRealBusinessValue(
  businessType: string,
  monthlyRevenueManwon: number,  // 만원 단위
  monthlyProfitManwon: number,   // 만원 단위
  subscribers?: number,
  businessAge?: string
): Promise<ValuationResult> {
  
  console.log('====== 간단한 가치 계산 ======');
  console.log('입력값:', {
    businessType,
    월매출: `${monthlyRevenueManwon}만원`,
    월수익: `${monthlyProfitManwon}만원`,
    운영기간: businessAge || '1-2'
  });
  
  // 0 체크
  if (!monthlyRevenueManwon || monthlyRevenueManwon <= 0) {
    return { value: 0, percentile: 0 } as ValuationResult;
  }
  
  // Multiple 가져오기
  const multiples = getBusinessMultiples(businessType);
  console.log('Multiple:', {
    revenue: multiples.revenue.toFixed(3),
    profit: multiples.profit.toFixed(3)
  });
  
  // 연간 금액 (만원 단위 유지!)
  const annualRevenueManwon = monthlyRevenueManwon * 12;
  const annualProfitManwon = monthlyProfitManwon * 12;
  
  let baseValueManwon = 0;  // 만원 단위
  let method = '';
  
  // 간단한 로직: Profit이 있으면 Profit 기준, 없으면 Revenue 기준
  if (monthlyProfitManwon > 0) {
    // Profit 기준 계산
    baseValueManwon = annualProfitManwon * multiples.profit;
    method = 'Profit Multiple';
    console.log(`Profit 기준: ${annualProfitManwon}만원 × ${multiples.profit.toFixed(3)} = ${baseValueManwon.toFixed(0)}만원`);
  } else {
    // Revenue 기준 계산
    baseValueManwon = annualRevenueManwon * multiples.revenue;
    method = 'Revenue Multiple';
    console.log(`Revenue 기준: ${annualRevenueManwon}만원 × ${multiples.revenue.toFixed(3)} = ${baseValueManwon.toFixed(0)}만원`);
  }
  
  // 운영 기간 프리미엄 적용  
  const ageMultiplier = getSimpleAgeMultiplier(businessType, businessAge || '1-2');
  baseValueManwon = baseValueManwon * ageMultiplier;
  console.log(`운영기간 적용: × ${ageMultiplier} = ${baseValueManwon.toFixed(0)}만원`);
  
  // 원 단위로 변환 (마지막에만!)
  let finalValueKRW = baseValueManwon * 10000;
  
  // 상한선 체크 (월매출의 100배 이하)
  const maxValueKRW = monthlyRevenueManwon * 100 * 10000;
  if (finalValueKRW > maxValueKRW) {
    console.log(`⚠️ 상한선 적용: ${(maxValueKRW / 100000000).toFixed(1)}억원`);
    finalValueKRW = maxValueKRW;
  }
  
  console.log(`====== 최종: ${(finalValueKRW / 100000000).toFixed(1)}억원 ======`);
  
  return {
    value: Math.round(finalValueKRW),
    percentile: calculateSimplePercentile(finalValueKRW)
  } as ValuationResult;
    
}

// 간단한 운영기간 배수
function getSimpleAgeMultiplier(businessType: string, age: string): number {
  // 기본값
  const defaultMultipliers: Record<string, number> = {
    '0-6': 0.9,
    '6-12': 0.95,
    '1-2': 1.0,
    '2-3': 1.1,
    '3+': 1.2
  };
  
  return defaultMultipliers[age] || 1.0;
}

// 간단한 백분위
function calculateSimplePercentile(valueKRW: number): number {
  const valueOk = valueKRW / 100000000; // 억원 단위
  
  if (valueOk < 0.5) return 20;   // 5천만원 미만
  if (valueOk < 1) return 40;     // 1억원 미만
  if (valueOk < 3) return 60;     // 3억원 미만
  if (valueOk < 10) return 80;    // 10억원 미만
  return 90;                       // 10억원 이상
}

/**
 * 극도로 보수적인 통계 계산
 */
function calculateUltraConservativeStats(transactions: FlippaTransaction[]): BusinessStats {
  // 극단값 제거
  const validTransactions = transactions.filter(t => 
    t.price > 100 && t.price < 10000000 && // $100 ~ $10M
    t.revenue_multiple > 0 && t.revenue_multiple < 5 && // 0 ~ 5x
    t.profit_multiple > 0 && t.profit_multiple < 10 // 0 ~ 10x
  );
  
  if (validTransactions.length === 0) {
    return getDefaultStats('other');
  }
  
  const pricesKRW = validTransactions.map(t => t.price * CURRENCY.USD_TO_KRW);
  const revenueMultiples = validTransactions.map(t => t.revenue_multiple);
  const profitMultiples = validTransactions.map(t => t.profit_multiple);
  
  const getMedian = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  
  return {
    business_type: validTransactions[0]?.business_type || 'unknown',
    transaction_count: validTransactions.length,
    avg_price: pricesKRW.reduce((a, b) => a + b, 0) / pricesKRW.length,
    median_price: getMedian(pricesKRW),
    avg_revenue_multiple: Math.min(getMedian(revenueMultiples), 1.0), // 최대 1.0x
    avg_profit_multiple: Math.min(getMedian(profitMultiples), 2.0),  // 최대 2.0x
    min_price: Math.min(...pricesKRW),
    max_price: Math.max(...pricesKRW),
    percentile_25: pricesKRW[Math.floor(pricesKRW.length * 0.25)] || 0,
    percentile_75: pricesKRW[Math.floor(pricesKRW.length * 0.75)] || 0,
    percentile_90: pricesKRW[Math.floor(pricesKRW.length * 0.90)] || 0
  };
}

/**
 * 기본 통계 (매우 보수적)
 */
function getDefaultStats(businessType: string): BusinessStats {
  return {
    business_type: businessType,
    transaction_count: 0,
    avg_price: 0,
    median_price: 0,
    avg_revenue_multiple: 0.5,  // 매우 낮음
    avg_profit_multiple: 1.5,   // 매우 낮음
    min_price: 0,
    max_price: 0,
    percentile_25: 0,
    percentile_75: 0,
    percentile_90: 0
  };
}

/**
 * 결과 생성
 */
function createResult(
  value: number,
  stats: BusinessStats,
  dataCount: number,
  usedMethod: 'revenue' | 'profit' | 'fallback'
): ValuationResult {
  const percentile = Math.min(50 + (value / 10000000), 95); // 간단한 계산
  
  return {
    value: Math.round(value),
    percentile,
    ranking: {
      nationalRank: Math.round(5553 * (100 - percentile) / 100),
      industryRank: Math.round(1000 * (100 - percentile) / 100),
      totalUsers: 5553,
      industryTotal: 1000,
      percentile
    },
    statistics: stats,
    similarTransactions: [],
    confidence: dataCount >= 100 ? 'high' : dataCount >= 30 ? 'medium' : 'low',
    dataCount,
    usedMethod
  };
}


/**
 * 구독자 배수 (작게)
 */
function getSubscriberMultiplier(subscribers: number): number {
  if (subscribers >= 1000000) return 1.1;   // 10% 프리미엄
  if (subscribers >= 100000) return 1.07;   // 7% 프리미엄
  if (subscribers >= 10000) return 1.05;    // 5% 프리미엄
  return 1.0;
}

/**
 * 0원 처리
 */
function getZeroValue(): ValuationResult {
  return {
    value: 0,
    percentile: 0,
    ranking: {
      nationalRank: 5553,
      industryRank: 1000,
      totalUsers: 5553,
      industryTotal: 1000,
      percentile: 0
    },
    statistics: null,
    similarTransactions: [],
    confidence: 'low',
    dataCount: 0,
    usedMethod: 'fallback'
  };
}

/**
 * 폴백 계산 (극도로 보수적)
 */
function getFallbackValueKorea(
  businessType: string,
  monthlyRevenueManwon: number,
  monthlyProfitManwon: number,
  businessAge?: string
): ValuationResult {
  console.log('⚠️ 폴백 모드 (극도로 보수적)');
  
  if (!monthlyRevenueManwon || monthlyRevenueManwon <= 0) {
    return getZeroValue();
  }
  
  // 극도로 보수적인 Multiple
  const ultraConservativeMultiples: Record<string, { revenue: number; profit: number }> = {
    youtube: { revenue: 0.5, profit: 1.5 },
    instagram: { revenue: 0.4, profit: 1.3 },
    tiktok: { revenue: 0.3, profit: 1.2 },
    blog: { revenue: 0.3, profit: 1.0 },
    ecommerce: { revenue: 0.4, profit: 1.2 },
    saas: { revenue: 0.6, profit: 1.8 },
    website: { revenue: 0.3, profit: 1.0 }
  };
  
  const multiple = ultraConservativeMultiples[businessType] || { revenue: 0.3, profit: 1.0 };
  const annualRevenueKRW = monthlyRevenueManwon * 12 * CURRENCY.KRW_TO_WON;
  const annualProfitKRW = monthlyProfitManwon * 12 * CURRENCY.KRW_TO_WON;
  
  let value = 0;
  if (annualProfitKRW > 0) {
    value = annualProfitKRW * multiple.profit;
  } else {
    value = annualRevenueKRW * multiple.revenue;
  }
  
  // 한국 시장 조정 (1%)
  value = value * 0.01;
  
  // 사업 연령 (실제 데이터 기반)
  const ageData = getBusinessAgeMultiplier(businessType, businessAge || 'established');
  value *= ageData.multiplier;
  
  // 절대 상한선
  const maxValue = monthlyRevenueManwon * 30000; // 월매출 × 3만원
  value = Math.min(value, maxValue);
  
  console.log('폴백 계산:', (value / 10000).toFixed(0) + '만원');
  
  return createResult(value, getDefaultStats(businessType), 0, 'fallback');
}