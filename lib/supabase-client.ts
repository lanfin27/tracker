import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface FlippaTransaction {
  id: number;
  business_type: string;
  price: number;
  revenue: number;
  revenue_multiple: number;
  profit: number;
  profit_multiple: number;
  listing_url: string;
  original_type: string;
  created_at: string;
}

export interface BusinessTypeStats {
  business_type: string;
  transaction_count: number;
  avg_price: number;
  median_price: number;
  avg_revenue_multiple: number;
  avg_profit_multiple: number;
  min_price: number;
  max_price: number;
  price_stddev: number;
}

// Supabase 연결 테스트 함수
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('flippa_transactions').select('count').limit(1);
    return !error;
  } catch (error) {
    console.error('Supabase 연결 실패:', error);
    return false;
  }
}