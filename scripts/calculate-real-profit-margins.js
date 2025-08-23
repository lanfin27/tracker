const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('📊 실제 Flippa 데이터에서 업종별 이익률 계산 시작...\n');

// Excel 파일 읽기
const filePath = 'C:\\Users\\KIMJAEHEON\\flippa scrap reclassification\\classified_flippa_data.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`✅ 총 ${data.length}개 데이터 로드됨\n`);

  // 업종별 이익률 계산
  const calculateProfitMargins = () => {
    const marginsByType = {};
    
    // 업종별로 그룹화
    data.forEach(row => {
      const businessType = row.business_type_classified;
      const revenue = parseFloat(row.revenue) || 0;
      const profit = parseFloat(row.profit_average || row.profit) || 0;
      
      // 유효한 데이터만 사용 (revenue > 0)
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
        if (margin >= 0 && margin <= 100) { // 0-100% 범위만
          marginsByType[businessType].margins.push(margin);
        }
        
        marginsByType[businessType].count++;
      }
    });
    
    // 각 업종별 평균 이익률 계산
    const results = {};
    
    Object.keys(marginsByType).forEach(type => {
      const typeData = marginsByType[type];
      
      // 방법 1: 개별 거래의 이익률 평균
      const avgMarginFromIndividual = typeData.margins.length > 0
        ? typeData.margins.reduce((a, b) => a + b, 0) / typeData.margins.length
        : 0;
      
      // 방법 2: 총 수익 / 총 매출
      const totalRevenue = typeData.revenues.reduce((a, b) => a + b, 0);
      const totalProfit = typeData.profits.reduce((a, b) => a + b, 0);
      const avgMarginFromTotal = totalRevenue > 0 
        ? (totalProfit / totalRevenue) * 100 
        : 0;
      
      results[type] = {
        count: typeData.count,
        avgMarginIndividual: avgMarginFromIndividual,
        avgMarginTotal: avgMarginFromTotal,
        // 두 방법의 평균값 사용
        finalMargin: (avgMarginFromIndividual + avgMarginFromTotal) / 2,
        // 한국 시장 조정 (미국의 70%)
        koreanMargin: ((avgMarginFromIndividual + avgMarginFromTotal) / 2) * 0.7
      };
    });
    
    return results;
  };

  const profitMargins = calculateProfitMargins();

  // 결과 출력
  console.log('📊 업종별 실제 이익률 (미국 시장):');
  console.log('=====================================\n');

  Object.keys(profitMargins).sort().forEach(type => {
    const data = profitMargins[type];
    if (data.count > 0) {
      console.log(`${type}:`);
      console.log(`  - 거래 수: ${data.count}건`);
      console.log(`  - 미국 평균 이익률: ${data.finalMargin.toFixed(1)}%`);
      console.log(`  - 한국 조정 이익률: ${data.koreanMargin.toFixed(1)}%`);
      console.log('');
    }
  });

  // UI 카테고리로 매핑
  const uiCategoryMapping = {
    'content': ['content', 'blog', 'newsletter', 'media'],
    'ecommerce': ['ecommerce', 'e-commerce', 'marketplace'],
    'saas': ['saas', 'software', 'app'],
    'other': ['other', 'service', 'agency']
  };

  // UI 카테고리별 평균 계산
  const uiMargins = {};

  Object.keys(uiCategoryMapping).forEach(uiCategory => {
    const relatedTypes = uiCategoryMapping[uiCategory];
    const relevantMargins = [];
    let totalCount = 0;
    
    relatedTypes.forEach(type => {
      if (profitMargins[type] && profitMargins[type].count > 0) {
        // 거래량에 가중치를 둔 평균
        for (let i = 0; i < profitMargins[type].count; i++) {
          relevantMargins.push(profitMargins[type].koreanMargin);
        }
        totalCount += profitMargins[type].count;
      }
    });
    
    if (relevantMargins.length > 0) {
      uiMargins[uiCategory] = {
        margin: relevantMargins.reduce((a, b) => a + b, 0) / relevantMargins.length,
        count: totalCount
      };
    } else {
      // 폴백 값
      uiMargins[uiCategory] = {
        margin: uiCategory === 'saas' ? 20 : uiCategory === 'content' ? 15 : 10,
        count: 0
      };
    }
  });

  // SNS 플랫폼별 세분화 (Content 카테고리 기반)
  const contentMargin = uiMargins.content ? uiMargins.content.margin : 15;
  
  const snsMargins = {
    youtube: Math.round(contentMargin * 1.2),  // Content보다 20% 높음
    instagram: Math.round(contentMargin * 1.0), // Content와 동일
    tiktok: Math.round(contentMargin * 0.9),    // Content보다 10% 낮음
    blog: Math.round(contentMargin * 0.8),      // Content보다 20% 낮음
  };

  // 최종 결과 객체 생성
  const finalMargins = {
    ...snsMargins,
    ecommerce: Math.round(uiMargins.ecommerce ? uiMargins.ecommerce.margin : 10),
    saas: Math.round(uiMargins.saas ? uiMargins.saas.margin : 20),
    website: Math.round(uiMargins.other ? uiMargins.other.margin : 10),
    other: Math.round(uiMargins.other ? uiMargins.other.margin : 10)
  };

  console.log('\n📊 최종 UI 카테고리별 이익률 (한국 시장 기준):');
  console.log('=========================================\n');

  Object.keys(finalMargins).forEach(type => {
    console.log(`${type}: ${finalMargins[type]}%`);
  });

  // 데이터 신뢰도 계산
  const totalDataCount = Object.values(uiMargins).reduce((sum, item) => sum + (item.count || 0), 0);
  const confidence = totalDataCount > 1000 ? 'HIGH' : totalDataCount > 100 ? 'MEDIUM' : 'LOW';

  // JSON 파일로 저장
  const outputData = {
    rawMargins: profitMargins,
    uiCategoryMargins: uiMargins,
    finalMargins: finalMargins,
    metadata: {
      totalRecords: data.length,
      usedRecords: totalDataCount,
      confidence: confidence,
      calculatedAt: new Date().toISOString(),
      dataSource: 'classified_flippa_data.xlsx',
      koreanAdjustment: 0.7
    }
  };

  fs.writeFileSync(
    path.join(__dirname, 'real-profit-margins.json'),
    JSON.stringify(outputData, null, 2)
  );

  console.log('\n✅ real-profit-margins.json 파일 생성 완료!');
  console.log(`📊 데이터 신뢰도: ${confidence} (${totalDataCount}건 기반)`);
  console.log('📌 이 데이터를 lib/profit-margins.ts에 적용하세요.');
  
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  
  // 오류 시 기본값 생성
  const defaultMargins = {
    youtube: 18,
    instagram: 16,
    tiktok: 14,
    blog: 12,
    ecommerce: 10,
    saas: 20,
    website: 8,
    other: 10
  };
  
  const outputData = {
    finalMargins: defaultMargins,
    metadata: {
      error: error.message,
      usingDefaults: true,
      calculatedAt: new Date().toISOString()
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'real-profit-margins.json'),
    JSON.stringify(outputData, null, 2)
  );
  
  console.log('\n⚠️ 기본값으로 real-profit-margins.json 생성됨');
}