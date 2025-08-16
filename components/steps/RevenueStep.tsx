'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TossInput from '@/components/toss/TossInput';
import TossButton from '@/components/toss/TossButton';
import { TrendingUp } from 'lucide-react';

const businessRecommendations: Record<string, number> = {
  youtube: 2000000,
  instagram: 1500000,
  tiktok: 1000000,
  ecommerce: 5000000,
  saas: 3000000,
  blog: 500000,
  website: 1000000
};

export default function RevenueStep({ value, onChange, onNext }: any) {
  const [revenue, setRevenue] = useState(value.monthlyRevenue?.toString() || '');
  const [hasNoRevenue, setHasNoRevenue] = useState(false);
  const recommendation = businessRecommendations[value.businessType];

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setRevenue(val);
    onChange('monthlyRevenue', parseInt(val) || 0);
    setHasNoRevenue(false);
  };

  const handleNoRevenue = () => {
    setHasNoRevenue(true);
    setRevenue('0');
    onChange('monthlyRevenue', 0);
  };

  const handleUseRecommendation = () => {
    setRevenue(recommendation.toString());
    onChange('monthlyRevenue', recommendation);
    setHasNoRevenue(false);
  };

  const canProceed = revenue !== '' || hasNoRevenue;

  return (
    <div>
      <motion.h1 
        className="text-toss-h1 text-toss-gray-900 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        최근 3개월<br />평균 월 매출은?
      </motion.h1>
      
      <motion.p 
        className="text-toss-body text-toss-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        대략적인 금액을 입력해주세요
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TossInput
          label="월 평균 매출"
          type="text"
          value={revenue}
          onChange={handleRevenueChange}
          suffix="원"
          formatNumber
          placeholder="1,000,000"
          disabled={hasNoRevenue}
          recommendation={recommendation ? {
            text: `${value.businessType === 'youtube' ? '유튜브' : 
                   value.businessType === 'instagram' ? '인스타그램' : 
                   value.businessType === 'tiktok' ? '틱톡' : 
                   value.businessType === 'ecommerce' ? '이커머스' : 
                   value.businessType === 'saas' ? 'SaaS' : 
                   value.businessType === 'blog' ? '블로그' : '웹사이트'} 평균 매출`,
            value: recommendation,
            onUse: handleUseRecommendation
          } : undefined}
          helper={revenue && parseInt(revenue) > 0 ? 
            `연 매출: 약 ${(parseInt(revenue) * 12).toLocaleString()}원` : 
            undefined
          }
        />

        <div className="mt-6 space-y-3">
          <TossButton
            variant={hasNoRevenue ? 'primary' : 'secondary'}
            fullWidth
            onClick={handleNoRevenue}
            icon={<TrendingUp className="w-5 h-5" />}
          >
            아직 매출이 없어요
          </TossButton>
        </div>
      </motion.div>
    </div>
  );
}