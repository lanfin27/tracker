# Supabase 백엔드 설정 가이드

## 🚀 개요
실제 Flippa 거래 데이터를 활용한 정확한 비즈니스 가치 평가를 위한 Supabase 백엔드 설정

## 📋 설정 단계

### 1. Supabase 테이블 생성
1. [Supabase 대시보드](https://app.supabase.com/) 접속
2. 프로젝트 선택: `ccwiaizdpfkenukyrzvn`
3. 좌측 메뉴 → SQL Editor 클릭
4. `scripts/create-supabase-tables.sql` 파일 내용 복사하여 실행

### 2. 데이터 Import 실행
```bash
# 1단계: Excel 데이터 분석
npm run analyze-data

# 2단계: Supabase로 데이터 업로드
npm run import-data
```

### 3. 확인
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
# 가치 평가 → 결과 페이지에서 콘솔 로그 확인
```

## 📊 데이터 구조

### flippa_transactions 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | 고유 ID |
| business_type | VARCHAR(50) | 비즈니스 타입 (content, ecommerce, saas, other) |
| price | NUMERIC(12,2) | 거래 가격 (USD) |
| revenue | NUMERIC(12,2) | 월 매출 |
| revenue_multiple | NUMERIC(5,2) | 매출 배수 |
| profit | NUMERIC(12,2) | 월 이익 |
| profit_multiple | NUMERIC(5,2) | 이익 배수 |
| listing_url | TEXT | 원본 링크 |
| original_type | VARCHAR(100) | 원본 분류명 |
| created_at | TIMESTAMP | 생성일시 |

### 비즈니스 타입 매핑
- `youtube`, `instagram`, `tiktok`, `blog` → `content`
- `ecommerce` → `ecommerce`
- `saas` → `saas`
- `website` → `other`

## 🔧 실제 데이터 기반 기능

### 1. 정확한 가치 계산
- 실제 거래 데이터의 평균 매출/이익 배수 사용
- 업종별 5,795건 거래 데이터 기반

### 2. 실시간 순위
- 실제 거래가 기준 백분위 계산
- 전국/업종별 순위 제공

### 3. 신뢰도 표시
- `high`: 충분한 데이터 (>10건)
- `medium`: 보통 데이터 (5-10건)
- `low`: 제한적 데이터 (<5건) 또는 폴백

### 4. 유사 거래 사례
- ±30% 가격 범위 내 실제 거래 표시
- 경쟁자 분석에 활용

## ⚠️ 문제 해결

### 연결 실패 시
```bash
# .env.local 파일 확인
NEXT_PUBLIC_SUPABASE_URL=https://ccwiaizdpfkenukyrzvn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Import 실패 시
1. Supabase 테이블이 생성되었는지 확인
2. `scripts/flippa_data_cleaned.json` 파일 존재 확인
3. 네트워크 연결 상태 확인

### 폴백 모드
- Supabase 연결 실패 시 자동으로 기존 하드코딩 로직 사용
- 콘솔에 "🔄 폴백 계산 사용" 메시지 표시

## 📈 통계 정보

### 업종별 데이터 분포 (2024년 기준)
- **Content**: 913건 (평균 $65,858)
- **Ecommerce**: 2,451건 (평균 $116,548)  
- **SaaS**: 1,417건 (평균 $197,278)
- **Other**: 1,014건 (평균 $188,354)

### 신뢰할 수 있는 멀티플
- Content: 평균 8.68x (revenue multiple)
- Ecommerce: 평균 2.29x
- SaaS: 평균 3.54x
- Other: 평균 6.73x

이제 실제 시장 데이터 기반으로 정확한 비즈니스 가치 평가가 가능합니다! 🎉