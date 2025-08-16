'use client';

import { useState } from 'react';
import BusinessTypeStep from '@/components/steps/BusinessTypeStep';
import RevenueStep from '@/components/steps/RevenueStep';
import TossProgress from '@/components/toss/TossProgress';
import TossButton from '@/components/toss/TossButton';

export default function DebugPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    businessType: '',
    monthlyRevenue: 0,
    monthlyProfit: 0,
    subscribers: 0,
    growthRate: '',
    businessAge: ''
  });

  const updateAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    console.log('Answer updated:', key, value);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
    console.log('Moving to step:', currentStep + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 디버깅 페이지</h1>
        
        {/* 상태 확인 */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 현재 상태</h2>
          <div className="space-y-2">
            <div><strong>현재 단계:</strong> {currentStep}</div>
            <div><strong>비즈니스 타입:</strong> {answers.businessType || '미선택'}</div>
            <div><strong>월 매출:</strong> {answers.monthlyRevenue.toLocaleString()}원</div>
            <div><strong>월 수익:</strong> {answers.monthlyProfit.toLocaleString()}원</div>
          </div>
        </div>

        {/* 컴포넌트 테스트 */}
        <div className="space-y-8">
          {/* TossProgress 테스트 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">TossProgress 컴포넌트</h2>
            <TossProgress 
              current={currentStep} 
              total={6}
              label="테스트 라벨"
              animated
            />
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                이전
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                다음
              </button>
            </div>
          </div>

          {/* TossButton 테스트 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">TossButton 컴포넌트</h2>
            <div className="space-y-3">
              <TossButton variant="primary" fullWidth onClick={() => alert('Primary')}>
                Primary Button
              </TossButton>
              <TossButton variant="secondary" fullWidth onClick={() => alert('Secondary')}>
                Secondary Button
              </TossButton>
              <TossButton variant="ghost" fullWidth onClick={() => alert('Ghost')}>
                Ghost Button
              </TossButton>
            </div>
          </div>

          {/* BusinessTypeStep 테스트 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">BusinessTypeStep 컴포넌트</h2>
            <BusinessTypeStep 
              value={answers}
              onChange={updateAnswer}
              onNext={handleNext}
            />
          </div>

          {/* RevenueStep 테스트 */}
          {answers.businessType && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">RevenueStep 컴포넌트</h2>
              <RevenueStep 
                value={answers}
                onChange={updateAnswer}
                onNext={handleNext}
              />
            </div>
          )}
        </div>

        {/* 링크 */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🔗 링크</h2>
          <div className="space-y-2">
            <a href="/" className="block text-blue-500 hover:underline">→ 홈페이지</a>
            <a href="/valuation" className="block text-blue-500 hover:underline">→ 실제 Valuation 페이지</a>
            <a href="/valuation/test" className="block text-blue-500 hover:underline">→ 테스트 페이지</a>
          </div>
        </div>
      </div>
    </div>
  );
}