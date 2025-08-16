'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useAccessibility, useHapticFeedback } from '@/hooks/useAccessibility';
import TossButton from '@/components/core/TossButton';

interface TossStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  showHelp?: boolean;
}

export default function TossStepLayout({
  currentStep,
  totalSteps,
  children,
  onNext,
  onBack,
  title,
  subtitle,
  showHelp = false
}: TossStepLayoutProps) {
  const router = useRouter();
  const { announceToScreenReader } = useAccessibility({ enableKeyboardNav: true });
  const haptic = useHapticFeedback();
  const [helpOpen, setHelpOpen] = useState(false);
  const progress = (currentStep / totalSteps) * 100;

  // 스와이프 제스처
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (onNext) {
        haptic.selection();
        onNext();
      }
    },
    onSwipedRight: () => {
      if (onBack) {
        haptic.selection();
        onBack();
      } else {
        handleBack();
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50
  });

  const handleBack = () => {
    haptic.selection();
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      router.push(`/valuation/step/${currentStep - 1}`);
    } else {
      router.push('/');
    }
  };

  // 페이지 진입 시 스크린리더 안내
  useEffect(() => {
    const message = `${currentStep}단계 중 ${currentStep}단계. ${title || ''}. ${subtitle || ''}`;
    announceToScreenReader(message);
  }, [currentStep, totalSteps, title, subtitle, announceToScreenReader]);

  const springTransition = {
    type: "spring" as const,
    stiffness: 500,
    damping: 30
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" {...handlers}>
      {/* 헤더 */}
      <header 
        className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100"
        role="navigation"
        aria-label="진행 상황"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <TossButton
              variant="ghost"
              size="small"
              onClick={handleBack}
              aria-label="이전 단계로"
              data-action="prev"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              이전
            </TossButton>

            <span className="toss-caption" aria-live="polite">
              {currentStep} / {totalSteps}
            </span>

            {showHelp && (
              <TossButton
                variant="ghost"
                size="small"
                onClick={() => setHelpOpen(!helpOpen)}
                aria-label="도움말"
              >
                <HelpCircle className="w-5 h-5" />
              </TossButton>
            )}
          </div>

          {/* 진행 바 */}
          <div className="pb-2">
            <div 
              className="h-1 bg-gray-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={springTransition}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main 
        className="container mx-auto px-4 py-8 max-w-xl"
        role="main"
        aria-label="단계 콘텐츠"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={springTransition}
            className="relative"
          >
            {/* 제목 영역 */}
            {(title || subtitle) && (
              <div className="mb-8 text-center">
                {title && (
                  <h1 className="toss-heading-2 mb-2">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="toss-body-2 text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* 콘텐츠 */}
            <div className="animate-fade-in">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 도움말 모달 */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={springTransition}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="toss-heading-4 mb-4">키보드 단축키</h2>
              <ul className="space-y-2 toss-body-2">
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Enter</kbd>
                  <span className="ml-2">다음 단계</span>
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">ESC</kbd>
                  <span className="ml-2">이전 단계</span>
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">1-9</kbd>
                  <span className="ml-2">옵션 선택</span>
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">←/→</kbd>
                  <span className="ml-2">이전/다음 이동</span>
                </li>
              </ul>
              <TossButton
                variant="primary"
                size="full"
                className="mt-6"
                onClick={() => setHelpOpen(false)}
              >
                확인
              </TossButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}