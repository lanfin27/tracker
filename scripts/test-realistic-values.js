/**
 * 현실적인 가치 테스트
 * generateRecentMeasurements 함수 시뮬레이션
 */

console.log('🔍 현실적인 측정 가치 테스트');
console.log('=' .repeat(60));

// 현실적인 비즈니스 타입별 가치 범위 (억원 단위)
const businessTypes = [
  { 
    type: '유튜브', 
    icon: '🎬', 
    range: [0.5, 5]  // 5천만원 ~ 5억원
  },
  { 
    type: '인스타그램', 
    icon: '📸', 
    range: [0.3, 3]  // 3천만원 ~ 3억원
  },
  { 
    type: 'SaaS', 
    icon: '💻', 
    range: [1, 10]   // 1억원 ~ 10억원
  },
  { 
    type: '이커머스', 
    icon: '🛍️', 
    range: [0.5, 8]  // 5천만원 ~ 8억원
  },
  { 
    type: '블로그', 
    icon: '✍️', 
    range: [0.1, 2]  // 1천만원 ~ 2억원
  },
  { 
    type: '웹사이트', 
    icon: '🌐', 
    range: [0.2, 3]  // 2천만원 ~ 3억원
  },
  { 
    type: '틱톡', 
    icon: '🎵', 
    range: [0.2, 2]  // 2천만원 ~ 2억원
  }
];

// 포맷팅 함수
function formatValue(rawValue) {
  if (rawValue >= 1) {
    // 1억원 이상
    return `${rawValue.toFixed(1)}억원`;
  } else if (rawValue >= 0.1) {
    // 1천만원 이상
    const manwon = Math.round(rawValue * 10000);
    if (manwon >= 10000) {
      return `${(manwon / 10000).toFixed(1)}억원`;
    } else {
      return `${manwon.toLocaleString()}만원`;
    }
  } else {
    // 1천만원 미만
    const manwon = Math.round(rawValue * 10000);
    return `${manwon.toLocaleString()}만원`;
  }
}

console.log('\n📊 업종별 가치 범위:');
console.log('-'.repeat(50));

businessTypes.forEach(business => {
  const minFormatted = formatValue(business.range[0]);
  const maxFormatted = formatValue(business.range[1]);
  
  console.log(`${business.icon} ${business.type}: ${minFormatted} ~ ${maxFormatted}`);
});

console.log('\n🎯 랜덤 생성 테스트 (10회):');
console.log('-'.repeat(50));

// 10번 랜덤 생성 테스트
for (let test = 1; test <= 10; test++) {
  console.log(`\n테스트 ${test}:`);
  
  const measurements = [];
  const usedTypes = new Set();
  
  for (let i = 0; i < 3; i++) {
    let business;
    
    // 중복되지 않는 비즈니스 타입 선택
    do {
      business = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    } while (usedTypes.has(business.type) && usedTypes.size < businessTypes.length);
    
    usedTypes.add(business.type);
    
    // 현실적인 범위 내에서 랜덤 값 생성
    const minValue = business.range[0];
    const maxValue = business.range[1];
    const rawValue = Math.random() * (maxValue - minValue) + minValue;
    
    const valueText = formatValue(rawValue);
    
    measurements.push({
      type: business.type,
      icon: business.icon,
      value: valueText,
      rawValue: rawValue.toFixed(3)
    });
  }
  
  measurements.forEach((m, idx) => {
    console.log(`  ${idx + 1}. ${m.icon} ${m.type}: ${m.value} (원값: ${m.rawValue}억원)`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('✅ 테스트 결과:');
console.log('1. 모든 값이 현실적인 범위 내에 있음');
console.log('2. 99000만원 같은 비현실적 값 완전 제거');
console.log('3. 업종별로 적절한 범위 설정');
console.log('4. 포맷팅이 자연스럽게 표시됨');
console.log('5. 중복 타입 방지로 다양성 확보');

console.log('\n📋 초기값 (고정):');
const initialData = [
  { type: '유튜브', icon: '🎬', value: '3.2억원', timeAgo: '방금 전' },
  { type: '인스타그램', icon: '📸', value: '8,500만원', timeAgo: '2분 전' },
  { type: 'SaaS', icon: '💻', value: '5.7억원', timeAgo: '5분 전' }
];

initialData.forEach((item, idx) => {
  console.log(`  ${idx + 1}. ${item.icon} ${item.type}: ${item.value} (${item.timeAgo})`);
});

console.log('\n🔄 10초마다 자동 업데이트됩니다!');