'use client';

import { useState, useEffect } from 'react';
import { useValuationStore } from '@/lib/store';
import { getRevenueSuggestion, validateInput, getBenchmarkData } from '@/lib/smart-suggestions';
import TossInput from '@/components/core/TossInput';
import TossButton from '@/components/core/TossButton';
import TossStepLayout from './TossStepLayout';
import { motion } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';
import { useHapticFeedback } from '@/hooks/useAccessibility';

interface Step2Props {
  onNext: () => void;
}

export default function TossStep2Revenue({ onNext }: Step2Props) {
  const { input, setInput } = useValuationStore();
  const [revenue, setRevenue] = useState(input.monthlyRevenue?.toString() || '');
  const [hasNoRevenue, setHasNoRevenue] = useState(false);
  const [error, setError] = useState<string>();
  const [warning, setWarning] = useState<string>();
  const haptic = useHapticFeedback();

  const suggestion = input.businessType 
    ? getRevenueSuggestion(input.businessType, input.subscribers)
    : null;

  const benchmark = input.businessType 
    ? getBenchmarkData(input.businessType)
    : null;

  useEffect(() => {
    if (revenue) {
      const numericValue = parseInt(revenue);
      const validation = validateInput('revenue', numericValue, input.businessType);
      setError(validation.error);
      setWarning(validation.warning);
    }
  }, [revenue, input.businessType]);

  const handleSubmit = () => {
    if (hasNoRevenue) {
      setInput({ monthlyRevenue: 0 });
      haptic.success();
    } else {
      const numericRevenue = parseInt(revenue);
      if (!isNaN(numericRevenue)) {
        setInput({ monthlyRevenue: numericRevenue });
        haptic.success();
      }
    }
    onNext();
  };

  const handleNoRevenue = () => {
    setHasNoRevenue(true);
    setRevenue('0');
    setError(undefined);
    setWarning('매출이 없으면 가치 평가가 제한적일 수 있습니다');
    haptic.selection();
  };

  const isValid = hasNoRevenue || (revenue && parseInt(revenue) >= 0 && !error);

  return (
    <TossStepLayout
      currentStep={2}
      totalSteps={6}
      title="최근 3개월 평균 월 매출은?"
      subtitle="대략적인 금액을 입력해주세요"
      onNext={onNext}
      showHelp
    >
      <div className="space-y-6">
        {/* 벤치마크 정보 */}
        {benchmark && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="toss-caption mb-2">{input.businessType} 업종 평균</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">하위 25%</p>
                    <p className="font-medium">{benchmark.revenue.low.toLocaleString()}원</p>
                  </div>
                  <div className="border-x border-gray-200">
                    <p className="text-xs text-gray-500">평균</p>
                    <p className="font-medium text-blue-600">{benchmark.revenue.average.toLocaleString()}원</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">상위 25%</p>
                    <p className="font-medium">{benchmark.revenue.high.toLocaleString()}원</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 매출 입력 */}
        <TossInput
          id="revenue"
          label="월 평균 매출"
          type="text"
          placeholder="1,000,000"
          value={revenue}
          onChange={setRevenue}
          autoFormat="currency"
          error={error}
          helper={warning || (revenue && `연 매출: 약 ${(parseInt(revenue) * 12).toLocaleString()}원`)}
          disabled={hasNoRevenue}
          autoFocus
          suggestion={suggestion ? {
            value: suggestion.value.toString(),
            label: suggestion.label
          } : undefined}
          onSuggestionAccept={() => haptic.selection()}
          aria-label="월 평균 매출 입력"
        />

        {/* 매출 없음 버튼 */}
        <TossButton
          variant={hasNoRevenue ? 'primary' : 'secondary'}
          size="full"
          onClick={handleNoRevenue}
          disabled={hasNoRevenue}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          아직 매출이 없어요
        </TossButton>

        {/* 다음 버튼 */}
        <TossButton
          variant="primary"
          size="full"
          onClick={handleSubmit}
          disabled={!isValid}
          data-action="next"
        >
          다음
        </TossButton>
      </div>
    </TossStepLayout>
  );
}