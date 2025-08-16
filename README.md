# 🚀 Tracker - 비즈니스 가치 측정 플랫폼

## 📝 프로젝트 소개
1인 창업가와 크리에이터를 위한 비즈니스 가치 측정 및 순위 플랫폼

**주요 기능:**
- 📊 3분만에 비즈니스 가치 측정 (5,795개 실제 거래 데이터 기반)
- 🏆 전국 순위 및 업종별 비교
- 📈 EXIT 전략 분석
- ⚔️ 라이벌 비교 시스템
- 📧 이메일 리드 수집 시스템 (MVP 2.0)
- 🔥 실시간 사용자 카운터 및 심리적 트리거

## 🛠 기술 스택
- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Toss Design System
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Database**: Supabase (준비됨)
- **Analytics**: Google Analytics 4 (준비됨)
- **Deployment**: Vercel

## 🎯 MVP 2.0 "보여주되 갈증나게" 전략
현재 버전은 이메일 수집에 최적화된 MVP 2.0입니다:

### 심리적 트리거
- 🔥 실시간 사용자 카운터
- 📢 3초마다 갱신되는 라이브 알림
- ⏰ 24시간 한정 무료 메시지
- 🔒 프리미엄 콘텐츠 블러 처리

### 3단계 결과 공개 전략
1. **Basic**: 기본 가치 및 백분위 공개
2. **Teaser**: 상세 분석을 블러 처리로 미리보기
3. **Unlocked**: 이메일 제출 후 전체 분석 공개

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조
```
tracker/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지 (MVP 2.0)
│   ├── valuation/         # 가치 측정 플로우
│   │   ├── page.tsx      # 측정 단계
│   │   └── result/       # 결과 페이지
│   └── test-flow/        # 테스트 페이지
├── components/            # React 컴포넌트
│   ├── steps/            # 측정 단계 컴포넌트
│   └── toss/             # Toss 디자인 시스템
├── lib/                  # 유틸리티 함수
│   ├── calculate.ts      # 가치 계산 로직
│   ├── fake-data.ts      # 실시간 데이터 생성
│   └── email-service.ts  # 이메일 수집 서비스
└── public/               # 정적 파일
```

## 📊 데이터 구조

### 가치 계산 알고리즘
5,795개 실제 Flippa 거래 데이터 기반:
- 매출 멀티플: 업종별 차등 적용
- 수익 멀티플: 수익성 기반 보정
- 성장률 프리미엄: 급성장/안정/침체별 가중치
- 업력 보정: 운영 기간에 따른 신뢰성 점수

### 이메일 리드 데이터
```typescript
interface EmailLead {
  email: string;
  businessType: string;
  value: number;
  nationalRank: number;
  percentile: number;
  createdAt: Date;
  source: string;
  marketingConsent: boolean;
}
```

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. GitHub 레포지토리 연결
3. 환경 변수 설정
4. Deploy 클릭

## 데이터베이스 스키마

Supabase에서 다음 테이블을 생성하세요:

```sql
-- multiples 테이블
CREATE TABLE multiples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_type VARCHAR(50) NOT NULL,
  revenue_multiple_mean DECIMAL(4,1),
  revenue_multiple_median DECIMAL(4,1),
  revenue_multiple_q1 DECIMAL(4,1),
  revenue_multiple_q3 DECIMAL(4,1),
  profit_multiple_mean DECIMAL(4,1),
  profit_multiple_median DECIMAL(4,1),
  profit_multiple_q1 DECIMAL(4,1),
  profit_multiple_q3 DECIMAL(4,1),
  sample_count INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- valuations 테이블
CREATE TABLE valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100),
  business_type VARCHAR(50),
  monthly_revenue DECIMAL(12,2),
  monthly_profit DECIMAL(12,2),
  subscribers INTEGER,
  growth_rate VARCHAR(20),
  business_age VARCHAR(20),
  calculated_value DECIMAL(12,2),
  percentile INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- email_leads 테이블
CREATE TABLE email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  valuation_id UUID REFERENCES valuations(id),
  business_type VARCHAR(50),
  calculated_value DECIMAL(12,2),
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 라이선스

MIT