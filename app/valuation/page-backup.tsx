'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TossProgress from '@/components/toss/TossProgress';
import TossButton from '@/components/toss/TossButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 각 스텝 컴포넌트 import
import BusinessTypeStep from '@/components/steps/BusinessTypeStep';
import RevenueStep from '@/components/steps/RevenueStep';
import ProfitStep from '@/components/steps/ProfitStep';
import SubscriberStep from '@/components/steps/SubscriberStep';
import GrowthStep from '@/components/steps/GrowthStep';
import AgeStep from '@/components/steps/AgeStep';

export default function ValuationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    businessType: '',
    monthlyRevenue: 0,
    monthlyProfit: 0,
    subscribers: 0,
    growthRate: '',
    businessAge: ''
  });

  const totalSteps = 6;

  // 자동 저장
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('tracker_draft', JSON.stringify({
        step: currentStep,
        answers,
        timestamp: Date.now()
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, [currentStep, answers]);

  // 드래프트 복구
  useEffect(() => {
    const draft = localStorage.getItem('tracker_draft');
    if (draft) {
      const data = JSON.parse(draft);
      if (Date.now() - data.timestamp < 86400000) { // 24시간 이내
        if (confirm('이전에 작성하던 내용이 있어요. 이어서 작성하시겠어요?')) {
          setAnswers(data.answers);
          setCurrentStep(data.step);
        }
      }
    }
  }, []);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed()) {
        handleNext();
      } else if (e.key === 'Escape' && currentStep > 1) {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, answers]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!answers.businessType;
      case 2: return answers.monthlyRevenue >= 0;
      case 3: return true; // 수익은 0일 수 있음
      case 4: return true; // 구독자는 선택사항
      case 5: return !!answers.growthRate;
      case 6: return !!answers.businessAge;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 3 && !['youtube', 'instagram', 'tiktok'].includes(answers.businessType)) {
      setCurrentStep(5); // SNS가 아니면 구독자 단계 건너뛰기
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 결과 페이지로 이동
      localStorage.setItem('valuation_answers', JSON.stringify(answers));
      router.push('/valuation/result');
    }
  };

  const handleBack = () => {
    if (currentStep === 5 && !['youtube', 'instagram', 'tiktok'].includes(answers.businessType)) {
      setCurrentStep(3); // SNS가 아니면 구독자 단계 건너뛰기
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const updateAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
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
      value: answers,
      onChange: updateAnswer,
      onNext: handleNext
    };

    switch (currentStep) {
      case 1: return <BusinessTypeStep {...props} />;
      case 2: return <RevenueStep {...props} />;
      case 3: return <ProfitStep {...props} />;
      case 4: return <SubscriberStep {...props} />;
      case 5: return <GrowthStep {...props} />;
      case 6: return <AgeStep {...props} />;
      default: return null;
    }
  };

  return (
    <div className="toss-container">
      {/* 상단 프로그레스 */}
      <div className="sticky top-0 z-50 bg-white border-b border-toss-gray-100">
        <div className="px-6 py-4">
          <TossProgress 
            current={currentStep} 
            total={totalSteps}
            label={getStepLabel(currentStep)}
            animated
          />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-6 py-8 pb-32">
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
      </div>

      {/* 하단 액션 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-toss-gray-100">
        <div className="toss-container">
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