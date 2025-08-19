'use client';

import { useState, useEffect } from 'react';

export default function RevenueStep({ value, onChange, onNext }: any) {
  const [revenue, setRevenue] = useState(value.monthlyRevenue || '');
  const [dynamicMessage, setDynamicMessage] = useState('📊 같은 업종 평균: 500만원');

  useEffect(() => {
    const numValue = parseInt(revenue.toString().replace(/,/g, '')) || 0;
    if (numValue > 0) {
      const average = 500; // 평균 500만원
      if (numValue > average * 2) {
        setDynamicMessage(`🔥 대박! 평균의 ${Math.round(numValue/average)}배! 상위 5% 확정`);
      } else if (numValue > average * 1.5) {
        setDynamicMessage(`🎯 평균보다 ${Math.round((numValue/average - 1) * 100)}% 높습니다! 상위 10% 예상`);
      } else if (numValue > average) {
        setDynamicMessage(`✨ 평균 이상! 상위 30% 예상`);
      } else if (numValue > 0) {
        setDynamicMessage(`💡 같은 업종 평균: ${average}만원`);
      }
    } else {
      setDynamicMessage('📊 같은 업종 평균: 500만원');
    }
  }, [revenue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setRevenue(val);
  };

  const handleSubmit = () => {
    const numValue = parseInt(revenue.toString().replace(/,/g, '')) || 0;
    onChange('monthlyRevenue', numValue * 10000); // 만원 단위를 원으로 변환
    onNext();
  };

  return (
    <div>
      {/* 심리적 훅 메시지 박스 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-green-800">{dynamicMessage}</p>
      </div>
      
      <label className="block text-sm font-medium text-gray-700 mb-2">
        월 평균 매출
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={revenue}
          onChange={handleChange}
          placeholder="500"
          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-[#1A8917] focus:outline-none"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          만원
        </span>
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        최근 3개월 평균 매출을 입력해주세요
      </p>
      
      {revenue && parseInt(revenue) > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            연 매출: 약 {(parseInt(revenue) * 12 / 10000).toFixed(1)}억원
          </p>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={!revenue || parseInt(revenue) <= 0}
        className="w-full mt-6 bg-[#1A8917] text-white py-3 rounded-lg font-semibold hover:bg-[#147012] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </div>
  );
}