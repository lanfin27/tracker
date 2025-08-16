export interface EmailLead {
  email: string;
  businessType: string;
  value: number;
  nationalRank: number;
  percentile: number;
  createdAt: Date;
  source?: string;
  marketingConsent: boolean;
}

export const saveEmailLead = async (lead: EmailLead) => {
  try {
    // Supabase 연동 전까지는 localStorage에만 저장
    const existingLeads = JSON.parse(localStorage.getItem('email_leads') || '[]');
    existingLeads.push(lead);
    localStorage.setItem('email_leads', JSON.stringify(existingLeads));
    
    // 성공 시 로컬 스토리지에도 저장 (중복 체크용)
    localStorage.setItem('email_submitted', lead.email);
    localStorage.setItem('unlock_date', new Date().toISOString());
    
    // 콘솔에 기록 (개발용)
    console.log('Email lead saved:', lead);
    
    return { success: true, data: lead };
  } catch (error) {
    console.error('Email save error:', error);
    // 실패해도 로컬에는 저장 (오프라인 대응)
    localStorage.setItem('pending_email', JSON.stringify(lead));
    return { success: false, error };
  }
};

export const checkEmailSubmitted = (): boolean => {
  return !!localStorage.getItem('email_submitted');
};

export const getUnlockedData = () => {
  const unlockDate = localStorage.getItem('unlock_date');
  if (!unlockDate) return null;
  
  // 24시간 동안만 유효
  const unlockTime = new Date(unlockDate).getTime();
  const now = new Date().getTime();
  const hoursPassed = (now - unlockTime) / (1000 * 60 * 60);
  
  if (hoursPassed > 24) {
    localStorage.removeItem('email_submitted');
    localStorage.removeItem('unlock_date');
    return null;
  }
  
  return {
    email: localStorage.getItem('email_submitted'),
    hoursRemaining: Math.round(24 - hoursPassed)
  };
};