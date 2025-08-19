'use client';

const ageOptions = [
  { 
    id: 'new', 
    label: '6개월 미만', 
    description: '이제 막 시작한 단계',
    emoji: '🌱',
    message: '신규 비즈니스 프리미엄 +10%'
  },
  { 
    id: 'growing', 
    label: '6개월-1년', 
    description: '초기 성장 단계',
    emoji: '🌿',
    message: '성장기 최적 시기'
  },
  { 
    id: 'established', 
    label: '1-3년', 
    description: '안정화 단계',
    emoji: '🌳',
    message: '안정기 진입, 가치 상승 중'
  },
  { 
    id: 'mature', 
    label: '3년 이상', 
    description: '성숙한 비즈니스',
    emoji: '🏢',
    message: '검증된 비즈니스! 프리미엄 +20%'
  }
];

export default function AgeStep({ value, onChange, onNext }: any) {
  const handleSelect = (age: string) => {
    onChange('businessAge', age);
    setTimeout(onNext, 200);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        비즈니스 운영 기간을 선택해주세요
      </label>

      <div className="space-y-3">
        {ageOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
              value.businessAge === option.id
                ? 'border-[#1A8917] bg-green-50'
                : 'border-gray-200 bg-white hover:border-[#1A8917] hover:bg-green-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{option.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
                <div className="text-sm text-green-600 mt-1 font-medium">{option.message}</div>
              </div>
              {value.businessAge === option.id && (
                <div className="w-6 h-6 bg-[#1A8917] text-white rounded-full flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}