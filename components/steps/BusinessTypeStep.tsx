'use client';

import { motion } from 'framer-motion';

const businessTypes = [
  { id: 'youtube', name: '유튜브', icon: '📺', badge: '1' },
  { id: 'instagram', name: '인스타그램', icon: '📷', badge: '2' },
  { id: 'tiktok', name: '틱톡', icon: '🎵', badge: '3' },
  { id: 'ecommerce', name: '이커머스', icon: '🛍️', badge: '4' },
  { id: 'saas', name: 'SaaS/앱', icon: '💻', badge: '5' },
  { id: 'blog', name: '블로그/콘텐츠', icon: '✍️', badge: '6' },
  { id: 'website', name: '웹사이트', icon: '🌐', badge: '7' }
];

export default function BusinessTypeStep({ value, onChange, onNext }: any) {
  const handleSelect = (type: string) => {
    onChange('businessType', type);
    
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
        어떤 비즈니스를<br />운영하시나요?
      </motion.h1>
      
      <motion.p 
        className="text-toss-body text-toss-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        가장 가까운 유형을 선택해주세요
      </motion.p>

      <div className="grid grid-cols-2 gap-3">
        {businessTypes.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelect(type.id)}
            className={`
              relative p-5 bg-white border-2 rounded-toss-lg
              hover:border-toss-blue hover:bg-toss-blue-lighter
              active:scale-[0.98] transition-all duration-200
              ${value.businessType === type.id ? 'border-toss-blue bg-toss-blue-lighter' : 'border-toss-gray-100'}
            `}
          >
            {/* 숫자 배지 */}
            <span className="absolute top-3 left-3 w-6 h-6 bg-toss-gray-700 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {type.badge}
            </span>
            
            {/* 선택 체크 */}
            {value.businessType === type.id && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-toss-blue text-white rounded-full flex items-center justify-center"
              >
                ✓
              </motion.span>
            )}
            
            <div className="text-3xl mb-2">{type.icon}</div>
            <div className="text-toss-body font-semibold text-toss-gray-900">
              {type.name}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}