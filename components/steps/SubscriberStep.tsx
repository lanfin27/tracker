'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TossInput from '@/components/toss/TossInput';
import { Users } from 'lucide-react';

export default function SubscriberStep({ value, onChange, onNext }: any) {
  const [subscribers, setSubscribers] = useState(value.subscribers?.toString() || '');

  const handleSubscribersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setSubscribers(val);
    onChange('subscribers', parseInt(val) || 0);
  };

  const getLabel = () => {
    switch (value.businessType) {
      case 'youtube':
        return '구독자';
      case 'instagram':
      case 'tiktok':
        return '팔로워';
      default:
        return '구독자/팔로워';
    }
  };

  const getIcon = () => {
    switch (value.businessType) {
      case 'youtube':
        return '📺';
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '🎵';
      default:
        return '👥';
    }
  };

  return (
    <div>
      <motion.h1 
        className="text-toss-h1 text-toss-gray-900 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {getLabel()} 수는<br />얼마나 되나요?
      </motion.h1>
      
      <motion.p 
        className="text-toss-body text-toss-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        현재 {getLabel()} 수를 입력해주세요
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-toss-blue-lighter to-toss-blue-light rounded-full flex items-center justify-center text-4xl">
          {getIcon()}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TossInput
          label={`${getLabel()} 수`}
          type="text"
          value={subscribers}
          onChange={handleSubscribersChange}
          suffix="명"
          formatNumber
          placeholder="10,000"
          helper={subscribers && parseInt(subscribers) >= 10000 ? 
            `${(parseInt(subscribers) / 10000).toFixed(1)}만 ${getLabel()}` : 
            undefined
          }
        />

        {value.businessType === 'youtube' && parseInt(subscribers) >= 1000 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-toss-gray-50 rounded-toss-md"
          >
            <p className="text-toss-caption text-toss-gray-600">
              💡 구독자 {parseInt(subscribers).toLocaleString()}명은 
              {parseInt(subscribers) >= 100000 ? ' 실버버튼' : 
               parseInt(subscribers) >= 10000 ? ' 수익창출 가능' : 
               ' 커뮤니티 탭 활성화'} 수준이에요
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}