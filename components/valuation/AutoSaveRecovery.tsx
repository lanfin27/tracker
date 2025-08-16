'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TossButton from '@/components/core/TossButton';
import { useRouter } from 'next/navigation';
import { useValuationStore } from '@/lib/store';
import { useAutoSave } from '@/hooks/useAutoSave';

export function AutoSaveRecovery() {
  const [showRecovery, setShowRecovery] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);
  const { setInput, setCurrentStep } = useValuationStore();
  const { restore, clear } = useAutoSave();
  const router = useRouter();

  useEffect(() => {
    const data = restore();
    if (data && data.input && Object.keys(data.input).length > 0) {
      setSavedData(data);
      setShowRecovery(true);
    }
  }, [restore]);

  const handleRestore = () => {
    if (savedData) {
      setInput(savedData.input);
      setCurrentStep(savedData.currentStep);
      router.push(`/valuation/step/${savedData.currentStep}`);
      setShowRecovery(false);
    }
  };

  const handleDiscard = () => {
    clear();
    setShowRecovery(false);
  };

  return (
    <AnimatePresence>
      {showRecovery && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <h3 className="toss-heading-4 mb-2">
              이전에 작성하던 내용이 있어요
            </h3>
            <p className="toss-body-2 text-gray-600 mb-4">
              {savedData?.currentStep}단계부터 이어서 작성하시겠어요?
            </p>
            <div className="flex gap-2">
              <TossButton
                variant="secondary"
                size="small"
                onClick={handleDiscard}
                className="flex-1"
              >
                새로 시작
              </TossButton>
              <TossButton
                variant="primary"
                size="small"
                onClick={handleRestore}
                className="flex-1"
              >
                이어서 작성
              </TossButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}