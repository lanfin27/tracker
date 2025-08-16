'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useValuationStore } from '@/lib/store';
import { BusinessAge } from '@/types/valuation';
import { Sprout, Leaf, TreePine, Building } from 'lucide-react';

interface Step6Props {
  onNext: () => void;
}

export default function Step6Age({ onNext }: Step6Props) {
  const { setInput } = useValuationStore();

  const ageOptions = [
    {
      age: 'new' as BusinessAge,
      icon: Sprout,
      label: '6개월 미만',
      description: '이제 막 시작한 단계',
      color: 'hover:border-green-400 hover:bg-green-50'
    },
    {
      age: 'growing' as BusinessAge,
      icon: Leaf,
      label: '6개월-1년',
      description: '초기 성장 단계',
      color: 'hover:border-green-500 hover:bg-green-50'
    },
    {
      age: 'established' as BusinessAge,
      icon: TreePine,
      label: '1-3년',
      description: '안정화 단계',
      color: 'hover:border-green-600 hover:bg-green-50'
    },
    {
      age: 'mature' as BusinessAge,
      icon: Building,
      label: '3년 이상',
      description: '성숙한 비즈니스',
      color: 'hover:border-green-700 hover:bg-green-50'
    }
  ];

  const handleSelect = (age: BusinessAge) => {
    setInput({ businessAge: age });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          비즈니스 운영 기간은?
        </h2>
        <p className="text-gray-600">
          실제 운영을 시작한 시점 기준입니다
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ageOptions.map(({ age, icon: Icon, label, description, color }) => (
          <Card
            key={age}
            className={`cursor-pointer transition-all border-2 ${color}`}
            onClick={() => handleSelect(age)}
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