const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 클라이언트 설정
const supabaseUrl = 'https://ccwiaizdpfkenukyrzvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjd2lhaXpkcGZrZW51a3lyenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzA1NTksImV4cCI6MjA3MTE0NjU1OX0.bOibKfbvyfNNYBgbtKSbsSRwe5vCD6N665yW1hy56aE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importData() {
  console.log('🚀 Supabase 데이터 Import 시작 (개선된 버전)...\n');
  
  try {
    // 1. 연결 테스트
    console.log('📡 Supabase 연결 테스트 중...');
    const { count: testCount, error: testError } = await supabase
      .from('flippa_transactions')
      .select('*', { count: 'exact', head: true });
      
    if (testError) {
      console.log('⚠️ 테이블 접근 오류:', testError.message);
      console.log('\n📌 해결 방법:');
      console.log('1. Supabase Dashboard에서 fix-supabase-tables.sql 실행');
      console.log('2. RLS가 비활성화되었는지 확인');
      console.log('3. 테이블이 생성되었는지 확인\n');
      return;
    }
    
    console.log('✅ Supabase 연결 성공!');
    console.log(`📊 기존 데이터: ${testCount || 0}건`);
    
    // 2. 기존 데이터 처리
    if (testCount && testCount > 0) {
      console.log('\n🗑️ 기존 데이터를 삭제하시겠습니까?');
      console.log('   계속 진행하려면 Ctrl+C로 중단 후');
      console.log('   Supabase에서: DELETE FROM flippa_transactions;');
      console.log('   또는 그대로 진행 (기존 데이터에 추가)\n');
      
      // 5초 대기
      console.log('5초 후 계속 진행합니다...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // 3. 정제된 데이터 읽기
    const dataPath = path.join(__dirname, 'flippa_data_cleaned.json');
    if (!fs.existsSync(dataPath)) {
      console.error('❌ 정제된 데이터 파일이 없습니다.');
      console.log('💡 먼저 다음 명령을 실행하세요:');
      console.log('   node scripts/analyze-flippa-data-fixed.js\n');
      return;
    }
    
    const cleanedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`\n📦 ${cleanedData.length}개의 데이터를 Import 준비 완료`);
    
    // 4. 데이터 검증
    console.log('\n🔍 데이터 검증 중...');
    let validData = 0;
    let invalidData = 0;
    
    cleanedData.forEach((item, index) => {
      if (!item.business_type || item.price === undefined || item.price === null) {
        console.log(`  ⚠️ 행 ${index + 1}: 필수 필드 누락`);
        invalidData++;
      } else if (item.price > 9999999999) {
        console.log(`  ⚠️ 행 ${index + 1}: 가격이 너무 큼 (${item.price})`);
        invalidData++;
      } else {
        validData++;
      }
    });
    
    console.log(`✅ 유효한 데이터: ${validData}개`);
    if (invalidData > 0) {
      console.log(`⚠️ 무효한 데이터: ${invalidData}개 (스킵됨)`);
    }
    
    // 5. 배치로 데이터 삽입
    const batchSize = 50; // 안정적인 배치 크기
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    console.log('\n🔄 데이터 Import 시작...\n');
    
    for (let i = 0; i < cleanedData.length; i += batchSize) {
      const batch = cleanedData.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(cleanedData.length / batchSize);
      
      // 유효한 데이터만 필터링
      const validBatch = batch.filter(item => 
        item.business_type && 
        item.price !== undefined && 
        item.price !== null &&
        item.price <= 9999999999
      );
      
      if (validBatch.length === 0) {
        console.log(`⏭️ 배치 ${batchNum}/${totalBatches} 스킵 (유효한 데이터 없음)`);
        continue;
      }
      
      // created_at 필드 추가 및 필드 정리
      const batchToInsert = validBatch.map(item => ({
        business_type: item.business_type,
        price: Math.floor(item.price), // 정수로 변환
        revenue: Math.floor(item.revenue || 0),
        revenue_multiple: item.revenue_multiple || 0,
        profit: Math.floor(item.profit || 0),
        profit_multiple: item.profit_multiple || 0,
        listing_url: item.listing_url || '',
        original_type: item.original_type || item.business_type,
        created_at: new Date().toISOString()
      }));
      
      try {
        const { data, error } = await supabase
          .from('flippa_transactions')
          .insert(batchToInsert);
        
        if (error) {
          console.log(`❌ 배치 ${batchNum}/${totalBatches} 에러: ${error.message}`);
          errorCount += validBatch.length;
          errors.push({ 
            batch: batchNum, 
            error: error.message,
            hint: error.hint || '',
            details: error.details || ''
          });
          
          // 에러 상세 분석
          if (error.message.includes('numeric field overflow')) {
            const problematic = validBatch.find(item => 
              item.price > 9999999999 || 
              item.revenue > 9999999999
            );
            if (problematic) {
              console.log('   문제 데이터:', {
                price: problematic.price,
                revenue: problematic.revenue,
                type: problematic.business_type
              });
            }
          } else if (error.message.includes('violates row-level security')) {
            console.log('   💡 RLS 오류 - Supabase에서 다음 실행:');
            console.log('      ALTER TABLE flippa_transactions DISABLE ROW LEVEL SECURITY;');
          }
        } else {
          successCount += validBatch.length;
          const progress = Math.round((successCount / cleanedData.length) * 100);
          console.log(`✅ 배치 ${batchNum}/${totalBatches} 완료 (${successCount}/${cleanedData.length}) [${progress}%]`);
        }
      } catch (err) {
        console.log(`❌ 배치 ${batchNum}/${totalBatches} 예외: ${err.message}`);
        errorCount += validBatch.length;
        errors.push({ batch: batchNum, error: err.message });
      }
      
      // Rate limiting 방지를 위한 대기
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 6. 결과 리포트
    console.log('\n' + '='.repeat(50));
    console.log('📊 Import 완료!');
    console.log('='.repeat(50));
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    
    if (errors.length > 0) {
      console.log('\n🚨 에러 상세 (최대 5개):');
      errors.slice(0, 5).forEach(e => {
        console.log(`\n배치 ${e.batch}:`);
        console.log(`  에러: ${e.error}`);
        if (e.hint) console.log(`  힌트: ${e.hint}`);
        if (e.details) console.log(`  상세: ${e.details}`);
      });
      if (errors.length > 5) {
        console.log(`\n... 외 ${errors.length - 5}개 에러`);
      }
    }
    
    // 7. 최종 확인
    console.log('\n📊 최종 데이터베이스 확인...');
    const { count: finalCount, error: countError } = await supabase
      .from('flippa_transactions')
      .select('*', { count: 'exact', head: true });
      
    if (!countError) {
      console.log(`✅ 데이터베이스 총 데이터: ${finalCount}건`);
      
      // 업종별 통계
      if (finalCount > 0) {
        console.log('\n📈 업종별 분포:');
        const { data: typeStats } = await supabase
          .from('flippa_transactions')
          .select('business_type');
          
        if (typeStats) {
          const typeCounts = {};
          typeStats.forEach(row => {
            typeCounts[row.business_type] = (typeCounts[row.business_type] || 0) + 1;
          });
          
          Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
              const percentage = ((count / finalCount) * 100).toFixed(1);
              console.log(`  ${type}: ${count}건 (${percentage}%)`);
            });
        }
      }
    } else {
      console.log('❌ 최종 확인 실패:', countError.message);
    }
    
    console.log('\n🎉 작업 완료! 이제 앱에서 실제 데이터를 사용할 수 있습니다.');
    
  } catch (error) {
    console.error('\n❌ 예상치 못한 오류:', error.message);
    console.error(error.stack);
  }
}

// 실행
console.log('='.repeat(50));
console.log('Flippa 데이터 Import 도구 v2.0');
console.log('='.repeat(50));

importData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});