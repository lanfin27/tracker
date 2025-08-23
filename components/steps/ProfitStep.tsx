'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { BusinessTypeMapping } from '@/lib/supabase-types';
import { REAL_PROFIT_MARGINS, getRealTimeProfitMargin, getProfitRateEvaluation } from '@/lib/profit-margins';

export default function ProfitStep({ value, onChange, onNext }: any) {
  const [profit, setProfit] = useState(value.monthlyProfit || '');
  const [industryAvgMargin, setIndustryAvgMargin] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>('');
  const [actualMargin, setActualMargin] = useState<number>(0);
  const previousRevenue = (value.monthlyRevenue || 0) / 10000; // 원을 만원으로 변환
  const businessType = value.businessType || 'website';

  // 컴포넌트 마운트 시 즉시 Supabase에서 데이터 가져오기
  useEffect(() => {
    fetchRealIndustryMargin();
  }, [businessType]);

  // 실제 데이터 기반 평균 수익률 가져오기
  const fetchRealIndustryMargin = async () => {
    console.log('🔄 실제 수익률 데이터 가져오는 중...');
    console.log('비즈니스 타입:', businessType);
    
    if (!businessType) {
      console.error('❌ 비즈니스 타입이 없음');
      setIndustryAvgMargin(12); // 기본값
      setDataSource('기본값');
      setLoading(false);
      return;
    }
    
    try {
      // 1. 먼저 실시간 데이터 시도
      const realtimeMargin = await getRealTimeProfitMargin(businessType);
      if (realtimeMargin > 0) {
        console.log(`✅ 실시간 데이터: ${businessType} = ${realtimeMargin}%`);
        setIndustryAvgMargin(realtimeMargin);
        setDataSource('실시간 Supabase 데이터');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('실시간 데이터 실패, 사전 계산값 사용');
    }
    
    // 2. 사전 계산된 실제 데이터 사용
    const realMargin = REAL_PROFIT_MARGINS[businessType as keyof typeof REAL_PROFIT_MARGINS];
    
    if (realMargin && realMargin > 0) {
      console.log(`📊 실제 데이터 기반: ${businessType} = ${realMargin}%`);
      setIndustryAvgMargin(realMargin);
      setDataSource('실제 거래 데이터 기반');
    } else {
      // 3. 최종 폴백 (실제 데이터 기반)
      const fallback = businessType === 'saas' ? 65 : 
                       businessType.includes('commerce') ? 29 : 
                       businessType === 'youtube' ? 57 :
                       businessType === 'instagram' ? 42 :
                       businessType === 'tiktok' ? 45 :
                       businessType === 'blog' ? 60 :
                       businessType === 'website' ? 46 : 45;
      console.log(`📌 폴백값: ${businessType} = ${fallback}% (실제 데이터 기반)`);
      setIndustryAvgMargin(fallback);
      setDataSource('예상값');
    }
    
    setLoading(false);
  };

  // 사용자 입력 수익률 계산
  useEffect(() => {
    const numValue = parseInt(profit.toString().replace(/,/g, '')) || 0;
    
    if (previousRevenue > 0 && numValue > 0) {
      const margin = (numValue / previousRevenue) * 100;
      setActualMargin(Math.round(margin));
    } else {
      setActualMargin(0);
    }
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
    
    console.log('📤 ProfitStep 전달 데이터:', {
      monthlyProfit: numValue * 10000,
      actualMargin,
      industryAvgMargin
    });
    
    onChange('monthlyProfit', numValue * 10000); // 만원 단위를 원으로 변환
    onNext();
  };

  // 동적 수익률 메시지 생성
  const getProfitMessage = () => {
    if (loading) {
      return '실제 거래 데이터 분석 중...';
    }
    
    if (!industryAvgMargin) {
      return '수익률 데이터 로딩 중...';
    }
    
    const avgRate = industryAvgMargin;
    
    if (actualMargin === 0) {
      return `업계 평균 수익률: ${avgRate}% (${dataSource})`;
    }
    
    // lib/profit-margins.ts의 평가 함수 사용
    return getProfitRateEvaluation(businessType, actualMargin);
  };

  // 동적 placeholder 계산 (industry average 기반, 절대 25% 아님)
  const getPlaceholder = () => {
    if (previousRevenue && industryAvgMargin) {
      return Math.round(previousRevenue * industryAvgMargin / 100).toString();
    }
    return '100'; // 기본값 100만원 (125 아님)
  };

  // 수익률 버튼 배열 생성 (industry average 기반)
  const getRateButtons = () => {
    if (!industryAvgMargin) return [5, 10, 15, 20, 30]; // 실제 데이터 기반 기본값
    
    return [
      Math.round(industryAvgMargin * 0.5),     // 50%
      Math.round(industryAvgMargin * 0.75),    // 75%
      industryAvgMargin,                        // 100%
      Math.round(industryAvgMargin * 1.3),     // 130%
      Math.round(industryAvgMargin * 1.6)      // 160%
    ].filter(rate => rate > 0 && rate <= 100); // 유효한 범위만
  };

  return (
    <div>
      {/* 수익률 정보 박스 */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <p className="text-sm text-green-800">실제 거래 데이터 분석 중...</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-green-800 font-medium">
              {getProfitMessage()}
            </p>
            {industryAvgMargin && actualMargin === 0 && (
              <p className="text-xs text-green-600 mt-1">
                💡 아래 도우미를 사용하거나 직접 입력하세요
              </p>
            )}
          </div>
        )}
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        월 평균 순수익
      </label>

      {/* 수익률 계산 도우미 */}
      {previousRevenue > 0 && !loading && industryAvgMargin && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-2">💡 수익률 계산 도우미</p>
          <div className="flex gap-2 flex-wrap">
            {getRateButtons().map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateHelper(rate)}
                className={`px-3 py-1 text-sm bg-white border rounded-lg transition-colors ${
                  rate === industryAvgMargin 
                    ? 'border-green-500 bg-green-50 font-medium' 
                    : 'border-gray-300 hover:bg-green-50 hover:border-[#1A8917]'
                }`}
              >
                {rate}% = {Math.round(previousRevenue * rate / 100)}만원
                {rate === industryAvgMargin && ' (평균)'}
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
          placeholder={getPlaceholder()}
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
            수익률: {actualMargin}%
            {industryAvgMargin && (
              <span className={`ml-2 font-medium ${
                actualMargin > industryAvgMargin ? 'text-green-600' : 'text-orange-600'
              }`}>
                (업계 평균: {industryAvgMargin}%)
              </span>
            )}
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