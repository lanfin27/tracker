'use client';

import { useState, useEffect } from 'react';

export default function ProfitStep({ value, onChange, onNext }: any) {
  const [profit, setProfit] = useState(value.monthlyProfit || '');
  const [profitMessage, setProfitMessage] = useState('📈 업계 평균 수익률: 25%');
  const previousRevenue = (value.monthlyRevenue || 0) / 10000; // 원을 만원으로 변환

  const calculateProfitMessage = (profitValue: number, revenue: number) => {
    if (!revenue || !profitValue) return '📈 업계 평균 수익률: 25%';
    
    const rate = (profitValue / revenue) * 100;
    
    if (rate > 40) return '💎 수익률 40% 이상! 상위 5% 확정';
    if (rate > 30) return '🏆 수익률 30% 이상! 상위 10% 예상';
    if (rate > 20) return '✨ 수익률 20% 이상! 상위 30%';
    if (rate > 10) return '👍 안정적인 수익률입니다';
    return '💡 수익 개선이 필요할 수 있습니다';
  };

  useEffect(() => {
    const numValue = parseInt(profit.toString().replace(/,/g, '')) || 0;
    setProfitMessage(calculateProfitMessage(numValue, previousRevenue));
  }, [profit, previousRevenue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setProfit(val);
  };

  const handleRateHelper = (rate: number) => {
    const calculated = Math.round(previousRevenue * rate / 100);
    setProfit(calculated.toString());
  };

  const handleSubmit = () => {
    const numValue = parseInt(profit.toString().replace(/,/g, '')) || 0;
    onChange('monthlyProfit', numValue * 10000); // 만원 단위를 원으로 변환
    onNext();
  };

  return (
    <div>
      {/* 심리적 훅 메시지 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-green-800">{profitMessage}</p>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        월 평균 순수익
      </label>

      {/* 수익률 계산 도우미 */}
      {previousRevenue > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">💡 수익률 계산 도우미</p>
          <div className="flex gap-2 flex-wrap">
            {[10, 20, 25, 30, 40].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateHelper(rate)}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-green-50 hover:border-[#1A8917] transition-colors"
              >
                {rate}% = {Math.round(previousRevenue * rate / 100)}만원
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={profit}
          onChange={handleChange}
          placeholder={previousRevenue ? Math.round(previousRevenue * 0.25).toString() : '125'}
          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-[#1A8917] focus:outline-none"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          만원
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        세금과 모든 비용을 제외한 순수익을 입력해주세요
      </p>

      {profit && parseInt(profit) > 0 && previousRevenue > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            수익률: {((parseInt(profit) / previousRevenue) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            연 순수익: 약 {(parseInt(profit) * 12 / 10000).toFixed(1)}억원
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!profit || parseInt(profit) < 0}
        className="w-full mt-6 bg-[#1A8917] text-white py-3 rounded-lg font-semibold hover:bg-[#147012] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </div>
  );
}