const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('📊 Excel 데이터 분석 시작 (개선된 버전)...\n');

// Excel 파일 읽기
const filePath = 'C:\\Users\\KIMJAEHEON\\flippa scrap reclassification\\classified_flippa_data.xlsx';
console.log('파일 경로:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log('✅ 파일 로드 성공!');
  console.log('총 데이터 수:', data.length);
  console.log('첫 번째 데이터 샘플:', Object.keys(data[0]).slice(0, 10));

  // 데이터 정제 함수 - 더 엄격한 검증
  function cleanNumber(value, maxValue = 999999999) {
    if (!value || value === '' || value === 'N/A' || value === '#N/A' || value === null || value === undefined) {
      return 0;
    }
    
    let num;
    if (typeof value === 'string') {
      // $ 기호와 쉼표 제거
      num = parseFloat(value.replace(/[$,]/g, ''));
    } else {
      num = parseFloat(value);
    }
    
    // NaN이거나 너무 큰 값 처리
    if (isNaN(num) || !isFinite(num)) return 0;
    if (num < 0) return 0; // 음수 제거
    if (num > maxValue) return maxValue;
    
    return Math.floor(num); // 정수로 변환
  }

  // 비즈니스 타입 정제 및 매핑
  function cleanBusinessType(type) {
    if (!type || type === '' || type === 'Unknown') return 'other';
    
    const typeStr = type.toString().toLowerCase().trim();
    
    // 매핑 규칙
    if (typeStr.includes('youtube') || typeStr.includes('tiktok') || typeStr.includes('instagram')) {
      return 'content';
    } else if (typeStr.includes('content') || typeStr.includes('blog')) {
      return 'content';
    } else if (typeStr.includes('ecommerce') || typeStr.includes('e-commerce')) {
      return 'ecommerce';
    } else if (typeStr.includes('saas') || typeStr.includes('app')) {
      return 'saas';
    } else if (typeStr.includes('website')) {
      return 'other';
    } else {
      return 'other';
    }
  }

  console.log('\n🔄 데이터 정제 중...');

  // 데이터 정제 및 변환
  const cleanedData = [];
  let skippedCount = 0;
  let extremeValueCount = 0;

  data.forEach((row, index) => {
    // 가격 정제 (최대 100억원)
    const price = cleanNumber(row.price, 9999999999);
    
    // 가격이 너무 작거나 없으면 스킵
    if (price < 100) {
      skippedCount++;
      return;
    }
    
    // 극단값 체크 (100억 이상은 제외)
    if (price > 10000000000) {
      extremeValueCount++;
      return;
    }
    
    const revenue = cleanNumber(row.revenue, 999999999); // 최대 10억
    const profit = cleanNumber(row.profit_average || row.profit, 999999999);
    
    // revenue_multiple 정제 (0-100 범위)
    let revenueMultiple = cleanNumber(row.revenue_multiple, 100);
    if (revenueMultiple > 100) revenueMultiple = 10; // 극단값은 10으로 조정
    
    // profit_multiple 계산
    let profitMultiple = 0;
    if (profit > 0 && price > 0) {
      const annualProfit = profit * 12;
      if (annualProfit > 0) {
        profitMultiple = Math.round((price / annualProfit) * 100) / 100;
        if (profitMultiple > 100) profitMultiple = 10; // 극단값 조정
        if (profitMultiple < 0.1) profitMultiple = 0;
      }
    }
    
    // URL 정제
    const listingUrl = (row.listing_url || '').toString().substring(0, 500);
    
    cleanedData.push({
      business_type: cleanBusinessType(row.business_type_classified),
      price: price,
      revenue: revenue,
      revenue_multiple: revenueMultiple,
      profit: profit,
      profit_multiple: profitMultiple,
      listing_url: listingUrl,
      original_type: (row.business_type_classified || 'unknown').substring(0, 100)
    });
  });

  console.log('✅ 정제 완료!');
  console.log(`  - 정제된 데이터: ${cleanedData.length}건`);
  console.log(`  - 스킵된 데이터: ${skippedCount}건 (가격 < 100)`);
  console.log(`  - 극단값 제거: ${extremeValueCount}건 (가격 > 100억)`);

  // 통계 출력
  const businessTypes = [...new Set(cleanedData.map(row => row.business_type))];
  console.log('\n📊 업종별 통계:');

  const stats = {};
  businessTypes.forEach(type => {
    const typeData = cleanedData.filter(row => row.business_type === type);
    const prices = typeData.map(row => row.price);
    
    if (prices.length > 0) {
      const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const medianPrice = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)];
      
      stats[type] = {
        count: typeData.length,
        avgPrice,
        medianPrice,
        minPrice,
        maxPrice
      };
      
      console.log(`\n${type}:`);
      console.log(`  - 거래 수: ${typeData.length}건`);
      console.log(`  - 평균: $${avgPrice.toLocaleString()}`);
      console.log(`  - 중간값: $${medianPrice.toLocaleString()}`);
      console.log(`  - 범위: $${minPrice.toLocaleString()} ~ $${maxPrice.toLocaleString()}`);
    }
  });

  // 문제가 있는 데이터 확인
  const problematicData = cleanedData.filter(row => 
    row.price > 1000000000 || // 10억 이상
    row.revenue > 100000000 || // 1억 이상 매출
    row.revenue_multiple > 50 // 50배 이상 멀티플
  );

  if (problematicData.length > 0) {
    console.log(`\n⚠️ 주의: ${problematicData.length}개의 고가 데이터 포함`);
    console.log('고가 데이터 예시:');
    problematicData.slice(0, 3).forEach(item => {
      console.log(`  - 가격: $${item.price.toLocaleString()}, 타입: ${item.business_type}`);
    });
  }

  // JSON 파일로 저장
  const outputPath = path.join(__dirname, 'flippa_data_cleaned.json');
  fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2));

  console.log(`\n💾 ${outputPath} 파일 생성 완료!`);
  console.log(`✅ 총 ${cleanedData.length}개의 깨끗한 데이터가 준비되었습니다.`);
  
  // 통계 파일도 저장
  const statsPath = path.join(__dirname, 'business_stats.json');
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  console.log(`📊 통계 파일: ${statsPath}`);

} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  
  if (error.code === 'ENOENT') {
    console.log('\n💡 Excel 파일을 찾을 수 없습니다.');
    console.log('   경로를 확인해주세요:', filePath);
  }
}