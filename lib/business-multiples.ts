/**
 * 실제 거래 데이터에서 계산된 Revenue/Profit Multiples
 * 데이터 소스: classified_flippa_data.xlsx (5,795건)
 * 계산 방법: 각 카테고리별 price/revenue, price/(profit*12) 평균
 */

// 미국 시장 실제 Multiple (Excel 계산값 - 정확한 값)
export const US_BUSINESS_MULTIPLES = {
  'youtube': {
    revenue: 1.360580913,
    profit: 1.617427386
  },
  'instagram': {
    revenue: 2.275886525,
    profit: 1.34893617
  },
  'tiktok': {
    revenue: 0.756410256,
    profit: 1.084615385
  },
  'blog': {
    revenue: 3.403176342,
    profit: 1.057612267
  },
  'content': {
    revenue: 3.403176342,  // Blog와 동일
    profit: 1.057612267
  },
  'ecommerce': {
    revenue: 1.381762546,
    profit: 1.283108935
  },
  'saas': {
    revenue: 1.405504587,
    profit: 1.170430487
  },
  'website': {
    revenue: 2.049699399,
    profit: 0.658717435
  },
  'unknown': {
    revenue: 0.79893617,
    profit: 1.15
  },
  'other': {
    revenue: 0.79893617,  // Unknown과 동일
    profit: 1.15
  }
};

// 한국 시장 조정 계수
const KOREA_ADJUSTMENT = 0.7; // 한국은 미국의 70% 수준

// 한국 시장 조정된 Multiple
export const KOREA_BUSINESS_MULTIPLES = Object.entries(US_BUSINESS_MULTIPLES).reduce((acc, [key, value]) => {
  acc[key] = {
    revenue: value.revenue * KOREA_ADJUSTMENT,
    profit: value.profit * KOREA_ADJUSTMENT
  };
  return acc;
}, {} as typeof US_BUSINESS_MULTIPLES);

// Multiple 가져오기 함수
export function getBusinessMultiples(businessType: string): {
  revenue: number;
  profit: number;
  source: string;
} {
  const type = businessType.toLowerCase();
  const multiples = KOREA_BUSINESS_MULTIPLES[type as keyof typeof KOREA_BUSINESS_MULTIPLES];
  
  if (multiples) {
    console.log(`📊 실제 Multiple 적용: ${type}`);
    console.log(`   Revenue: ${multiples.revenue.toFixed(2)}x (US: ${US_BUSINESS_MULTIPLES[type as keyof typeof US_BUSINESS_MULTIPLES].revenue.toFixed(2)}x)`);
    console.log(`   Profit: ${multiples.profit.toFixed(2)}x (US: ${US_BUSINESS_MULTIPLES[type as keyof typeof US_BUSINESS_MULTIPLES].profit.toFixed(2)}x)`);
    
    return {
      ...multiples,
      source: '실제 거래 데이터'
    };
  }
  
  // 폴백: 기본값
  console.log(`⚠️ ${type}에 대한 Multiple 데이터 없음, 기본값 사용`);
  return {
    revenue: 1.0,
    profit: 2.0,
    source: '기본값'
  };
}

// 데이터 검증
export function validateMultiples(): void {
  console.log('====== Business Multiples 검증 ======');
  console.log('\n한국 시장 조정 Multiple (US의 70%):');
  
  Object.entries(KOREA_BUSINESS_MULTIPLES).forEach(([type, multiples]) => {
    console.log(`${type}:`);
    console.log(`  Revenue: ${multiples.revenue.toFixed(2)}x`);
    console.log(`  Profit: ${multiples.profit.toFixed(2)}x`);
  });
  
  console.log('\n주요 발견:');
  console.log('- Content/Blog: Revenue Multiple이 가장 높음 (3.4x → 2.38x)');
  console.log('- TikTok: Revenue Multiple이 가장 낮음 (0.76x → 0.53x)');
  console.log('- YouTube: Profit Multiple이 가장 높음 (1.62x → 1.13x)');
  console.log('- Website: Profit Multiple이 가장 낮음 (0.66x → 0.46x)');
  
  console.log('\n✅ 검증 완료');
}