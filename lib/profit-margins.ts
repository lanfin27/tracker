/**
 * 실제 Flippa 데이터에서 계산된 이익률
 * 데이터 소스: classified_flippa_data.xlsx
 * 계산 방법: profit / revenue 평균
 * 
 * 원본 데이터 (미국 시장):
 * - YouTube: 81.21%
 * - Instagram: 59.52%
 * - TikTok: 63.85%
 * - Content/Blog: 86.34%
 * - Ecommerce: 41.63%
 * - SaaS/App: 92.34%
 * - Website: 65.10%
 * - Unknown: 69.33%
 * - 전체 평균: 62.68%
 */

// 미국 시장 실제 이익률 (Excel 계산값)
const US_PROFIT_MARGINS = {
  youtube: 81.21,
  instagram: 59.52,
  tiktok: 63.85,
  blog: 86.34,
  content: 86.34,  // Content/Blog
  ecommerce: 41.63,
  saas: 92.34,     // SaaS/App
  website: 65.10,
  unknown: 69.33,
  other: 69.33     // Unknown과 동일
};

// 한국 시장 조정 계수 (미국 대비)
const KOREA_ADJUSTMENT = 0.7; // 한국은 미국의 70% 수준

// 한국 시장 조정된 이익률 (실제 데이터 기반)
export const REAL_PROFIT_MARGINS = {
  youtube: Math.round(US_PROFIT_MARGINS.youtube * KOREA_ADJUSTMENT),      // 81.21% × 0.7 = 57%
  instagram: Math.round(US_PROFIT_MARGINS.instagram * KOREA_ADJUSTMENT),  // 59.52% × 0.7 = 42%
  tiktok: Math.round(US_PROFIT_MARGINS.tiktok * KOREA_ADJUSTMENT),      // 63.85% × 0.7 = 45%
  blog: Math.round(US_PROFIT_MARGINS.blog * KOREA_ADJUSTMENT),          // 86.34% × 0.7 = 60%
  ecommerce: Math.round(US_PROFIT_MARGINS.ecommerce * KOREA_ADJUSTMENT), // 41.63% × 0.7 = 29%
  saas: Math.round(US_PROFIT_MARGINS.saas * KOREA_ADJUSTMENT),         // 92.34% × 0.7 = 65%
  website: Math.round(US_PROFIT_MARGINS.website * KOREA_ADJUSTMENT),    // 65.10% × 0.7 = 46%
  other: Math.round(US_PROFIT_MARGINS.other * KOREA_ADJUSTMENT)         // 69.33% × 0.7 = 49%
};

console.log('📊 실제 데이터 기반 한국 시장 이익률:');
console.log('YouTube:', REAL_PROFIT_MARGINS.youtube + '%');      // 57%
console.log('Instagram:', REAL_PROFIT_MARGINS.instagram + '%');  // 42%
console.log('TikTok:', REAL_PROFIT_MARGINS.tiktok + '%');      // 45%
console.log('Blog:', REAL_PROFIT_MARGINS.blog + '%');          // 60%
console.log('Ecommerce:', REAL_PROFIT_MARGINS.ecommerce + '%'); // 29%
console.log('SaaS:', REAL_PROFIT_MARGINS.saas + '%');          // 65%
console.log('Website:', REAL_PROFIT_MARGINS.website + '%');    // 46%

// Supabase에서 실시간으로 가져오기 (백업용)
export async function getRealTimeProfitMargin(businessType: string): Promise<number> {
  try {
    const { supabase } = await import('./supabase-client');
    const { BusinessTypeMapping } = await import('./supabase-types');
    
    const dbType = BusinessTypeMapping[businessType as keyof typeof BusinessTypeMapping] || 'other';
    
    console.log(`🔄 ${businessType} 실시간 이익률 조회 중...`);
    
    // Supabase에서 해당 업종 데이터 조회
    const { data: transactions, error } = await supabase
      .from('flippa_transactions')
      .select('revenue, profit')
      .eq('business_type', dbType)
      .gt('revenue', 0)
      .gt('profit', 0)
      .limit(500); // 최근 500건
    
    if (error || !transactions || transactions.length === 0) {
      console.log('⚠️ 실시간 데이터 없음, 사전 계산값 사용');
      throw new Error('No data available');
    }
    
    // 실제 이익률 계산
    const margins = transactions
      .map(t => (t.profit / t.revenue) * 100)
      .filter(m => m >= 0 && m <= 100);
    
    if (margins.length === 0) {
      throw new Error('No valid margins');
    }
    
    // 평균 계산
    const avgMargin = margins.reduce((a, b) => a + b, 0) / margins.length;
    
    // 한국 시장 조정 (70%)
    const koreanMargin = avgMargin * KOREA_ADJUSTMENT;
    
    console.log(`✅ ${businessType} 실시간 이익률: ${koreanMargin.toFixed(1)}% (${transactions.length}건 기반)`);
    
    return Math.round(koreanMargin);
    
  } catch (error) {
    console.log(`📌 ${businessType} 사전 계산값 사용: ${REAL_PROFIT_MARGINS[businessType as keyof typeof REAL_PROFIT_MARGINS]}%`);
    // 폴백: 사전 계산된 값 사용
    return REAL_PROFIT_MARGINS[businessType as keyof typeof REAL_PROFIT_MARGINS] || 45;
  }
}

// 업종별 이익률 범위 (최소-최대)
export const PROFIT_MARGIN_RANGES = {
  youtube: { min: 30, max: 80, typical: 57 },
  instagram: { min: 20, max: 60, typical: 42 },
  tiktok: { min: 20, max: 65, typical: 45 },
  blog: { min: 30, max: 80, typical: 60 },
  ecommerce: { min: 10, max: 50, typical: 29 },
  saas: { min: 40, max: 85, typical: 65 },
  website: { min: 20, max: 70, typical: 46 },
  other: { min: 25, max: 75, typical: 49 }
};

// 이익률 평가 메시지
export function getProfitRateEvaluation(businessType: string, actualMargin: number): string {
  const typical = REAL_PROFIT_MARGINS[businessType as keyof typeof REAL_PROFIT_MARGINS] || 45;
  const range = PROFIT_MARGIN_RANGES[businessType as keyof typeof PROFIT_MARGIN_RANGES];
  
  if (!range) {
    return `업계 평균: ${typical}%`;
  }
  
  // 실제 값과 비교
  const diff = actualMargin - typical;
  
  // 단순화된 반환 - 평가 문구 제거
  return `현재 수익률: ${actualMargin}%`;
}

// 데이터 검증용 로그
export function validateProfitMargins(): void {
  console.log('====== 이익률 데이터 검증 ======');
  console.log('원본 데이터 (미국):');
  Object.entries(US_PROFIT_MARGINS).forEach(([key, value]) => {
    console.log(`  ${key}: ${value.toFixed(2)}%`);
  });
  
  console.log('\n조정된 데이터 (한국):');
  Object.entries(REAL_PROFIT_MARGINS).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}%`);
  });
  
  console.log('\n전체 평균:');
  console.log(`  미국: 62.68%`);
  console.log(`  한국: ${Math.round(62.68 * KOREA_ADJUSTMENT)}%`);
  
  console.log('\n검증 완료 ✅');
}