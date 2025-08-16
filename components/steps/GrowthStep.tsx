'use client';

import { motion } from 'framer-motion';
import { Rocket, TrendingUp, ArrowRight, TrendingDown } from 'lucide-react';

const growthOptions = [
  { 
    id: 'rapid', 
    label: '급성장 중', 
    description: '월 20% 이상 성장',
    icon: Rocket,
    color: 'from-green-500 to-emerald-600'
  },
  { 
    id: 'steady', 
    label: '꾸준히 성장', 
    description: '월 10-20% 성장',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'stable', 
    label: '안정적', 
    description: '월 5-10% 성장',
    icon: ArrowRight,
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'declining', 
    label: '정체/하락', 
    description: '성장 정체 또는 하락',
    icon: TrendingDown,
    color: 'from-red-500 to-red-600'
  }
];

export default function GrowthStep({ value, onChange, onNext }: any) {
  const handleSelect = (growthRate: string) => {
    onChange('growthRate', growthRate);
    
    // 햅틱 피드백
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // 자동 다음 단계
    setTimeout(onNext, 300);
  };

  return (
    <div>
      <motion.h1 
        className="text-toss-h1 text-toss-gray-900 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        최근 6개월<br />성장세는 어떤가요?
      </motion.h1>
      
      <motion.p 
        className="text-toss-body text-toss-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        매출 또는 구독자 기준으로 선택해주세요
      </motion.p>

      <div className="space-y-3">
        {growthOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(option.id)}
              className={`
                w-full p-5 bg-white border-2 rounded-toss-lg text-left
                hover:border-toss-blue hover:bg-toss-blue-lighter
                active:scale-[0.98] transition-all duration-200
                ${value.growthRate === option.id ? 'border-toss-blue bg-toss-blue-lighter' : 'border-toss-gray-100'}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-toss-md bg-gradient-to-br ${option.color}
                  flex items-center justify-center text-white
                `}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-toss-gray-900 text-toss-body">
                    {option.label}
                  </div>
                  <div className="text-toss-caption text-toss-gray-600 mt-1">
                    {option.description}
                  </div>
                </div>

                {value.growthRate === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-toss-blue text-white rounded-full flex items-center justify-center"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}