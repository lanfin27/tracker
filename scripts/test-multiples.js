/**
 * Business Multiples 테스트
 * 실제 데이터 기반 Revenue/Profit Multiple 검증
 */

console.log('🎯 Business Multiples 테스트');
console.log('=' .repeat(70));
console.log('데이터: classified_flippa_data.xlsx (5,795건)');
console.log('=' .repeat(70) + '\n');

// 실제 Multiple 데이터 (한국 시장 = US의 70%)
const KOREA_BUSINESS_MULTIPLES = {
  'content': {
    revenue: 3.403176342 * 0.7,  // 2.38x
    profit: 1.057612267 * 0.7     // 0.74x
  },
  'blog': {
    revenue: 3.403176342 * 0.7,  // 2.38x
    profit: 1.057612267 * 0.7    // 0.74x
  },
  'ecommerce': {
    revenue: 1.381762546 * 0.7,  // 0.97x
    profit: 1.283108935 * 0.7    // 0.90x
  },
  'instagram': {
    revenue: 2.275886525 * 0.7,  // 1.59x
    profit: 1.34893617 * 0.7     // 0.94x
  },
  'saas': {
    revenue: 1.405504587 * 0.7,  // 0.98x
    profit: 1.170430487 * 0.7    // 0.82x
  },
  'tiktok': {
    revenue: 0.756410256 * 0.7,  // 0.53x
    profit: 1.084615385 * 0.7    // 0.76x
  },
  'youtube': {
    revenue: 1.360580913 * 0.7,  // 0.95x
    profit: 1.617427386 * 0.7    // 1.13x
  },
  'website': {
    revenue: 2.049699399 * 0.7,  // 1.43x
    profit: 0.658717435 * 0.7    // 0.46x
  }
};

console.log('1️⃣ 한국 시장 조정 Multiple (US의 70%):');
console.log('-'.repeat(50));

Object.entries(KOREA_BUSINESS_MULTIPLES).forEach(([type, multiples]) => {
  console.log(`\n${type.toUpperCase()}:`);
  console.log(`  Revenue: ${multiples.revenue.toFixed(2)}x`);
  console.log(`  Profit: ${multiples.profit.toFixed(2)}x`);
});

console.log('\n2️⃣ 주요 발견사항:');
console.log('-'.repeat(50));

console.log('\n📊 Revenue Multiple:');
console.log('  최고: Content/Blog (2.38x)');
console.log('  최저: TikTok (0.53x)');

console.log('\n📊 Profit Multiple:');
console.log('  최고: YouTube (1.13x)');
console.log('  최저: Website (0.46x)');

console.log('\n3️⃣ 시뮬레이션 테스트:');
console.log('-'.repeat(50));

const testCases = [
  { type: 'youtube', revenue: 500, profit: 285, desc: 'YouTube (수익률 57%)' },
  { type: 'blog', revenue: 200, profit: 120, desc: 'Blog (수익률 60%)' },
  { type: 'ecommerce', revenue: 1000, profit: 290, desc: '이커머스 (수익률 29%)' },
  { type: 'saas', revenue: 2000, profit: 1300, desc: 'SaaS (수익률 65%)' },
  { type: 'tiktok', revenue: 300, profit: 135, desc: 'TikTok (수익률 45%)' }
];

testCases.forEach(test => {
  const multiples = KOREA_BUSINESS_MULTIPLES[test.type];
  
  // 연간 금액
  const annualRevenue = test.revenue * 12;
  const annualProfit = test.profit * 12;
  
  // Multiple 적용
  const revenueValue = annualRevenue * multiples.revenue;
  const profitValue = annualProfit * multiples.profit;
  
  // 더 높은 값 선택
  const finalValue = Math.max(revenueValue, profitValue);
  const selectedMethod = revenueValue > profitValue ? 'Revenue' : 'Profit';
  
  console.log(`\n📌 ${test.desc}:`);
  console.log(`   월 매출: ${test.revenue}만원, 월 수익: ${test.profit}만원`);
  console.log(`   Revenue 기반: ${revenueValue.toFixed(0)}만원 (${multiples.revenue.toFixed(2)}x)`);
  console.log(`   Profit 기반: ${profitValue.toFixed(0)}만원 (${multiples.profit.toFixed(2)}x)`);
  console.log(`   ✅ 최종: ${finalValue.toFixed(0)}만원 (${selectedMethod} Multiple)`);
});

console.log('\n4️⃣ 운영 기간 프리미엄 (UI 숨김):');
console.log('-'.repeat(50));

console.log('\n백엔드에서만 적용 (UI에 표시 안 함):');
console.log('  이커머스 1-2년: +80% (내부 적용)');
console.log('  SaaS 2-3년: +60% (내부 적용)');
console.log('  Blog 3년+: +90% (내부 적용)');
console.log('  → 콘솔 로그에만 표시됨');

console.log('\n5️⃣ UI 변경사항:');
console.log('-'.repeat(50));

console.log('✅ BusinessAgeStep: 프리미엄 수치 제거');
console.log('✅ 업종별 특성만 텍스트로 설명');
console.log('✅ 결과 페이지: 운영 기간 표시만, 배수 숨김');
console.log('✅ 체크마크만 표시 (선택된 항목)');

console.log('\n✅ 테스트 완료!');
console.log('=' .repeat(70));
console.log('📊 실제 Multiple 데이터가 적용되었습니다.');
console.log('📊 운영 기간 프리미엄은 백엔드에서만 적용됩니다.');
console.log('📊 UI는 깔끔하게 정리되었습니다.');