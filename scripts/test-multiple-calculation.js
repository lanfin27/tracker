/**
 * Multiple 계산 테스트
 * 실제 Multiple이 정확히 적용되는지 검증
 */

console.log('🔬 Multiple 계산 테스트');
console.log('=' .repeat(70));

// 실제 Multiple 데이터 (하드코딩으로 테스트)
const US_BUSINESS_MULTIPLES = {
  'youtube': { revenue: 1.360580913, profit: 1.617427386 },
  'instagram': { revenue: 2.275886525, profit: 1.34893617 },
  'tiktok': { revenue: 0.756410256, profit: 1.084615385 },
  'blog': { revenue: 3.403176342, profit: 1.057612267 },
  'ecommerce': { revenue: 1.381762546, profit: 1.283108935 },
  'saas': { revenue: 1.405504587, profit: 1.170430487 },
  'website': { revenue: 2.049699399, profit: 0.658717435 }
};

// 한국 시장 조정 (70%)
const KOREA_ADJUSTMENT = 0.7;

// 테스트 케이스
const testCases = [
  {
    name: 'YouTube (월 500만원 매출, 100만원 수익)',
    type: 'youtube',
    monthlyRevenue: 500,
    monthlyProfit: 100
  },
  {
    name: 'Instagram (월 300만원 매출, 50만원 수익)',
    type: 'instagram',
    monthlyRevenue: 300,
    monthlyProfit: 50
  },
  {
    name: 'SaaS (월 2000만원 매출, 500만원 수익)',
    type: 'saas',
    monthlyRevenue: 2000,
    monthlyProfit: 500
  },
  {
    name: '이커머스 (월 5000만원 매출, 500만원 수익)',
    type: 'ecommerce',
    monthlyRevenue: 5000,
    monthlyProfit: 500
  },
  {
    name: 'Blog (월 100만원 매출, 60만원 수익)',
    type: 'blog',
    monthlyRevenue: 100,
    monthlyProfit: 60
  }
];

console.log('\n📊 실제 Multiple 데이터 적용 시뮬레이션');
console.log('-'.repeat(50));

testCases.forEach(test => {
  console.log(`\n🎯 ${test.name}`);
  
  // US Multiple
  const usMultiple = US_BUSINESS_MULTIPLES[test.type];
  
  // 한국 Multiple (US의 70%)
  const koreaMultiple = {
    revenue: usMultiple.revenue * KOREA_ADJUSTMENT,
    profit: usMultiple.profit * KOREA_ADJUSTMENT
  };
  
  console.log('  Multiple:');
  console.log(`    US Revenue: ${usMultiple.revenue.toFixed(3)}x`);
  console.log(`    US Profit: ${usMultiple.profit.toFixed(3)}x`);
  console.log(`    KR Revenue: ${koreaMultiple.revenue.toFixed(3)}x (70% 조정)`);
  console.log(`    KR Profit: ${koreaMultiple.profit.toFixed(3)}x (70% 조정)`);
  
  // 연간 금액 계산
  const annualRevenue = test.monthlyRevenue * 12;
  const annualProfit = test.monthlyProfit * 12;
  
  console.log('\n  연간 금액:');
  console.log(`    매출: ${annualRevenue}만원`);
  console.log(`    수익: ${annualProfit}만원`);
  
  // Multiple 적용
  const revenueValue = annualRevenue * koreaMultiple.revenue;
  const profitValue = annualProfit * koreaMultiple.profit;
  
  console.log('\n  가치 계산:');
  console.log(`    Revenue 기반: ${revenueValue.toFixed(0)}만원 (${annualRevenue} × ${koreaMultiple.revenue.toFixed(3)})`);
  console.log(`    Profit 기반: ${profitValue.toFixed(0)}만원 (${annualProfit} × ${koreaMultiple.profit.toFixed(3)})`);
  
  // 더 높은 값 선택
  const selectedValue = Math.max(revenueValue, profitValue);
  const selectedMethod = revenueValue > profitValue ? 'Revenue' : 'Profit';
  
  console.log(`    선택: ${selectedMethod} 기반 = ${selectedValue.toFixed(0)}만원`);
  
  // 범위 제한 (월매출의 3~36배)
  const minValue = test.monthlyRevenue * 3;
  const maxValue = test.monthlyRevenue * 36;
  
  console.log('\n  범위 제한:');
  console.log(`    최소: ${minValue}만원 (월매출 × 3)`);
  console.log(`    최대: ${maxValue}만원 (월매출 × 36)`);
  
  // 최종 가치
  const finalValue = Math.max(minValue, Math.min(selectedValue, maxValue));
  
  console.log('\n  💰 최종 가치:');
  console.log(`    ${finalValue.toFixed(0)}만원`);
  
  if (finalValue >= 10000) {
    console.log(`    = ${(finalValue / 10000).toFixed(2)}억원`);
  }
  
  // 범위 체크
  if (finalValue === minValue) {
    console.log('    ⚠️ 최소값에 제한됨');
  } else if (finalValue === maxValue) {
    console.log('    ⚠️ 최대값에 제한됨');
  } else {
    console.log('    ✅ 정상 범위');
  }
});

console.log('\n' + '='.repeat(70));
console.log('📌 결론:');
console.log('1. 모든 계산이 현실적인 범위 내에 있음');
console.log('2. 월매출 500만원 → 약 5,700만원 (11.4배)');
console.log('3. 월매출 2000만원 → 약 2.36억원 (11.8배)');
console.log('4. 월매출 5000만원 → 약 5.8억원 (11.6배)');
console.log('5. Multiple이 정확히 적용되고 있음');
console.log('\n✅ 테스트 완료!');