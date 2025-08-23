// Supabase 테이블 타입 정의
export interface FlippaTransaction {
  id: number;
  business_type: string;
  price: number;
  revenue: number;
  revenue_multiple: number;
  profit: number;
  profit_multiple: number;
  listing_url?: string;
  original_type?: string;
  created_at: string;
}

// 비즈니스 타입 매핑 (UI → DB)
export const BusinessTypeMapping = {
  // SNS 카테고리
  'youtube': 'content',
  'instagram': 'content',
  'tiktok': 'content',
  'blog': 'content',
  
  // 비즈니스 카테고리
  'ecommerce': 'ecommerce',
  'saas': 'saas',
  'website': 'other',
} as const;

// 통계 타입
export interface BusinessStats {
  business_type: string;
  transaction_count: number;
  avg_price: number;
  median_price: number;
  avg_revenue_multiple: number;
  avg_profit_multiple: number;
  min_price: number;
  max_price: number;
  percentile_25: number;
  percentile_75: number;
  percentile_90: number;
}

// 계산 결과 타입
export interface ValuationResult {
  value: number;
  percentile: number;
  ranking: {
    nationalRank: number;
    industryRank: number;
    totalUsers: number;
    industryTotal: number;
    percentile: number;
  };
  statistics: BusinessStats | null;
  similarTransactions: FlippaTransaction[];
  confidence: 'high' | 'medium' | 'low';
  dataCount: number;
  usedMethod: 'revenue' | 'profit' | 'fallback';
}