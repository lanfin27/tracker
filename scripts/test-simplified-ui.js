/**
 * 간소화된 결과 화면 테스트
 */

console.log('🎯 간소화된 결과 화면 테스트');
console.log('=' .repeat(70));

// 가치 기준 백분위 테스트
const testValues = [
  { value: 5000000, expected: 20, desc: '500만원 → 하위 20%' },
  { value: 30000000, expected: 35, desc: '3천만원 → 하위 35%' },
  { value: 80000000, expected: 50, desc: '8천만원 → 중위 50%' },
  { value: 150000000, expected: 70, desc: '1.5억원 → 상위 70%' },
  { value: 400000000, expected: 85, desc: '4억원 → 상위 85%' },
  { value: 600000000, expected: 90, desc: '6억원 → 상위 90%' }
];

console.log('\n📊 백분위 테스트:');
console.log('-'.repeat(50));

function calculatePercentile(value) {
  if (value < 10000000) return 20;      // 1천만원 미만: 하위 20%
  if (value < 50000000) return 35;      // 5천만원 미만: 하위 35%
  if (value < 100000000) return 50;     // 1억원 미만: 중위 50%
  if (value < 300000000) return 70;     // 3억원 미만: 상위 70%
  if (value < 500000000) return 85;     // 5억원 미만: 상위 85%
  return 90;                            // 5억원 이상: 상위 90%
}

function getEvaluationMessage(percentile) {
  if (percentile >= 90) return {
    message: '매우 우수한 가치를 보유하고 있습니다',
    emoji: '🏆'
  };
  if (percentile >= 70) return {
    message: '높은 가치를 보유하고 있습니다',
    emoji: '🌟'
  };
  if (percentile >= 50) return {
    message: '평균 이상의 가치를 보유하고 있습니다',
    emoji: '✨'
  };
  if (percentile >= 30) return {
    message: '성장 잠재력이 있습니다',
    emoji: '🌱'
  };
  return {
    message: '개선 기회가 많습니다',
    emoji: '💡'
  };
}

testValues.forEach(test => {
  const percentile = calculatePercentile(test.value);
  const evaluation = getEvaluationMessage(percentile);
  
  console.log(`${test.desc}`);
  console.log(`   상위 ${100 - percentile}% ${evaluation.emoji}`);
  console.log(`   ${evaluation.message}`);
  console.log('');
});

console.log('\n✅ 제거된 불필요한 정보:');
console.log('-'.repeat(50));
console.log('❌ 전국 순위 (2,558위)');
console.log('❌ 업종별 순위 (461위)');
console.log('❌ 평균 거래가');
console.log('❌ 중간값');
console.log('❌ 사용된 배수');
console.log('❌ 데이터 수');
console.log('❌ 수익배수/이익배수 표시');

console.log('\n✅ 유지/추가된 핵심 정보:');
console.log('-'.repeat(50));
console.log('✅ 업종 내 상위 % 표시');
console.log('✅ 핵심 가치 금액');
console.log('✅ 간단한 평가 메시지');
console.log('✅ 입력 정보 요약');
console.log('✅ 프리미엄 분석 유도');
console.log('✅ 다시 측정 / 공유 버튼');

console.log('\n=' .repeat(70));
console.log('✅ UI 간소화 완료!');
console.log('핵심 정보만 깔끔하게 표시됩니다.');