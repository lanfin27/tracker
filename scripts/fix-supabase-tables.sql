-- Flippa 데이터 Import 오류 해결을 위한 테이블 재생성
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS flippa_transactions CASCADE;

-- 2. 더 큰 숫자 필드로 테이블 재생성
CREATE TABLE flippa_transactions (
  id SERIAL PRIMARY KEY,
  business_type VARCHAR(100),
  price BIGINT,  -- NUMERIC 대신 BIGINT 사용 (더 큰 숫자 저장)
  revenue BIGINT,
  revenue_multiple DECIMAL(10, 2),  -- 최대 99999999.99
  profit BIGINT,
  profit_multiple DECIMAL(10, 2),
  listing_url TEXT,
  original_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. RLS 비활성화 (import를 위해 필수!)
ALTER TABLE flippa_transactions DISABLE ROW LEVEL SECURITY;

-- 4. 인덱스 생성 (빠른 조회를 위해)
CREATE INDEX idx_business_type ON flippa_transactions(business_type);
CREATE INDEX idx_price ON flippa_transactions(price);
CREATE INDEX idx_revenue ON flippa_transactions(revenue);
CREATE INDEX idx_profit ON flippa_transactions(profit);

-- 5. 테이블 권한 설정 (읽기/쓰기 허용)
GRANT ALL ON flippa_transactions TO anon;
GRANT ALL ON flippa_transactions TO authenticated;

-- 6. 확인용 쿼리
SELECT 
  table_name,
  column_name,
  data_type,
  character_maximum_length
FROM 
  information_schema.columns
WHERE 
  table_name = 'flippa_transactions'
ORDER BY 
  ordinal_position;

-- 성공 메시지
-- ✅ 테이블이 성공적으로 생성되었습니다!
-- 이제 npm run analyze-data를 실행하세요.