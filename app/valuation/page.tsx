'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateBusinessValue } from '@/lib/valuation-multiples';
import SNSMetricsStep from '@/components/steps/SNSMetricsStep';

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
          {currentStep === 4 && !isSNSBusiness && <BusinessAgeStep onNext={handleNext} />}
          {currentStep === 4 && isSNSBusiness && (
            <SNSMetricsStep 
              businessType={valuationData.businessType as 'youtube' | 'instagram' | 'tiktok'} 
              onNext={handleNext} 
              previousData={valuationData} 
            />
          )}
          {currentStep === 5 && isSNSBusiness && <BusinessAgeStep onNext={handleNext} />}
        </div>
      </div>
    </div>
  );
}

// Step 1: 비즈니스 타입 선택 (토스 스타일)
function BusinessTypeStep({ onNext }: { onNext: (data: any) => void }) {
  const [selected, setSelected] = useState('');
  
  const businessTypes = [
    { id: 'youtube', name: '유튜브', icon: '📺', desc: '구독자 10만 기준 평균 3억', multiple: 'x2.5' },
    { id: 'instagram', name: '인스타그램', icon: '📷', desc: '팔로워 5만 기준 평균 1.5억', multiple: 'x2.0' },
    { id: 'tiktok', name: '틱톡', icon: '🎵', desc: '팔로워 10만 기준 평균 2억', multiple: 'x1.8' },
    { id: 'blog', name: '블로그', icon: '✍️', desc: '일 방문 1만 기준 평균 2억', multiple: 'x1.8' },
    { id: 'ecommerce', name: '이커머스', icon: '🛍️', desc: '월 매출 5천만 기준 평균 5억', multiple: 'x1.2' },
    { id: 'saas', name: 'SaaS', icon: '💻', desc: 'MRR 2천만 기준 평균 9.6억', multiple: 'x4.0' },
    { id: 'website', name: '웹사이트', icon: '🌐', desc: '월 매출 1천만 기준 평균 3억', multiple: 'x2.2' }
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
  
  const handleRateChange = (rate: string) => {
    setProfitRate(rate);
    const calculatedProfit = Math.round(revenue * Number(rate) / 100);
    setProfit(String(calculatedProfit));
  };
  
  const rate = revenue ? Math.round((Number(profit) / revenue) * 100) : 0;
  
  const getRateFeedback = () => {
    if (rate > 40) return '💎 수익률 40% 이상! 최상위 5%';
    if (rate > 30) return '🏆 수익률 30% 이상! 상위 10%';
    if (rate > 20) return '✨ 수익률 20% 이상! 상위 30%';
    if (rate > 10) return '👍 안정적인 수익률!';
    return '💡 업계 평균 수익률: 25%';
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
            placeholder="25"
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

// Step 4: 운영 기간 (프리미엄 메시지)
function BusinessAgeStep({ onNext }: { onNext: (data: any) => void }) {
  const [selected, setSelected] = useState('');
  
  const ageOptions = [
    { id: 'new', label: '6개월 미만', desc: '🌱 신규 비즈니스', premium: '기본 가치' },
    { id: 'growing', label: '6개월 ~ 1년', desc: '🌿 성장기', premium: '성장 프리미엄 +5%' },
    { id: 'established', label: '1년 ~ 3년', desc: '🌳 안정기', premium: '안정 프리미엄 +10%' },
    { id: 'mature', label: '3년 이상', desc: '🏢 검증됨', premium: '검증 프리미엄 +20%' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        비즈니스 운영 기간은?
      </h2>
      <p className="text-gray-600 mb-8">
        오래될수록 가치가 올라가요
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
              <div className="text-left">
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500">{option.desc}</div>
              </div>
              <div className="text-xs font-bold text-green-600">{option.premium}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}