import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 이메일 리드 저장 (leads 테이블 구조에 맞춤)
export const saveEmailLead = async (data: {
  email: string;
  business_type?: string;
  monthly_revenue?: number;
  monthly_profit?: number;
  subscribers?: number;
  business_age?: string;
  calculated_value?: number;
  percentile?: number;
  page_source?: string;
}) => {
  const { data: result, error } = await supabase
    .from('leads')
    .insert([{
      email: data.email,
      business_type: data.business_type || null,
      monthly_revenue: data.monthly_revenue || null,
      monthly_profit: data.monthly_profit || null,
      subscribers: data.subscribers || null,
      business_age: data.business_age || null,
      calculated_value: data.calculated_value || null,
      percentile: data.percentile || null,
      page_source: data.page_source || 'result_page',
      utm_source: getUTMParam('utm_source') || null,
      utm_medium: getUTMParam('utm_medium') || null,
      utm_campaign: getUTMParam('utm_campaign') || null,
      created_at: new Date().toISOString()
    }])
    .select();
    
  if (error) {
    console.error('Error saving email lead:', error);
    throw error;
  }
  
  return { success: true, data: result };
};

// 주간 리포트 구독 저장
export const saveWeeklySubscription = async (data: {
  email: string;
  business_type?: string;
}) => {
  const { data: result, error } = await supabase
    .from('leads')
    .insert([{
      email: data.email,
      business_type: data.business_type || null,
      page_source: 'weekly_report',
      utm_source: getUTMParam('utm_source') || null,
      utm_medium: getUTMParam('utm_medium') || null,
      utm_campaign: getUTMParam('utm_campaign') || null,
      created_at: new Date().toISOString()
    }])
    .select();
    
  if (error) {
    console.error('Error saving weekly subscription:', error);
    throw error;
  }
  
  return { success: true, data: result };
};

// 페이지뷰 추적
export const trackPageView = async (pagePath: string) => {
  const { error } = await supabase
    .from('page_views')
    .insert([{
      page_path: pagePath,
      session_id: getOrCreateSessionId(),
      created_at: new Date().toISOString()
    }]);
    
  if (error) console.error('Page view tracking error:', error);
};

// 통계 데이터 가져오기
export const getStats = async () => {
  try {
    // 총 측정 수 (leads 테이블에서 calculated_value가 있는 경우)
    const { count: totalValuations } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .not('calculated_value', 'is', null);
    
    // 총 이메일 수집 수
    const { count: totalEmails } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    // 비즈니스 타입별 통계
    const { data: businessTypes } = await supabase
      .from('leads')
      .select('business_type')
      .not('business_type', 'is', null);
    
    const typeCount: Record<string, number> = {};
    businessTypes?.forEach(row => {
      const type = row.business_type;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    // 평균 가치 계산
    const { data: valuations } = await supabase
      .from('leads')
      .select('calculated_value')
      .not('calculated_value', 'is', null);
    
    const avgValue = valuations && valuations.length > 0
      ? valuations.reduce((sum, v) => sum + (v.calculated_value || 0), 0) / valuations.length
      : 0;
    
    // 페이지뷰 수
    const { count: totalPageViews } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });
    
    return {
      totalValuations: totalValuations || 0,
      totalEmails: totalEmails || 0,
      businessTypeStats: typeCount,
      averageValue: Math.round(avgValue),
      totalPageViews: totalPageViews || 0
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalValuations: 0,
      totalEmails: 0,
      businessTypeStats: {},
      averageValue: 0,
      totalPageViews: 0
    };
  }
};

// 세션 ID 생성 및 관리
function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// UTM 파라미터 가져오기
function getUTMParam(param: string): string | null {
  if (typeof window === 'undefined') return null;
  
  // sessionStorage에서 먼저 확인
  const stored = sessionStorage.getItem(param);
  if (stored) return stored;
  
  // URL 파라미터에서 확인
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(param);
  
  // 값이 있으면 sessionStorage에 저장
  if (value) {
    sessionStorage.setItem(param, value);
  }
  
  return value;
}

// UTM 파라미터 저장 (페이지 로드 시 실행)
export const saveUTMParams = () => {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmParams.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      sessionStorage.setItem(param, value);
    }
  });
};

// 테이블 생성 쿼리 (참고용)
export const TABLE_SCHEMA = `
-- leads 테이블
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  business_type VARCHAR(50),
  monthly_revenue INTEGER,
  monthly_profit INTEGER,
  subscribers INTEGER,
  business_age VARCHAR(20),
  calculated_value BIGINT,
  percentile INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_source VARCHAR(100),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100)
);

-- page_views 테이블
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path VARCHAR(255),
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
`;