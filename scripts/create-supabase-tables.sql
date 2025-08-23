-- Flippa 실제 거래 데이터 테이블 생성
-- Supabase SQL Editor에서 실행하세요

-- 1. 메인 테이블 생성
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

-- 2. 인덱스 생성 (빠른 조회를 위해)
CREATE INDEX idx_business_type ON flippa_transactions(business_type);
CREATE INDEX idx_price ON flippa_transactions(price);
CREATE INDEX idx_revenue ON flippa_transactions(revenue);
CREATE INDEX idx_profit ON flippa_transactions(profit);

-- 3. 업종별 통계 뷰 생성 (선택사항)
CREATE VIEW business_type_stats AS
SELECT 
  business_type,
  COUNT(*) as transaction_count,
  AVG(price) as avg_price,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median_price,
  AVG(revenue_multiple) as avg_revenue_multiple,
  AVG(profit_multiple) as avg_profit_multiple,
  MIN(price) as min_price,
  MAX(price) as max_price,
  STDDEV(price) as price_stddev
FROM flippa_transactions
WHERE price > 0
GROUP BY business_type;

-- 4. Row Level Security 비활성화 (공개 읽기용)
ALTER TABLE flippa_transactions ENABLE ROW LEVEL SECURITY;

-- 5. 공개 읽기 정책 생성
CREATE POLICY "Allow public read access" ON flippa_transactions
FOR SELECT USING (true);

-- 사용 안내:
-- 1. Supabase 대시보드 → SQL Editor로 이동
-- 2. 위 SQL을 복사하여 실행
-- 3. 성공하면 npm run import-data 실행