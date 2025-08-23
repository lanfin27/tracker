/**
 * Supabase 데이터베이스에서 실제 이익률 계산
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://nfyrisbdyvfvelvhmjqj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meXJpc2JkeXZmdmVsdmhtanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyODQ3MjEsImV4cCI6MjA0ODg2MDcyMX0.RCiQqp3qOUTYT6cTLJj1fE6v6-gYJaM43cl9xHY0J9o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function calculateRealProfitMargins() {
  console.log('📊 Supabase에서 실제 이익률 계산 시작...\n');
  
  try {
    // 모든 거래 데이터 가져오기
    const { data: transactions, error } = await supabase
      .from('flippa_transactions')
      .select('business_type, revenue, profit')
      .gt('revenue', 0);
    
    if (error) {
      throw error;
    }
    
    console.log(`✅ 총 ${transactions.length}개 거래 데이터 로드됨\n`);
    
    // 업종별 이익률 계산
    const marginsByType = {};
    
    transactions.forEach(row => {
      const businessType = row.business_type;
      const revenue = parseFloat(row.revenue) || 0;
      const profit = parseFloat(row.profit) || 0;
      
      if (businessType && revenue > 0) {
        if (!marginsByType[businessType]) {
          marginsByType[businessType] = {
            revenues: [],
            profits: [],
            margins: [],
            count: 0
          };
        }
        
        marginsByType[businessType].revenues.push(revenue);
        marginsByType[businessType].profits.push(profit);
        
        // 개별 이익률 계산
        const margin = (profit / revenue) * 100;
        if (margin >= 0 && margin <= 100) {
          marginsByType[businessType].margins.push(margin);
        }
        
        marginsByType[businessType].count++;
      }
    });
    
    // 각 업종별 평균 이익률 계산
    const results = {};
    
    Object.keys(marginsByType).forEach(type => {
      const typeData = marginsByType[type];
      
      if (typeData.margins.length > 0) {
        // 중간값 사용 (극단값 제거)
        const sortedMargins = typeData.margins.sort((a, b) => a - b);
        const medianMargin = sortedMargins[Math.floor(sortedMargins.length / 2)];
        
        // 평균값 계산
        const avgMargin = typeData.margins.reduce((a, b) => a + b, 0) / typeData.margins.length;
        
        // 중간값과 평균값의 평균 사용
        const finalMargin = (medianMargin + avgMargin) / 2;
        
        results[type] = {
          count: typeData.count,
          avgMargin: avgMargin,
          medianMargin: medianMargin,
          finalMargin: finalMargin,
          // 한국 시장 조정 (미국의 70%)
          koreanMargin: finalMargin * 0.7
        };
      }
    });
    
    // 결과 출력
    console.log('📊 업종별 실제 이익률 (Supabase 데이터):');
    console.log('==========================================\n');
    
    Object.keys(results).sort().forEach(type => {
      const data = results[type];
      console.log(`${type}:`);
      console.log(`  - 거래 수: ${data.count}건`);
      console.log(`  - 평균 이익률: ${data.avgMargin.toFixed(1)}%`);
      console.log(`  - 중간값 이익률: ${data.medianMargin.toFixed(1)}%`);
      console.log(`  - 최종 미국 이익률: ${data.finalMargin.toFixed(1)}%`);
      console.log(`  - 한국 조정 이익률: ${data.koreanMargin.toFixed(1)}%`);
      console.log('');
    });
    
    // UI 카테고리 매핑 (Supabase business_type -> UI businessType)
    const typeMapping = {
      // SNS 플랫폼
      'youtube': results.content ? results.content.koreanMargin * 1.2 : 18,
      'instagram': results.content ? results.content.koreanMargin : 15,
      'tiktok': results.content ? results.content.koreanMargin * 0.9 : 14,
      'blog': results.content ? results.content.koreanMargin * 0.8 : 12,
      // 일반 비즈니스
      'ecommerce': results.ecommerce ? results.ecommerce.koreanMargin : 10,
      'saas': results.saas ? results.saas.koreanMargin : 20,
      'website': results.other ? results.other.koreanMargin : 8,
      'other': results.other ? results.other.koreanMargin : 10
    };
    
    // 최종 결과 (반올림)
    const finalMargins = {};
    Object.keys(typeMapping).forEach(key => {
      finalMargins[key] = Math.round(typeMapping[key]);
    });
    
    console.log('\n📊 최종 UI 카테고리별 이익률 (한국 시장 기준):');
    console.log('=========================================\n');
    
    Object.keys(finalMargins).forEach(type => {
      console.log(`${type}: ${finalMargins[type]}%`);
    });
    
    // 데이터 신뢰도
    const totalCount = Object.values(results).reduce((sum, item) => sum + item.count, 0);
    const confidence = totalCount > 1000 ? 'HIGH' : totalCount > 100 ? 'MEDIUM' : 'LOW';
    
    // JSON 파일로 저장
    const outputData = {
      rawMargins: results,
      finalMargins: finalMargins,
      metadata: {
        totalRecords: transactions.length,
        usedRecords: totalCount,
        confidence: confidence,
        calculatedAt: new Date().toISOString(),
        dataSource: 'Supabase flippa_transactions',
        koreanAdjustment: 0.7
      }
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'real-profit-margins.json'),
      JSON.stringify(outputData, null, 2)
    );
    
    console.log('\n✅ real-profit-margins.json 파일 생성 완료!');
    console.log(`📊 데이터 신뢰도: ${confidence} (${totalCount}건 기반)`);
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

// 실행
calculateRealProfitMargins();