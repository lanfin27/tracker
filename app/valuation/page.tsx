'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateBusinessValue } from '@/lib/valuation-multiples';
import SNSMetricsStep from '@/components/steps/SNSMetricsStep';
import { REAL_PROFIT_MARGINS, getProfitRateEvaluation } from '@/lib/profit-margins';

export default function ValuationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [valuationData, setValuationData] = useState({
    businessType: '',
    monthlyRevenue: 0,
    monthlyProfit: 0,
    businessAge: '',
    subscribers: 0,
    avgViews: 0,
    avgLikes: 0,
    category: ''
  });
  
  // SNS 비즈니스는 추가 단계(5단계) 필요
  const isSNSBusiness = ['youtube', 'instagram', 'tiktok'].includes(valuationData.businessType);
  const totalSteps = isSNSBusiness ? 5 : 4;
  const progress = (currentStep / totalSteps) * 100;
  
  // 각 단계별 심리적 훅 메시지
  const stepMessages = {
    1: "가장 높은 가치를 기록한 비즈니스는 SaaS입니다 💰",
    2: "같은 업종 평균 매출은 500만원입니다 📊",
    3: "수익률 30% 이상이면 상위 20%입니다 🎯",
    4: "3년 이상 운영하면 20% 프리미엄이 적용됩니다 🏆",
    5: "구독자 10만명은 평균 3억원의 가치를 가집니다 🚀"
  };

  const handleNext = (data: any) => {
    setIsAnimating(true);
    const newData = { ...valuationData, ...data };
    setValuationData(newData);
    
    setTimeout(() => {
      // Step 1에서 비즈니스 타입을 선택하면 totalSteps 재계산
      const currentIsSNS = ['youtube', 'instagram', 'tiktok'].includes(newData.businessType);
      const steps = currentIsSNS ? 5 : 4;
      
      if (currentStep < steps) {
        setCurrentStep(currentStep + 1);
      } else {
        // 결과 페이지로 이동
        localStorage.setItem('valuation_data', JSON.stringify(newData));
        router.push('/valuation/result');
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 토스 스타일 헤더 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-sm font-medium text-gray-600">
              {currentStep} / {totalSteps}
            </span>
          </div>
          
          {/* 프로그레스 바 */}
          <div className="h-1 bg-gray-100">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* 심리적 훅 메시지 */}
        <div className={`mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          <p className="text-sm text-blue-700 text-center font-medium">
            💡 {stepMessages[currentStep as keyof typeof stepMessages]}
          </p>
        </div>

        {/* 각 단계 렌더링 */}
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          {currentStep === 1 && <BusinessTypeStep onNext={handleNext} />}
          {currentStep === 2 && <RevenueStep onNext={handleNext} previousData={valuationData} />}
          {currentStep === 3 && <ProfitStep onNext={handleNext} previousData={valuationData} />}
          {currentStep === 4 && !isSNSBusiness && <BusinessAgeStep onNext={handleNext} previousData={valuationData} />}
          {currentStep === 4 && isSNSBusiness && (
            <SNSMetricsStep 
              businessType={valuationData.businessType as 'youtube' | 'instagram' | 'tiktok'} 
              onNext={handleNext} 
              previousData={valuationData} 
            />
          )}
          {currentStep === 5 && isSNSBusiness && <BusinessAgeStep onNext={handleNext} previousData={valuationData} />}
        </div>
      </div>
    </div>
  );
}

// Step 1: 비즈니스 타입 선택 (토스 스타일)
function BusinessTypeStep({ onNext }: { onNext: (data: any) => void }) {
  const [selected, setSelected] = useState('');
  
  // 실제 Multiple 데이터 (한국 시장 = US의 70%)
  const getMultipleText = (businessType: string): string => {
    const multiples: Record<string, { revenue: number; profit: number }> = {
      youtube: { revenue: 0.95, profit: 1.13 },
      instagram: { revenue: 1.59, profit: 0.94 },
      tiktok: { revenue: 0.53, profit: 0.76 },
      blog: { revenue: 2.38, profit: 0.74 },
      ecommerce: { revenue: 0.97, profit: 0.90 },
      saas: { revenue: 0.98, profit: 0.82 },
      website: { revenue: 1.43, profit: 0.46 }
    };
    
    const m = multiples[businessType];
    if (!m) return 'x1.0';
    
    // 더 높은 값을 표시
    const higherValue = Math.max(m.revenue, m.profit);
    return `x${higherValue.toFixed(1)}`;
  };
  
  const businessTypes = [
    { id: 'youtube', name: '유튜브', icon: '📺', desc: '구독자 10만 기준 평균 3억', multiple: getMultipleText('youtube') },
    { id: 'instagram', name: '인스타그램', icon: '📷', desc: '팔로워 5만 기준 평균 1.5억', multiple: getMultipleText('instagram') },
    { id: 'tiktok', name: '틱톡', icon: '🎵', desc: '팔로워 10만 기준 평균 2억', multiple: getMultipleText('tiktok') },
    { id: 'blog', name: '블로그', icon: '✍️', desc: '일 방문 1만 기준 평균 2억', multiple: getMultipleText('blog') },
    { id: 'ecommerce', name: '이커머스', icon: '🛍️', desc: '월 매출 5천만 기준 평균 5억', multiple: getMultipleText('ecommerce') },
    { id: 'saas', name: 'SaaS', icon: '💻', desc: 'MRR 2천만 기준 평균 9.6억', multiple: getMultipleText('saas') },
    { id: 'website', name: '웹사이트', icon: '🌐', desc: '월 매출 1천만 기준 평균 3억', multiple: getMultipleText('website') }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        어떤 비즈니스를 운영하시나요?
      </h2>
      <p className="text-gray-600 mb-8">
        정확한 가치 측정을 위해 필요해요
      </p>

      <div className="space-y-3">
        {businessTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelected(type.id);
              setTimeout(() => onNext({ businessType: type.id }), 200);
            }}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
              selected === type.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-xs text-gray-500">{type.desc}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-600">{type.multiple}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2: 매출 입력 (토스 스타일 + 실시간 피드백)
function RevenueStep({ onNext, previousData }: { onNext: (data: any) => void; previousData: any }) {
  const [revenue, setRevenue] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const averageRevenue: { [key: string]: number } = {
    youtube: 500,
    instagram: 300,
    tiktok: 400,
    blog: 200,
    ecommerce: 3000,
    saas: 2000,
    website: 1000
  };
  
  const avg = averageRevenue[previousData.businessType] || 500;
  
  const handleChange = (value: string) => {
    setRevenue(value);
    const numValue = Number(value);
    
    if (numValue > avg * 2) {
      setFeedback(`🔥 대박! 평균의 ${Math.round(numValue/avg)}배! 상위 5% 확정`);
    } else if (numValue > avg * 1.5) {
      setFeedback(`🎯 평균보다 ${Math.round((numValue/avg - 1) * 100)}% 높아요! 상위 10%`);
    } else if (numValue > avg) {
      setFeedback(`✨ 평균 이상이에요! 상위 30% 예상`);
    } else if (numValue > 0) {
      setFeedback(`💪 성장 가능성이 충분해요!`);
    } else {
      setFeedback(`📊 같은 업종 평균: ${avg}만원`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        월 평균 매출은 얼마인가요?
      </h2>
      <p className="text-gray-600 mb-8">
        최근 3개월 평균으로 알려주세요
      </p>

      {/* 실시간 피드백 */}
      {feedback && (
        <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm text-green-700 font-medium">{feedback}</p>
        </div>
      )}

      <div className="relative">
        <input
          type="number"
          value={revenue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="0"
          className="w-full px-6 py-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-colors"
          autoFocus
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
          만원
        </span>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        예: 500만원 → 500 입력
      </p>

      <button
        onClick={() => onNext({ monthlyRevenue: Number(revenue) * 10000 })}
        disabled={!revenue || Number(revenue) <= 0}
        className={`w-full mt-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
          revenue && Number(revenue) > 0
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </div>
  );
}

// Step 3: 수익 입력 (수익률 계산기 포함)
function ProfitStep({ onNext, previousData }: { onNext: (data: any) => void; previousData: any }) {
  const [profit, setProfit] = useState('');
  const [profitRate, setProfitRate] = useState('');
  const revenue = previousData.monthlyRevenue / 10000; // 원을 만원으로 변환
  const businessType = previousData.businessType || 'website';
  
  // 실제 데이터 기반 업종별 평균 수익률
  const getIndustryAvgMargin = (type: string): number => {
    // lib/profit-margins.ts에서 실제 데이터 기반 값 사용
    return REAL_PROFIT_MARGINS[type as keyof typeof REAL_PROFIT_MARGINS] || 12;
  };
  
  const industryAvgMargin = getIndustryAvgMargin(businessType);
  
  const handleRateChange = (rate: string) => {
    setProfitRate(rate);
    const calculatedProfit = Math.round(revenue * Number(rate) / 100);
    setProfit(String(calculatedProfit));
  };
  
  const rate = revenue ? Math.round((Number(profit) / revenue) * 100) : 0;
  
  const getRateFeedback = () => {
    if (rate === 0) {
      return `💡 업계 평균 수익률: ${industryAvgMargin}% (${businessType} 업종, 실제 데이터 기반)`;
    }
    // lib/profit-margins.ts의 평가 함수 사용
    return getProfitRateEvaluation(businessType, rate);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        월 평균 순수익은 얼마인가요?
      </h2>
      <p className="text-gray-600 mb-8">
        세금과 비용을 제외한 순수익이에요
      </p>

      {/* 수익률 계산기 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="text-sm font-medium text-blue-900 mb-3">
          💡 수익률로 계산하기
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">매출의</span>
          <input
            type="number"
            value={profitRate}
            onChange={(e) => handleRateChange(e.target.value)}
            placeholder={String(industryAvgMargin)}
            className="w-20 px-3 py-2 text-center border-2 border-blue-200 rounded-xl focus:border-blue-600 focus:outline-none"
          />
          <span className="text-sm text-gray-700">% = {Math.round(revenue * Number(profitRate || 0) / 100)}만원</span>
        </div>
      </div>

      {/* 수익률 피드백 */}
      <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-700 font-medium">{getRateFeedback()}</p>
      </div>

      <div className="relative">
        <input
          type="number"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
          placeholder="0"
          className="w-full px-6 py-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-colors"
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
          만원
        </span>
      </div>

      <button
        onClick={() => onNext({ monthlyProfit: Number(profit) * 10000 })}
        disabled={!profit}
        className={`w-full mt-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
          profit
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </div>
  );
}

// Step 4: 운영 기간 (실제 데이터 기반 프리미엄)
function BusinessAgeStep({ onNext, previousData }: { onNext: (data: any) => void; previousData?: any }) {
  const [selected, setSelected] = useState('');
  const businessType = previousData?.businessType || 'website';
  
  // 실제 데이터 기반 운영 기간 옵션
  const ageOptions = [
    { 
      id: '0-6', 
      label: '6개월 미만',
      desc: '🌱 초기 단계',
      icon: '🌱'
    },
    { 
      id: '6-12', 
      label: '6개월 ~ 1년',
      desc: '🌿 성장 초기',
      icon: '🌿'
    },
    { 
      id: '1-2', 
      label: '1년 ~ 2년',
      desc: '🌳 안정화 시기',
      icon: '🌳'
    },
    { 
      id: '2-3', 
      label: '2년 ~ 3년',
      desc: '🏢 성숙 단계',
      icon: '🏢'
    },
    { 
      id: '3+', 
      label: '3년 이상',
      desc: '👑 검증된 비즈니스',
      icon: '👑'
    }
  ];


  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        비즈니스 운영 기간은?
      </h2>
      <p className="text-gray-600 mb-8">
        업종별로 가치가 다르게 변화해요
      </p>

      <div className="space-y-3">
        {ageOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setSelected(option.id);
              setTimeout(() => onNext({ businessAge: option.id }), 200);
            }}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
              selected === option.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </div>
              </div>
              {selected === option.id && (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* 업종별 특성 설명 (수치 없이) */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-xs text-gray-700">
          💡 <span className="font-medium">{businessType}</span> 업종 특징:
          {businessType === 'ecommerce' && ' 초기 생존력이 중요합니다'}
          {businessType === 'saas' && ' 2년 이후 가치가 크게 상승합니다'}
          {businessType === 'youtube' && ' 구독자 충성도가 시간에 비례합니다'}
          {businessType === 'instagram' && ' 팔로워 참여율이 중요합니다'}
          {businessType === 'tiktok' && ' 빠른 성장이 가능합니다'}
          {businessType === 'blog' && ' 오래된 도메인일수록 가치가 높습니다'}
          {businessType === 'website' && ' 꾸준한 트래픽이 중요합니다'}
          {!['ecommerce', 'saas', 'youtube', 'instagram', 'tiktok', 'blog', 'website'].includes(businessType) && ' 안정적인 운영이 중요합니다'}
        </p>
      </div>
    </div>
  );
}