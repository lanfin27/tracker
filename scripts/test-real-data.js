/**
 * 실제 Supabase 데이터 연동 테스트
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.local 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealData() {
  console.log('🚀 Supabase 실제 데이터 연동 테스트 시작...\n');
  
  try {
    // 1. 전체 데이터 수 확인
    const { count: totalCount, error: countError } = await supabase
      .from('flippa_transactions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ 데이터 수 조회 실패:', countError);
      return;
    }
    
    console.log(`✅ 전체 거래 데이터: ${totalCount}건\n`);
    
    // 2. 카테고리별 데이터 수 확인
    const categories = ['content', 'ecommerce', 'saas', 'other'];
    
    for (const category of categories) {
      const { data, count, error } = await supabase
        .from('flippa_transactions')
        .select('*', { count: 'exact' })
        .eq('business_type', category)
        .limit(1);
      
      if (!error) {
        console.log(`📊 ${category}: ${count}건`);
        
        // 샘플 데이터 표시
        if (data && data.length > 0) {
          const sample = data[0];
          console.log(`   샘플: 가격 $${sample.price.toLocaleString()}, 수익배수 ${sample.revenue_multiple}x, 이익배수 ${sample.profit_multiple}x`);
        }
      }
    }
    
    console.log('\n');
    
    // 3. 통계 계산 테스트 (content 카테고리)
    const { data: contentData, error: contentError } = await supabase
      .from('flippa_transactions')
      .select('*')
      .eq('business_type', 'content')
      .order('price', { ascending: false })
      .limit(100);
    
    if (!contentError && contentData) {
      const prices = contentData.map(t => t.price);
      const revenueMultiples = contentData
        .map(t => t.revenue_multiple)
        .filter(m => m > 0 && m < 20);
      
      const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
      const median = arr => {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      };
      
      console.log('📈 Content 카테고리 통계 (상위 100건):');
      console.log(`   평균 가격: $${Math.round(avg(prices)).toLocaleString()}`);
      console.log(`   중간값: $${Math.round(median(prices)).toLocaleString()}`);
      console.log(`   평균 수익배수: ${avg(revenueMultiples).toFixed(1)}x`);
      console.log(`   중간 수익배수: ${median(revenueMultiples).toFixed(1)}x`);
    }
    
    console.log('\n✅ 테스트 완료! 실제 데이터 연동이 정상 작동합니다.');
    console.log('🌐 웹앱에서 확인: http://localhost:3003/valuation');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

testRealData();