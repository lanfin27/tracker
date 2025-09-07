// 플랫폼별 가치 환산 테스트
import { getAdjustedFollowerValue } from './lib/platform-conversion-rates.js';

// 테스트 케이스
const testCases = [
  {
    platform: 'youtube',
    category: '금융/경제',
    baseValue: 520,
    subscribers: 10000,
    expected: '520원/명 (기준)'
  },
  {
    platform: 'instagram',
    category: '뷰티',
    baseValue: 320,
    subscribers: 10000,
    expected: '약 69원/명 (YouTube의 1/6 × 카테고리 보정 1.3)'
  },
  {
    platform: 'tiktok',
    category: '교육',
    baseValue: 450,
    subscribers: 10000,
    expected: '약 360원/명 (YouTube의 2/3 × 카테고리 보정 1.2)'
  }
];

console.log('=== 플랫폼별 팔로워 가치 환산 테스트 ===\n');

testCases.forEach(test => {
  const adjustedValue = getAdjustedFollowerValue(test.platform, test.category, test.baseValue);
  const totalValue = adjustedValue * test.subscribers;
  
  console.log(`📱 ${test.platform.toUpperCase()} - ${test.category}`);
  console.log(`   구독자/팔로워: ${test.subscribers.toLocaleString()}명`);
  console.log(`   YouTube 기준값: ${test.baseValue}원/명`);
  console.log(`   환산된 가치: ${adjustedValue}원/명`);
  console.log(`   총 가치: ${(totalValue / 10000).toFixed(0)}만원`);
  console.log(`   예상값: ${test.expected}`);
  console.log('');
});

// 플랫폼 간 비교
console.log('=== 플랫폼 간 비교 (동일 카테고리, 10,000명 기준) ===\n');

const compareCategory = '뷰티';
const compareBaseValue = 320;
const compareSubscribers = 10000;

const platforms = ['youtube', 'instagram', 'tiktok'];
const results = {};

platforms.forEach(platform => {
  const adjustedValue = platform === 'youtube' ? compareBaseValue : 
    getAdjustedFollowerValue(platform, compareCategory, compareBaseValue);
  const totalValue = adjustedValue * compareSubscribers;
  results[platform] = { adjustedValue, totalValue };
  
  console.log(`${platform.toUpperCase()}: ${adjustedValue}원/명 = ${(totalValue / 10000).toFixed(0)}만원`);
});

console.log('\n비율:');
console.log(`Instagram/YouTube: ${(results.instagram.adjustedValue / results.youtube.adjustedValue * 100).toFixed(1)}%`);
console.log(`TikTok/YouTube: ${(results.tiktok.adjustedValue / results.youtube.adjustedValue * 100).toFixed(1)}%`);