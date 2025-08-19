'use client';

import { valuationMultiples } from '@/lib/valuation-multiples';

const businessTypes = [
  { id: 'youtube', name: '유튜브', icon: '📺', desc: '평균 3억', color: 'red' },
  { id: 'instagram', name: '인스타그램', icon: '📷', desc: '평균 1.5억', color: 'purple' },
  { id: 'tiktok', name: '틱톡', icon: '🎵', desc: '평균 1.8억', color: 'pink' },
  { id: 'ecommerce', name: '이커머스', icon: '🛍️', desc: '평균 5억', color: 'orange' },
  { id: 'saas', name: 'SaaS', icon: '💻', desc: '평균 9.6억', color: 'blue' },
  { id: 'blog', name: '블로그', icon: '✍️', desc: '평균 2억', color: 'green' },
  { id: 'website', name: '웹사이트', icon: '🌐', desc: '평균 3억', color: 'indigo' }
];

export default function BusinessTypeStep({ value, onChange, onNext }: any) {
  const handleSelect = (type: string) => {
    onChange('businessType', type);
    setTimeout(onNext, 200);
  };

  return (
    <div className="animate-slideUp">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        어떤 비즈니스를 운영하시나요?
      </h2>
      <p className="text-gray-600 mb-8">
        업종에 따른 정확한 가치 측정을 위해 필요해요
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {businessTypes.map((type) => {
          const bgColor = type.color === 'red' ? 'bg-red-50' :
                          type.color === 'purple' ? 'bg-purple-50' :
                          type.color === 'pink' ? 'bg-pink-50' :
                          type.color === 'orange' ? 'bg-orange-50' :
                          type.color === 'blue' ? 'bg-blue-50' :
                          type.color === 'green' ? 'bg-green-50' :
                          type.color === 'indigo' ? 'bg-indigo-50' : 'bg-gray-50';
          
          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={`
                group relative bg-white border-2 rounded-2xl p-4 transition-all duration-200
                ${value.businessType === type.id 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200 hover:border-blue-500 hover:shadow-md'}
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {type.icon}
                </div>
                <div className="text-sm font-semibold text-gray-900">{type.name}</div>
                <div className="text-xs text-gray-500">{type.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}