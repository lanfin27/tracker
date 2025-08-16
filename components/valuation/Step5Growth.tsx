'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useValuationStore } from '@/lib/store';
import { GrowthRate } from '@/types/valuation';
import { TrendingUp, TrendingDown, ArrowRight, Rocket } from 'lucide-react';

interface Step5Props {
  onNext: () => void;
}

export default function Step5Growth({ onNext }: Step5Props) {
  const { setInput } = useValuationStore();

  const growthOptions = [
    {
      rate: 'rapid' as GrowthRate,
      icon: Rocket,
      label: '급성장 중',
      description: '월 20% 이상 성장',
      color: 'hover:border-green-500 hover:bg-green-50'
    },
    {
      rate: 'steady' as GrowthRate,
      icon: TrendingUp,
      label: '꾸준히 성장',
      description: '월 10-20% 성장',
      color: 'hover:border-blue-500 hover:bg-blue-50'
    },
    {
      rate: 'stable' as GrowthRate,
      icon: ArrowRight,
      label: '안정적',
      description: '월 5-10% 성장',
      color: 'hover:border-yellow-500 hover:bg-yellow-50'
    },
    {
      rate: 'declining' as GrowthRate,
      icon: TrendingDown,
      label: '정체/하락',
      description: '성장 정체 또는 하락',
      color: 'hover:border-red-500 hover:bg-red-50'
    }
  ];

  const handleSelect = (rate: GrowthRate) => {
    setInput({ growthRate: rate });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          최근 6개월 성장세는?
        </h2>
        <p className="text-gray-600">
          매출 또는 구독자 기준으로 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {growthOptions.map(({ rate, icon: Icon, label, description, color }) => (
          <Card
            key={rate}
            className={`cursor-pointer transition-all border-2 ${color}`}
            onClick={() => handleSelect(rate)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{label}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}