'use client';

import { useRouter } from 'next/navigation';
import { useValuationStore } from '@/lib/store';
import StepLayout from '@/components/valuation/StepLayout';
import Step1BusinessType from '@/components/valuation/Step1BusinessType';
import Step2Revenue from '@/components/valuation/Step2Revenue';
import Step3Profit from '@/components/valuation/Step3Profit';
import Step4Subscribers from '@/components/valuation/Step4Subscribers';
import Step5Growth from '@/components/valuation/Step5Growth';
import Step6Age from '@/components/valuation/Step6Age';
import { useEffect } from 'react';

export default function ValuationStep({ params }: { params: { step: string } }) {
  const router = useRouter();
  const { input, setCurrentStep } = useValuationStore();
  const currentStep = parseInt(params.step);

  useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

  const handleNext = () => {
    if (currentStep === 3 && ['YouTube', 'Instagram', 'TikTok'].includes(input.businessType || '')) {
      router.push('/valuation/step/4');
    } else if (currentStep === 3) {
      router.push('/valuation/step/5');
    } else if (currentStep === 6) {
      router.push('/valuation/result');
    } else {
      router.push(`/valuation/step/${currentStep + 1}`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BusinessType onNext={handleNext} />;
      case 2:
        return <Step2Revenue onNext={handleNext} />;
      case 3:
        return <Step3Profit onNext={handleNext} />;
      case 4:
        return <Step4Subscribers onNext={handleNext} />;
      case 5:
        return <Step5Growth onNext={handleNext} />;
      case 6:
        return <Step6Age onNext={handleNext} />;
      default:
        return null;
    }
  };

  const totalSteps = ['YouTube', 'Instagram', 'TikTok'].includes(input.businessType || '') ? 6 : 5;

  return (
    <StepLayout currentStep={currentStep} totalSteps={totalSteps}>
      {renderStep()}
    </StepLayout>
  );
}