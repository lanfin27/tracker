import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 이메일 리드 저장
export const saveEmailLead = async (data: {
  email: string;
  businessType: string;
  businessValue: number;
  nationalRank: number;
  percentile: number;
  monthlyRevenue: number;
  monthlyProfit: number;
}) => {
  const { error } = await supabase
    .from('email_leads')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
      source: 'mvp_test',
      utm_source: getUTMParam('utm_source') || 'direct',
      utm_medium: getUTMParam('utm_medium') || 'none',
      utm_campaign: getUTMParam('utm_campaign') || 'mvp'
    }]);
    
  if (error) throw error;
  return { success: true };
};

// 방문자 이벤트 추적
export const trackEvent = async (eventName: string, eventData: any) => {
  const { error } = await supabase
    .from('events')
    .insert([{
      event_name: eventName,
      event_data: eventData,
      created_at: new Date().toISOString(),
      session_id: getOrCreateSessionId()
    }]);
    
  if (error) console.error('Event tracking error:', error);
};

// 세션 ID 생성 및 관리
function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// UTM 파라미터 가져오기
function getUTMParam(param: string): string | null {
  if (typeof window === 'undefined') return null;
  
  // localStorage에서 먼저 확인
  const stored = localStorage.getItem(param);
  if (stored) return stored;
  
  // URL 파라미터에서 확인
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(param);
  
  // 값이 있으면 localStorage에 저장
  if (value) {
    localStorage.setItem(param, value);
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
      localStorage.setItem(param, value);
    }
  });
};

// 이벤트 타입 정의
export const EventTypes = {
  PAGE_VIEW: 'page_view',
  VALUATION_START: 'valuation_start',
  VALUATION_COMPLETE: 'valuation_complete',
  EMAIL_SUBMIT: 'email_submit',
  SHARE_RESULT: 'share_result',
  STEP_COMPLETE: 'step_complete'
} as const;