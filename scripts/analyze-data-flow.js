/**
 * 996억원 문제 원인 분석
 * 전체 데이터 흐름 추적
 */

console.log('🔍 데이터 흐름 분석 - 996억원 문제 원인 찾기');
console.log('=' .repeat(70));

// 시뮬레이션 데이터
const userInput = {
  revenue: 876,  // 사용자가 입력한 876만원
  profit: 100    // 사용자가 입력한 100만원
};

console.log('\n📝 1단계: 사용자 입력');
console.log(`  월 매출: ${userInput.revenue}만원`);
console.log(`  월 수익: ${userInput.profit}만원`);

// =================================================
// valuation/page.tsx - RevenueStep (라인 269)
// =================================================
console.log('\n📦 2단계: RevenueStep에서 저장 (valuation/page.tsx:269)');
const savedRevenue = userInput.revenue * 10000;  // 만원 → 원
console.log(`  저장값: ${savedRevenue}원 (${userInput.revenue}만원 × 10000)`);

// =================================================
// valuation/page.tsx - ProfitStep (라인 360)
// =================================================
console.log('\n📦 3단계: ProfitStep에서 저장 (valuation/page.tsx:360)');
const savedProfit = userInput.profit * 10000;  // 만원 → 원
console.log(`  저장값: ${savedProfit}원 (${userInput.profit}만원 × 10000)`);

// =================================================
// localStorage 저장
// =================================================
console.log('\n💾 4단계: localStorage 저장');
const localStorageData = {
  monthlyRevenue: savedRevenue,  // 8,760,000원
  monthlyProfit: savedProfit,    // 1,000,000원
  businessType: 'ecommerce'
};
console.log('  저장된 데이터:', localStorageData);

// =================================================
// result/page.tsx - 데이터 로드 (라인 45-50)
// =================================================
console.log('\n📄 5단계: result/page.tsx에서 로드');
console.log('  localStorage에서 읽은 값:');
console.log(`    monthlyRevenue: ${localStorageData.monthlyRevenue}원`);
console.log(`    monthlyProfit: ${localStorageData.monthlyProfit}원`);

console.log('\n⚠️ 6단계: calculateRealBusinessValue 호출 (라인 45-50)');
console.log('  전달되는 파라미터:');
console.log(`    monthlyRevenue: ${localStorageData.monthlyRevenue} (원 단위 그대로!)`);
console.log(`    monthlyProfit: ${localStorageData.monthlyProfit} (원 단위 그대로!)`);

// =================================================
// real-valuation-service.ts - 계산
// =================================================
console.log('\n🔴 7단계: calculateRealBusinessValue 함수');
console.log('  함수가 기대하는 입력: 만원 단위');
console.log('  실제로 받은 입력: 원 단위');
console.log(`    monthlyRevenueManwon: ${localStorageData.monthlyRevenue} (❌ 원인데 만원으로 착각!)`);
console.log(`    monthlyProfitManwon: ${localStorageData.monthlyProfit} (❌ 원인데 만원으로 착각!)`);

// 잘못된 계산
const wrongAnnualRevenue = localStorageData.monthlyRevenue * 12;  // 8,760,000 × 12 = 105,120,000
const wrongAnnualProfit = localStorageData.monthlyProfit * 12;    // 1,000,000 × 12 = 12,000,000

console.log('\n❌ 8단계: 잘못된 연간 계산');
console.log(`  연매출(잘못): ${wrongAnnualRevenue.toLocaleString()}만원 (105,120,000만원 = 1,051.2억원!)`);
console.log(`  연수익(잘못): ${wrongAnnualProfit.toLocaleString()}만원 (12,000,000만원 = 120억원!)`);

// Multiple 적용
const profitMultiple = 0.898;  // ecommerce profit multiple
const wrongValue = wrongAnnualProfit * profitMultiple;

console.log('\n❌ 9단계: Multiple 적용');
console.log(`  ${wrongAnnualProfit}만원 × ${profitMultiple} = ${wrongValue.toLocaleString()}만원`);
console.log(`  = ${(wrongValue / 10000).toFixed(0)}억원!`);

// 원으로 변환
const wrongFinalValue = wrongValue * 10000;
console.log('\n❌ 10단계: 최종 원 단위 변환');
console.log(`  ${wrongValue}만원 × 10000 = ${(wrongFinalValue / 100000000).toFixed(0)}억원`);

console.log('\n' + '=' .repeat(70));
console.log('🎯 문제 원인 발견!');
console.log('\n1. result/page.tsx가 localStorage에서 원 단위로 저장된 값을 그대로 전달');
console.log('2. calculateRealBusinessValue는 만원 단위를 기대하지만 원 단위를 받음');
console.log('3. 8,760,000을 876만원이 아닌 8,760,000만원으로 계산');
console.log('4. 결과: 996억원 같은 비현실적 금액!');

console.log('\n✅ 해결책:');
console.log('result/page.tsx 라인 47-48 수정 필요:');
console.log('```typescript');
console.log('// 현재 (잘못됨)');
console.log('await calculateRealBusinessValue(');
console.log('  data.monthlyRevenue,  // 원 단위');
console.log('  data.monthlyProfit,   // 원 단위');
console.log(');');
console.log('');
console.log('// 수정 필요');
console.log('await calculateRealBusinessValue(');
console.log('  data.monthlyRevenue / 10000,  // 원 → 만원');
console.log('  data.monthlyProfit / 10000,   // 원 → 만원');
console.log(');');
console.log('```');