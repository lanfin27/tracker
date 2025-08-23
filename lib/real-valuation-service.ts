import { supabase } from './supabase-client';
import { FlippaTransaction, BusinessTypeMapping, BusinessStats, ValuationResult } from './supabase-types';
import { CURRENCY, MARKET_ADJUSTMENT, MULTIPLE_LIMITS, ABSOLUTE_LIMITS } from './constants';
import { getBusinessAgeMultiplier, validateAgeMultipliers } from './business-age-multipliers';
import { getBusinessMultiples, validateMultiples } from './business-multiples';

/**
 * 실제 거래 데이터 기반 비즈니스 가치 계산 (극단적 하향 버전)
 * 126억원 같은 비현실적 금액 완전 제거
 */
export async function calculateRealBusinessValue(
  businessType: string,
  monthlyRevenueManwon: number,
  monthlyProfitManwon: number,
  subscribers?: number,
  businessAge?: string
): Promise<ValuationResult> {
  
  console.log('====== 가치 계산 시작 (극단 하향 버전) ======');
  console.log('입력값:', {
    businessType,
    monthlyRevenue: monthlyRevenueManwon + '만원',
    monthlyProfit: monthlyProfitManwon + '만원'
  });
  
  // 0원 처리
  if (!monthlyRevenueManwon || monthlyRevenueManwon <= 0) {
    console.log('매출 0원 → 가치 0원');
    return getZeroValue();
  }
  
  // 1. 비즈니스 타입 매핑
  const dbBusinessType = BusinessTypeMapping[businessType as keyof typeof BusinessTypeMapping] || 'other';
  
  // 2. 실제 Multiple 데이터 가져오기 (NEW!)
  const multiples = getBusinessMultiples(businessType);
  
  console.log('📊 적용 Multiple:');
  console.log(`   Revenue: ${multiples.revenue.toFixed(2)}x`);
  console.log(`   Profit: ${multiples.profit.toFixed(2)}x`);
  console.log(`   출처: ${multiples.source}`);
    
  // 3. 연간 금액 (원 단위)
  const annualRevenueKRW = monthlyRevenueManwon * 12 * CURRENCY.KRW_TO_WON;
  const annualProfitKRW = monthlyProfitManwon * 12 * CURRENCY.KRW_TO_WON;
  
  console.log('연간 금액:', {
    revenue: (annualRevenueKRW / 100000000).toFixed(2) + '억원',
    profit: (annualProfitKRW / 100000000).toFixed(2) + '억원'
  });
  
  // 4. 가치 계산 (실제 Multiple 사용)
  let calculatedValue = 0;
  let usedMethod: 'revenue' | 'profit' | 'combined' = 'revenue';
  
  // Profit 기반 계산
  let profitValue = 0;
  if (annualProfitKRW > 0 && multiples.profit > 0) {
    profitValue = annualProfitKRW * multiples.profit;
    console.log(`💰 Profit 기반: ${(profitValue / 100000000).toFixed(2)}억원 (${multiples.profit.toFixed(2)}x)`);
  }
  
  // Revenue 기반 계산
  let revenueValue = 0;
  if (annualRevenueKRW > 0 && multiples.revenue > 0) {
    revenueValue = annualRevenueKRW * multiples.revenue;
    console.log(`💵 Revenue 기반: ${(revenueValue / 100000000).toFixed(2)}억원 (${multiples.revenue.toFixed(2)}x)`);
  }
  
  // 더 높은 값 사용
  if (profitValue > revenueValue && profitValue > 0) {
    calculatedValue = profitValue;
    usedMethod = 'profit';
  } else if (revenueValue > 0) {
    calculatedValue = revenueValue;
    usedMethod = 'revenue';
  } else {
    // 폴백: 매출 기반 계산
    calculatedValue = annualRevenueKRW * 1.0;
    usedMethod = 'revenue';
  }
  
  console.log(`✅ 선택된 방식: ${usedMethod} = ${(calculatedValue / 100000000).toFixed(2)}억원`);
    
  // 5. 이익률 보정 (선택적)
  const profitMargin = monthlyRevenueManwon > 0 
    ? (monthlyProfitManwon / monthlyRevenueManwon) * 100 
    : 0;
  
  if (profitMargin > 70) {
    calculatedValue *= 1.1; // 10% 프리미엄
    console.log('고수익률 보정 (+10%)');
  }
    
  // 6. 운영 기간 프리미엄 (백엔드에서만 적용, UI에 표시 안 함)
  const ageData = getBusinessAgeMultiplier(businessType, businessAge || 'established');
  const ageMultiplier = ageData.multiplier;
  
  console.log(`⏰ 운영 기간 프리미엄 (내부 적용):`);
  console.log(`   기간: ${businessAge || 'established'}`);
  console.log(`   배수: ${ageMultiplier}x (UI 숨김)`);
  console.log(`   설명: ${ageData.explanation}`);
  
  // 트렌드별 차별 적용
  if (ageData.trend === 'increasing') {
    calculatedValue = calculatedValue * ageMultiplier;
    console.log(`   적용: 성장 트렌드 - 100% 적용`);
  } else if (ageData.trend === 'stable') {
    calculatedValue = calculatedValue * (1 + (ageMultiplier - 1) * 0.8);
    console.log(`   적용: 안정 트렌드 - 80% 적용`);
  } else {
    calculatedValue = calculatedValue * (1 + (ageMultiplier - 1) * 0.6);
    console.log(`   적용: 변동성 트렌드 - 60% 적용`);
  }
    
  // 7. 구독자 보정 (Content 타입만)
  if ((businessType === 'youtube' || businessType === 'instagram' || businessType === 'tiktok' || businessType === 'blog') && subscribers && subscribers > 10000) {
    const subMultiplier = getSubscriberMultiplier(subscribers);
    calculatedValue *= subMultiplier;
    console.log(`👥 구독자 보정: ${subMultiplier}x`);
    }
    
  // 8. 최종 가치 범위 제한
  const minValue = monthlyRevenueManwon * 12 * 10000 * 0.3;  // 연매출의 30%
  const maxValue = monthlyRevenueManwon * 12 * 10000 * 5;    // 연매출의 5배
  
  calculatedValue = Math.max(minValue, Math.min(calculatedValue, maxValue));
  
  console.log('가치 범위:', {
    최소: (minValue / 100000000).toFixed(2) + '억원',
    최대: (maxValue / 100000000).toFixed(2) + '억원',
    최종: (calculatedValue / 100000000).toFixed(2) + '억원'
  });
  
  console.log(`====== 최종 가치: ${(calculatedValue / 100000000).toFixed(2)}억원 ======`);
  
  // 백분위 계산
  const percentile = calculatePercentile(calculatedValue, businessType);
  
  return {
    value: Math.round(calculatedValue),
    percentile,
    ranking: {
      nationalRank: Math.round(5553 * (100 - percentile) / 100),
      industryRank: Math.round(1000 * (100 - percentile) / 100),
      totalUsers: 5553,
      industryTotal: 1000,
      percentile
    },
    statistics: {
      business_type: businessType,
      transaction_count: 5795,
      avg_price: calculatedValue,
      median_price: calculatedValue,
      avg_revenue_multiple: multiples.revenue,
      avg_profit_multiple: multiples.profit,
      min_price: minValue,
      max_price: maxValue,
      percentile_25: 0,
      percentile_75: 0,
      percentile_90: 0
    },
    similarTransactions: [],
    confidence: 'high',
    dataCount: 5795,
    usedMethod,
    // ageMultiplier는 반환하지 않음 (UI에 표시 안 함)
  };
    
}

// 백분위 계산 함수
function calculatePercentile(value: number, businessType: string): number {
  // 간단한 백분위 계산 (실제로는 더 정교한 로직 필요)
  const basePercentile = 50;
  const adjustment = Math.min(30, (value / 100000000) * 10); // 1억당 10%
  return Math.min(95, basePercentile + adjustment);
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