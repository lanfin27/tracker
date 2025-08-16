'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TossProgress from '@/components/toss/TossProgress';
import TossButton from '@/components/toss/TossButton';
import { ChevronLeft, ChevronRight, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { generateLiveNotification } from '@/lib/fake-data';

// 각 스텝 컴포넌트 import
import BusinessTypeStep from '@/components/steps/BusinessTypeStep';
import RevenueStep from '@/components/steps/RevenueStep';
import ProfitStep from '@/components/steps/ProfitStep';
import SubscriberStep from '@/components/steps/SubscriberStep';
import GrowthStep from '@/components/steps/GrowthStep';
import AgeStep from '@/components/steps/AgeStep';

// 타입 정의
interface ValuationAnswers {
  businessType: string;
  monthlyRevenue: number;
  monthlyProfit: number;
  subscribers: number;
  growthRate: string;
  businessAge: string;
}

export default function ValuationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<ValuationAnswers>({
    businessType: '',
    monthlyRevenue: 0,
    monthlyProfit: 0,
    subscribers: 0,
    growthRate: '',
    businessAge: ''
  });
  const [comparisonMessage, setComparisonMessage] = useState<string>('');
  const [showComparison, setShowComparison] = useState<boolean>(false);

  const totalSteps = 6;

  // 자동 저장
  useEffect(() => {
    const timer = setInterval(() => {
      if (answers) {
        localStorage.setItem('tracker_draft', JSON.stringify({
          step: currentStep,
          answers,
          timestamp: Date.now()
        }));
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentStep, answers]);

  // 드래프트 복구
  useEffect(() => {
    try {
      const draft = localStorage.getItem('tracker_draft');
      if (draft) {
        const data = JSON.parse(draft);
        if (data && data.answers && Date.now() - data.timestamp < 86400000) { // 24시간 이내
          if (confirm('이전에 작성하던 내용이 있어요. 이어서 작성하시겠어요?')) {
            setAnswers({
              businessType: data.answers.businessType || '',
              monthlyRevenue: data.answers.monthlyRevenue || 0,
              monthlyProfit: data.answers.monthlyProfit || 0,
              subscribers: data.answers.subscribers || 0,
              growthRate: data.answers.growthRate || '',
              businessAge: data.answers.businessAge || ''
            });
            setCurrentStep(data.step || 1);
          }
        }
      }
    } catch (error) {
      console.error('드래프트 복구 실패:', error);
    }
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!answers?.businessType;
      case 2: return (answers?.monthlyRevenue || 0) >= 0;
      case 3: return true; // 수익은 0일 수 있음
      case 4: return true; // 구독자는 선택사항
      case 5: return !!answers?.growthRate;
      case 6: return !!answers?.businessAge;
      default: return false;
    }
  };

  const handleNext = () => {
    // 단계별 비교 메시지 생성
    generateComparisonMessage();
    
    if (currentStep === 3 && !['youtube', 'instagram', 'tiktok'].includes(answers?.businessType || '')) {
      setCurrentStep(5); // SNS가 아니면 구독자 단계 건너뛰기
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 결과 페이지로 이동
      if (answers) {
        localStorage.setItem('valuation_answers', JSON.stringify(answers));
      }
      router.push('/valuation/result');
    }
  };

  const generateComparisonMessage = () => {
    let message = '';
    
    switch(currentStep) {
      case 2: // 월 매출 입력 후
        if (answers.monthlyRevenue > 10000000) {
          message = '💡 상위 20% 매출! 대부분의 사용자보다 높은 매출을 기록하고 계시네요.';
        } else if (answers.monthlyRevenue > 5000000) {
          message = '📊 평균 이상의 매출입니다. 성장 가능성이 보입니다.';
        } else {
          message = '🚀 초기 단계 비즈니스군요. 가치 측정이 더욱 중요합니다.';
        }
        break;
      
      case 3: // 월 수익 입력 후
        const profitMargin = answers.monthlyRevenue > 0 ? 
          (answers.monthlyProfit / answers.monthlyRevenue) * 100 : 0;
        if (profitMargin > 30) {
          message = '🎯 뛰어난 수익률! 같은 업종 평균 15%를 크게 상회합니다.';
        } else if (profitMargin > 15) {
          message = '✅ 건전한 수익 구조입니다. 업계 평균 수준이에요.';
        } else {
          message = '📈 수익 개선 여지가 있습니다. 정확한 가치 측정이 필요해요.';
        }
        break;
      
      case 4: // 구독자 입력 후
        if (answers.subscribers > 100000) {
          message = '🏆 메가 인플루언서 수준! 상위 1% 크리에이터입니다.';
        } else if (answers.subscribers > 10000) {
          message = '⭐ 마이크로 인플루언서! 높은 참여율이 기대됩니다.';
        } else {
          message = '🌱 성장 초기 단계. 지금이 가치 측정 최적기입니다.';
        }
        break;
    }
    
    if (message) {
      setComparisonMessage(message);
      setShowComparison(true);
      setTimeout(() => setShowComparison(false), 4000);
    }
  };

  const handleBack = () => {
    if (currentStep === 5 && !['youtube', 'instagram', 'tiktok'].includes(answers?.businessType || '')) {
      setCurrentStep(3); // SNS가 아니면 구독자 단계 건너뛰기
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const updateAnswer = (key: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStepLabel = (step: number) => {
    const labels = {
      1: '비즈니스 선택',
      2: '월 매출',
      3: '월 수익',
      4: '구독자/팔로워',
      5: '성장률',
      6: '운영 기간'
    };
    return labels[step as keyof typeof labels] || '';
  };

  const renderStep = () => {
    const props = {
      value: answers || { businessType: '', monthlyRevenue: 0, monthlyProfit: 0, subscribers: 0, growthRate: '', businessAge: '' },
      onChange: updateAnswer,
      onNext: handleNext
    };

    try {
      switch (currentStep) {
        case 1: return <BusinessTypeStep {...props} />;
        case 2: return <RevenueStep {...props} />;
        case 3: return <ProfitStep {...props} />;
        case 4: return <SubscriberStep {...props} />;
        case 5: return <GrowthStep {...props} />;
        case 6: return <AgeStep {...props} />;
        default: return <div>알 수 없는 단계입니다.</div>;
      }
    } catch (error) {
      console.error('Step render error:', error);
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          <p>단계 {currentStep} 렌더링 중 오류가 발생했습니다.</p>
          <p className="text-sm mt-2">{String(error)}</p>
        </div>
      );
    }
  };

  // 디버그 정보 표시
  const showDebug = false; // 개발 중에만 true로 설정

  return (
    <div className="min-h-screen bg-white">
      {/* 디버그 정보 */}
      {showDebug && answers && (
        <div className="fixed top-0 right-0 p-2 bg-black text-white text-xs z-[100] rounded-bl">
          <div>현재 단계: {currentStep}</div>
          <div>비즈니스: {answers?.businessType || '미선택'}</div>
          <div>매출: {answers?.monthlyRevenue || 0}</div>
          <div>컴포넌트 로드: ✓</div>
        </div>
      )}

      {/* 상단 프로그레스 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[480px] mx-auto px-6 py-4">
          <TossProgress 
            current={currentStep} 
            total={totalSteps}
            label={getStepLabel(currentStep)}
            animated
          />
        </div>
      </div>

      {/* 실시간 알림 (step 2 이상에서만) */}
      {currentStep >= 2 && (
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>지금 이 순간 {Math.floor(Math.random() * 20 + 10)}명이 측정 중</span>
          </div>
        </motion.div>
      )}

      {/* 비교 메시지 */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[480px] mx-auto px-6 py-3"
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-800">
                {comparisonMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 콘텐츠 영역 */}
      <div className="max-w-[480px] mx-auto px-6 py-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* 단계별 도움말 */}
        {currentStep === totalSteps && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  마지막 단계입니다!
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  결과 페이지에서 상세한 분석과 EXIT 전략을 확인하세요.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 하단 액션 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-[480px] mx-auto">
          <div className="flex gap-3 p-6">
            {currentStep > 1 && (
              <TossButton
                variant="secondary"
                size="lg"
                onClick={handleBack}
                className="w-14"
              >
                <ChevronLeft className="w-5 h-5" />
              </TossButton>
            )}
            
            <TossButton
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canProceed()}
              onClick={handleNext}
              icon={<ChevronRight className="w-5 h-5" />}
            >
              {currentStep === totalSteps ? '결과 확인' : '다음'}
            </TossButton>
          </div>
        </div>
      </div>
    </div>
  );
}