const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 클라이언트 설정
const supabaseUrl = 'https://ccwiaizdpfkenukyrzvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjd2lhaXpkcGZrZW51a3lyenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzA1NTksImV4cCI6MjA3MTE0NjU1OX0.bOibKfbvyfNNYBgbtKSbsSRwe5vCD6N665yW1hy56aE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importData() {
  try {
    console.log('🚀 Supabase 데이터 Import 시작...');
    
    // 1. 연결 테스트
    console.log('📡 Supabase 연결 테스트 중...');
    const { data: testData, error: testError } = await supabase
      .from('flippa_transactions')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase 연결 실패:', testError.message);
      console.log('💡 먼저 Supabase에서 테이블을 생성해주세요:');
      console.log(`
CREATE TABLE flippa_transactions (
  id SERIAL PRIMARY KEY,
  business_type VARCHAR(50) NOT NULL,
  price NUMERIC(12, 2),
  revenue NUMERIC(12, 2),
  revenue_multiple NUMERIC(5, 2),
  profit NUMERIC(12, 2),
  profit_multiple NUMERIC(5, 2),
  listing_url TEXT,
  original_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_business_type ON flippa_transactions(business_type);
CREATE INDEX idx_price ON flippa_transactions(price);
      `);
      return;
    }
    
    console.log('✅ Supabase 연결 성공!');
    
    // 2. 기존 데이터 확인
    const { count: existingCount } = await supabase
      .from('flippa_transactions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 기존 데이터: ${existingCount || 0}건`);
    
    if (existingCount && existingCount > 0) {
      console.log('⚠️  기존 데이터가 있습니다. 기존 데이터를 삭제하고 진행할까요?');
      console.log('   수동으로 Supabase에서 DELETE FROM flippa_transactions; 실행 후 다시 시도해주세요.');
      return;
    }
    
    // 3. 정제된 데이터 읽기
    const dataPath = path.join(__dirname, 'flippa_data_cleaned.json');
    if (!fs.existsSync(dataPath)) {
      console.error('❌ 정제된 데이터 파일이 없습니다.');
      console.log('💡 먼저 npm run analyze-data를 실행해주세요.');
      return;
    }
    
    const cleanedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`📦 ${cleanedData.length}개의 데이터를 Import 준비 완료`);
    
    // 4. 배치로 데이터 삽입 (100개씩)
    const batchSize = 100;
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    console.log('🔄 데이터 Import 시작...');
    
    for (let i = 0; i < cleanedData.length; i += batchSize) {
      const batch = cleanedData.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(cleanedData.length / batchSize);
      
      try {
        // ID 필드 제거 (Supabase에서 auto-increment)
        const batchData = batch.map(({ id, ...rest }) => rest);
        
        const { data, error } = await supabase
          .from('flippa_transactions')
          .insert(batchData);
        
        if (error) {
          console.error(`❌ 배치 ${batchNumber}/${totalBatches} 에러:`, error.message);
          errors.push({ batch: batchNumber, error: error.message });
          errorCount += batch.length;
        } else {
          successCount += batch.length;
          console.log(`✅ 배치 ${batchNumber}/${totalBatches} 완료 (${successCount}/${cleanedData.length})`);
        }
        
        // 요청 간 잠시 대기 (Rate limit 방지)
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.error(`❌ 배치 ${batchNumber} 예외:`, err.message);
        errors.push({ batch: batchNumber, error: err.message });
        errorCount += batch.length;
      }
    }
    
    // 5. 결과 리포트
    console.log('\n📊 Import 완료!');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    
    if (errors.length > 0) {
      console.log('\n🚨 에러 상세:');
      errors.slice(0, 5).forEach(err => {
        console.log(`  배치 ${err.batch}: ${err.error}`);
      });
      if (errors.length > 5) {
        console.log(`  ... 외 ${errors.length - 5}개 에러`);
      }
    }
    
    // 6. 최종 확인
    const { count: finalCount } = await supabase
      .from('flippa_transactions')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n🎉 최종 데이터베이스 데이터: ${finalCount}건`);
    
    // 7. 간단한 통계 조회
    console.log('\n📈 업종별 통계:');
    const { data: stats } = await supabase
      .from('flippa_transactions')
      .select('business_type')
      .order('business_type');
    
    if (stats) {
      const typeCounts = stats.reduce((acc, row) => {
        acc[row.business_type] = (acc[row.business_type] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}건`);
      });
    }
    
  } catch (error) {
    console.error('❌ Import 중 예상치 못한 오류:', error.message);
  }
}

// 실행
importData();