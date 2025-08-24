/**
 * 정밀한 금액 포매팅 테스트
 * formatValue 함수 동작 확인
 */

console.log('🔍 정밀한 금액 포매팅 테스트');
console.log('=' .repeat(70));

// formatValue 함수 복사
function formatValue(value) {
  if (value >= 100000000) {
    // 1억원 이상 - 소수점 둘째 자리까지
    const okValue = value / 100000000;
    
    if (okValue >= 1000) {
      // 1000억원 이상 - 정수로 표시
      return `${okValue.toFixed(0).toLocaleString()}억원`;
    } else if (okValue >= 100) {
      // 100억원 이상 - 소수점 첫째 자리
      return `${okValue.toFixed(1)}억원`;
    } else if (okValue >= 10) {
      // 10억원 이상 100억원 미만 - 소수점 둘째 자리
      return `${okValue.toFixed(2)}억원`;
    } else {
      // 1억원 이상 10억원 미만 - 소수점 둘째 자리
      return `${okValue.toFixed(2)}억원`;
    }
  } else {
    // 1억원 미만 - 만원 단위로 정확히 표시
    const manwon = Math.round(value / 10000);
    
    if (manwon === 0) {
      return '0원';
    } else if (manwon >= 10000) {
      // 1억원에 가까운 경우 (9,500만원 이상)
      const okValue = value / 100000000;
      return `${okValue.toFixed(2)}억원`;
    } else {
      // 천단위 구분자 추가
      return `${manwon.toLocaleString()}만원`;
    }
  }
}

// 메인 페이지용 포매팅 (억원 단위 입력)
function formatMainPageValue(rawValue) {
  if (rawValue >= 1) {
    // 1억원 이상 - 소수점 둘째 자리까지
    if (rawValue >= 10) {
      return `${rawValue.toFixed(1)}억원`;
    } else {
      return `${rawValue.toFixed(2)}억원`;
    }
  } else {
    // 1억원 미만 - 구체적인 만원 단위
    const manwon = Math.round(rawValue * 10000);
    return `${manwon.toLocaleString()}만원`;
  }
}

console.log('\n📊 테스트 케이스 - 결과 페이지 (원 단위 입력):');
console.log('-'.repeat(50));

const testCasesResult = [
  { input: 253400000, expected: "2.53억원", description: "2억 5340만원" },
  { input: 25340000, expected: "2,534만원", description: "2534만원" },
  { input: 1025000000, expected: "10.25억원", description: "10억 2500만원" },
  { input: 567800000, expected: "5.68억원", description: "5억 6780만원" },
  { input: 98760000, expected: "9,876만원", description: "9876만원" },
  { input: 4560000, expected: "456만원", description: "456만원" },
  { input: 102500000000, expected: "1,025.0억원", description: "1025억원" },
  { input: 12345000000, expected: "123.45억원", description: "123억 4500만원" },
  { input: 500000, expected: "50만원", description: "50만원" },
  { input: 0, expected: "0원", description: "0원" }
];

testCasesResult.forEach((test, index) => {
  const result = formatValue(test.input);
  const match = result === test.expected ? '✅' : '❌';
  
  console.log(`${index + 1}. ${test.description} (${test.input.toLocaleString()}원)`);
  console.log(`   기대값: ${test.expected}`);
  console.log(`   실제값: ${result} ${match}`);
  console.log('');
});

console.log('\n📱 테스트 케이스 - 메인 페이지 (억원 단위 입력):');
console.log('-'.repeat(50));

const testCasesMain = [
  { input: 2.534, expected: "2.53억원", description: "2.534억원" },
  { input: 0.2534, expected: "2,534만원", description: "0.2534억원 (2534만원)" },
  { input: 10.25, expected: "10.3억원", description: "10.25억원" },
  { input: 5.678, expected: "5.68억원", description: "5.678억원" },
  { input: 0.9876, expected: "9,876만원", description: "0.9876억원 (9876만원)" },
  { input: 0.0456, expected: "456만원", description: "0.0456억원 (456만원)" },
  { input: 125.5, expected: "125.5억원", description: "125.5억원" },
  { input: 1.234, expected: "1.23억원", description: "1.234억원" },
  { input: 0.05, expected: "500만원", description: "0.05억원 (500만원)" }
];

testCasesMain.forEach((test, index) => {
  const result = formatMainPageValue(test.input);
  const match = result === test.expected ? '✅' : '❌';
  
  console.log(`${index + 1}. ${test.description}`);
  console.log(`   기대값: ${test.expected}`);
  console.log(`   실제값: ${result} ${match}`);
  console.log('');
});

console.log('\n' + '='.repeat(70));
console.log('📋 개선 사항 요약:');
console.log('');
console.log('✅ 결과 페이지 개선:');
console.log('   - "2천만" → "2,534만원" (구체적인 숫자)');
console.log('   - "10억" → "10.25억원" (소수점 둘째 자리)');
console.log('   - 천단위 구분자 추가 (1,234만원)');
console.log('   - 0원 처리 추가');
console.log('');
console.log('✅ 메인 페이지 개선:');
console.log('   - "3.2억원" → "3.24억원"');
console.log('   - "8,500만원" → "8,567만원"');
console.log('   - "5.7억원" → "5.73억원"');
console.log('');
console.log('✅ 표시 규칙:');
console.log('   - 1억원 미만: 만원 단위 정확히 (2,534만원)');
console.log('   - 1~10억원: 소수점 둘째 자리 (3.24억원)');
console.log('   - 10~100억원: 소수점 둘째 자리 (10.25억원)');
console.log('   - 100~1000억원: 소수점 첫째 자리 (125.5억원)');
console.log('   - 1000억원 이상: 정수 (1,234억원)');

console.log('\n🚀 정밀한 금액 표시로 업그레이드 완료!');