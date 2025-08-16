'use client';

import { motion } from 'framer-motion';
import { Sprout, Leaf, TreePine, Building } from 'lucide-react';

const ageOptions = [
  { 
    id: 'new', 
    label: '6개월 미만', 
    description: '이제 막 시작한 단계',
    icon: Sprout,
    color: 'from-green-400 to-green-500'
  },
  { 
    id: 'growing', 
    label: '6개월-1년', 
    description: '초기 성장 단계',
    icon: Leaf,
    color: 'from-green-500 to-green-600'
  },
  { 
    id: 'established', 
    label: '1-3년', 
    description: '안정화 단계',
    icon: TreePine,
    color: 'from-green-600 to-green-700'
  },
  { 
    id: 'mature', 
    label: '3년 이상', 
    description: '성숙한 비즈니스',
    icon: Building,
    color: 'from-green-700 to-green-800'
  }
];

export default function AgeStep({ value, onChange, onNext }: any) {
  const handleSelect = (age: string) => {
    onChange('businessAge', age);
    
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
        비즈니스<br />운영 기간은?
      </motion.h1>
      
      <motion.p 
        className="text-toss-body text-toss-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        실제 운영을 시작한 시점 기준입니다
      </motion.p>

      <div className="space-y-3">
        {ageOptions.map((option, index) => {
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
                ${value.businessAge === option.id ? 'border-toss-blue bg-toss-blue-lighter' : 'border-toss-gray-100'}
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

                {value.businessAge === option.id && (
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