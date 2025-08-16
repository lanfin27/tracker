'use client';

import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StepLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onBack?: () => void;
}

export default function StepLayout({ currentStep, totalSteps, children, onBack }: StepLayoutProps) {
  const router = useRouter();
  const progress = (currentStep / totalSteps) * 100;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      router.push(`/valuation/step/${currentStep - 1}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </Button>
            <span className="text-sm text-gray-600">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}