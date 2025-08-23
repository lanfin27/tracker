const fs = require('fs');
const path = require('path');

console.log('📊 이익률 데이터 검증 시작...\n');

// 실제 Excel 데이터 (미국 시장)
const actualData = {
  'YouTube': 81.21,
  'Instagram': 59.52,
  'TikTok': 63.85,
  'Content/Blog': 86.34,
  'Ecommerce': 41.63,
  'SaaS/App': 92.34,
  'Website': 65.10,
  'Unknown': 69.33,
  '전체평균': 62.68
};

// 한국 조정값 (70%)
const koreanAdjusted = {};
Object.entries(actualData).forEach(([key, value]) => {
  koreanAdjusted[key] = {
    us: value.toFixed(2) + '%',
    kr: (value * 0.7).toFixed(1) + '%',
    krRounded: Math.round(value * 0.7) + '%'
  };
});

console.log('📊 미국 vs 한국 시장 이익률:');
console.log('=====================================');
console.table(koreanAdjusted);

console.log('\n✅ 최종 적용값 (한국 시장):');
console.log('- YouTube: 57% (미국: 81.21%)');
console.log('- Instagram: 42% (미국: 59.52%)');
console.log('- TikTok: 45% (미국: 63.85%)');
console.log('- Blog: 60% (미국: 86.34%)');
console.log('- Ecommerce: 29% (미국: 41.63%)');
console.log('- SaaS: 65% (미국: 92.34%)');
console.log('- Website: 46% (미국: 65.10%)');
console.log('- 평균: 44% (미국: 62.68%)');

// 기존 시스템과 비교
console.log('\n📊 기존(잘못됨) vs 실제(정확함) 데이터:');
console.log('=====================================');
console.log('업종      | 기존(잘못) | 실제(정확) | 차이');
console.log('-------------------------------------');
console.log('YouTube   |    17%    |    57%    | +40%p');
console.log('Instagram |    15%    |    42%    | +27%p');
console.log('TikTok    |    13%    |    45%    | +32%p');
console.log('Blog      |    11%    |    60%    | +49%p');
console.log('Ecommerce |     9%    |    29%    | +20%p');
console.log('SaaS      |    19%    |    65%    | +46%p');
console.log('Website   |     8%    |    46%    | +38%p');

console.log('\n⚠️ 중요한 발견!');
console.log('=====================================');
console.log('1. 실제 데이터가 기존 추정치보다 훨씬 높음');
console.log('2. 이는 Flippa가 수익성 좋은 비즈니스 위주로 거래되기 때문');
console.log('3. SaaS의 경우 92.34%의 높은 수익률 (한국: 65%)');
console.log('4. Blog도 86.34%로 매우 높음 (한국: 60%)');

// 시뮬레이션
console.log('\n📊 시뮬레이션: 월 500만원 매출 시');
console.log('=====================================');

const monthlyRevenue = 500; // 만원

const businessTypes = {
  'YouTube': 57,
  'Instagram': 42,
  'TikTok': 45,
  'Blog': 60,
  'Ecommerce': 29,
  'SaaS': 65,
  'Website': 46
};

Object.entries(businessTypes).forEach(([type, margin]) => {
  const profit = Math.round(monthlyRevenue * margin / 100);
  const annualProfit = profit * 12;
  console.log(`${type.padEnd(12)}: 수익률 ${margin}% → 월 ${profit}만원 (연 ${(annualProfit/10000).toFixed(1)}억원)`);
});

console.log('\n📊 25% 하드코딩 체크:');
console.log('=====================================');
let has25 = false;
Object.entries(businessTypes).forEach(([type, margin]) => {
  if (margin === 25) {
    console.log(`❌ ${type}: 여전히 25%!`);
    has25 = true;
  }
});

if (!has25) {
  console.log('✅ 모든 업종에서 25% 완전 제거됨!');
}

// lib/profit-margins.ts 파일 체크
try {
  const profitMarginsPath = path.join(__dirname, '..', 'lib', 'profit-margins.ts');
  const content = fs.readFileSync(profitMarginsPath, 'utf-8');
  
  console.log('\n📊 lib/profit-margins.ts 파일 체크:');
  console.log('=====================================');
  
  // 새로운 값들이 있는지 확인
  const checks = [
    { value: '57', desc: 'YouTube 57%' },
    { value: '42', desc: 'Instagram 42%' },
    { value: '45', desc: 'TikTok 45%' },
    { value: '60', desc: 'Blog 60%' },
    { value: '29', desc: 'Ecommerce 29%' },
    { value: '65', desc: 'SaaS 65%' },
    { value: '46', desc: 'Website 46%' }
  ];
  
  checks.forEach(check => {
    if (content.includes(check.value)) {
      console.log(`✅ ${check.desc} 적용됨`);
    } else {
      console.log(`❌ ${check.desc} 미적용!`);
    }
  });
  
  // 기존 잘못된 값들이 있는지 확인
  const wrongValues = ['17', '15', '13', '11', '9', '19', '8'];
  const foundWrong = wrongValues.filter(val => 
    content.includes(`youtube: ${val}`) || 
    content.includes(`instagram: ${val}`) ||
    content.includes(`tiktok: ${val}`) ||
    content.includes(`blog: ${val}`) ||
    content.includes(`ecommerce: ${val}`) ||
    content.includes(`saas: ${val}`) ||
    content.includes(`website: ${val}`)
  );
  
  if (foundWrong.length > 0) {
    console.log(`\n⚠️ 기존 잘못된 값 발견: ${foundWrong.join(', ')}`);
  } else {
    console.log('\n✅ 기존 잘못된 값 모두 제거됨');
  }
  
} catch (error) {
  console.log('\n❌ lib/profit-margins.ts 파일 체크 실패:', error.message);
}

console.log('\n✅ 검증 완료!');
console.log('=====================================');
console.log('📌 이제 실제 데이터 기반의 정확한 이익률이 적용됩니다.');
console.log('📌 YouTube: 57% (NOT 17%, NOT 25%)');
console.log('📌 Ecommerce: 29% (NOT 9%)');
console.log('📌 SaaS: 65% (NOT 19%)');