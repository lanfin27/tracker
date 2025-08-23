// Excel 파일 분석 스크립트
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

async function analyzeFlippaData() {
  try {
    // Excel 파일 읽기
    const filePath = 'C:\\Users\\KIMJAEHEON\\flippa scrap reclassification\\classified_flippa_data.xlsx';
    console.log('📊 Excel 파일 읽는 중:', filePath);
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('✅ 데이터 로드 완료!');
    console.log('총 데이터 수:', data.length);
    
    if (data.length > 0) {
      console.log('컬럼 목록:', Object.keys(data[0]));
    }

    // business_type_classified 종류 파악
    const businessTypes = [...new Set(data.map(row => row.business_type_classified))].filter(Boolean);
    console.log('\n📈 비즈니스 타입:', businessTypes);

    // 각 비즈니스 타입별 통계
    const statsReport = {};
    
    businessTypes.forEach(type => {
      const typeData = data.filter(row => row.business_type_classified === type);
      const prices = typeData.map(row => parseFloat(row.price)).filter(p => !isNaN(p) && p > 0);
      const revenues = typeData.map(row => parseFloat(row.revenue)).filter(r => !isNaN(r) && r > 0);
      const multiples = typeData.map(row => parseFloat(row.revenue_multiple)).filter(m => !isNaN(m) && m > 0);
      const profits = typeData.map(row => parseFloat(row.profit_average)).filter(p => !isNaN(p) && p > 0);
      
      const stats = {
        count: typeData.length,
        avgPrice: prices.length > 0 ? Math.round(prices.reduce((a,b) => a+b, 0) / prices.length) : 0,
        avgRevenue: revenues.length > 0 ? Math.round(revenues.reduce((a,b) => a+b, 0) / revenues.length) : 0,
        avgMultiple: multiples.length > 0 ? (multiples.reduce((a,b) => a+b, 0) / multiples.length).toFixed(2) : 0,
        avgProfit: profits.length > 0 ? Math.round(profits.reduce((a,b) => a+b, 0) / profits.length) : 0
      };
      
      statsReport[type] = stats;
      
      console.log(`\n${type}:`);
      console.log(`  - 거래 수: ${stats.count}`);
      console.log(`  - 평균 가격: $${stats.avgPrice.toLocaleString()}`);
      console.log(`  - 평균 Revenue: $${stats.avgRevenue.toLocaleString()}`);
      console.log(`  - 평균 Revenue Multiple: ${stats.avgMultiple}x`);
      console.log(`  - 평균 Profit: $${stats.avgProfit.toLocaleString()}`);
    });

    // 데이터 정제 및 Supabase 형식으로 변환
    console.log('\n🔄 데이터 정제 중...');
    
    const cleanedData = data.map((row, index) => {
      const price = parseFloat(row.price) || 0;
      const revenue = parseFloat(row.revenue) || 0;
      const profit = parseFloat(row.profit_average) || 0;
      const revenueMultiple = parseFloat(row.revenue_multiple) || 0;
      
      // profit_multiple 계산 (연간 이익 기준)
      const annualProfit = profit * 12;
      const profitMultiple = annualProfit > 0 ? (price / annualProfit) : 0;
      
      return {
        id: index + 1,
        business_type: mapBusinessType(row.business_type_classified),
        price: price,
        revenue: revenue,
        revenue_multiple: revenueMultiple,
        profit: profit,
        profit_multiple: profitMultiple,
        listing_url: row.listing_url || '',
        original_type: row.business_type_classified,
        created_at: new Date().toISOString()
      };
    }).filter(row => row.price > 0 && row.business_type !== 'unknown'); // 유효한 데이터만

    // 비즈니스 타입 매핑 함수
    function mapBusinessType(originalType) {
      if (!originalType) return 'unknown';
      
      const type = originalType.toLowerCase();
      
      if (type.includes('content') || type.includes('blog') || type.includes('media')) {
        return 'content';
      } else if (type.includes('ecommerce') || type.includes('e-commerce') || type.includes('shop')) {
        return 'ecommerce';
      } else if (type.includes('saas') || type.includes('software') || type.includes('app')) {
        return 'saas';
      } else if (type.includes('service') || type.includes('consulting')) {
        return 'service';
      } else if (type.includes('marketplace') || type.includes('platform')) {
        return 'marketplace';
      } else {
        return 'other';
      }
    }

    console.log(`✅ 정제 완료: ${cleanedData.length}개의 유효한 거래 데이터`);

    // 정제된 데이터 통계
    const cleanedStats = {};
    const newBusinessTypes = [...new Set(cleanedData.map(row => row.business_type))];
    
    newBusinessTypes.forEach(type => {
      const typeData = cleanedData.filter(row => row.business_type === type);
      const prices = typeData.map(row => row.price);
      const revenues = typeData.map(row => row.revenue).filter(r => r > 0);
      const revenueMultiples = typeData.map(row => row.revenue_multiple).filter(m => m > 0);
      const profitMultiples = typeData.map(row => row.profit_multiple).filter(m => m > 0);
      
      cleanedStats[type] = {
        count: typeData.length,
        avgPrice: Math.round(prices.reduce((a,b) => a+b, 0) / prices.length),
        medianPrice: Math.round(prices.sort((a,b) => a-b)[Math.floor(prices.length/2)]),
        avgRevenueMultiple: revenues.length > 0 ? 
          (revenueMultiples.reduce((a,b) => a+b, 0) / revenueMultiples.length).toFixed(2) : 0,
        avgProfitMultiple: profitMultiples.length > 0 ? 
          (profitMultiples.reduce((a,b) => a+b, 0) / profitMultiples.length).toFixed(2) : 0,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
      };
    });

    console.log('\n📊 정제된 데이터 통계:');
    Object.entries(cleanedStats).forEach(([type, stats]) => {
      console.log(`${type}: ${stats.count}건, 평균 $${stats.avgPrice.toLocaleString()}, 중앙값 $${stats.medianPrice.toLocaleString()}`);
    });

    // JSON 파일로 저장 (Supabase import용)
    const outputPath = path.join(__dirname, 'flippa_data_cleaned.json');
    fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));

    console.log(`\n✅ 데이터 정제 완료! ${outputPath} 파일 생성됨`);
    console.log(`📈 총 ${cleanedData.length}개의 거래 데이터가 준비되었습니다.`);
    
    // 통계 요약 파일도 저장
    const statsPath = path.join(__dirname, 'business_stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(cleanedStats, null, 2));
    console.log(`📊 통계 파일도 저장됨: ${statsPath}`);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    
    if (error.code === 'ENOENT') {
      console.log('💡 Excel 파일 경로를 확인해주세요:');
      console.log('   C:\\Users\\KIMJAEHEON\\flippa scrap reclassification\\classified_flippa_data.xlsx');
    }
  }
}

// 실행
analyzeFlippaData();