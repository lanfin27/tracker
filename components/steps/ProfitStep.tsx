'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TossInput from '@/components/toss/TossInput';
import TossButton from '@/components/toss/TossButton';
import { Calculator } from 'lucide-react';

const profitMargins: Record<string, number> = {
  youtube: 40,
  instagram: 40,
  tiktok: 35,
  ecommerce: 20,
  saas: 70,
  blog: 80,
  website: 70
};

export default function ProfitStep({ value, onChange, onNext }: any) {
  const [profit, setProfit] = useState(value.monthlyProfit?.toString() || '');
  const [selectedMargin, setSelectedMargin] = useState(profitMargins[value.businessType] || 30);
  
  const suggestedProfit = Math.round(value.monthlyRevenue * (selectedMargin / 100));

  const handleProfitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setProfit(val);
    onChange('monthlyProfit', parseInt(val) || 0);
  };

  const handleUseCalculated = () => {
    setProfit(suggestedProfit.toString());
    onChange('monthlyProfit', suggestedProfit);
  };

  const marginButtons = [10, 20, 30, 40, 50];

  return (
    <div>
      <motion.h1 
        className="text-toss-h1 text-toss-gray-900 mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        월 평균<br />순수익은?
      </motion.h1>
      
      <motion.p 
        className="text-toss-body text-toss-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        비용을 제외한 순수익을 입력해주세요
      </motion.p>

      {value.monthlyRevenue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 bg-toss-blue-lighter rounded-toss-lg"
        >
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-toss-blue" />
            <span className="text-toss-body font-medium text-toss-gray-900">
              간단 계산기
            </span>
          </div>
          
          <div className="flex gap-2 mb-3">
            {marginButtons.map(margin => (
              <button
                key={margin}
                onClick={() => setSelectedMargin(margin)}
                className={`
                  flex-1 py-2 rounded-toss-sm text-sm font-medium transition-all
                  ${selectedMargin === margin 
                    ? 'bg-toss-blue text-white' 
                    : 'bg-white text-toss-gray-700 hover:bg-toss-gray-50'}
                `}
              >
                {margin}%
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-toss-caption text-toss-gray-600">
              매출의 {selectedMargin}% = {suggestedProfit.toLocaleString()}원
            </span>
            <button
              onClick={handleUseCalculated}
              className="text-toss-blue font-medium text-sm hover:underline"
            >
              사용하기
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TossInput
          label="월 평균 순수익"
          type="text"
          value={profit}
          onChange={handleProfitChange}
          suffix="원"
          formatNumber
          placeholder="300,000"
          helper={profit && parseInt(profit) > 0 ? 
            `연 수익: 약 ${(parseInt(profit) * 12).toLocaleString()}원` : 
            undefined
          }
          error={parseInt(profit) > value.monthlyRevenue ? 
            '수익이 매출보다 클 수 없어요' : undefined
          }
        />
      </motion.div>
    </div>
  );
}