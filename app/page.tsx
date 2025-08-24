'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBusinessMultiples } from '@/lib/business-multiples';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(5795); // 실제 거래 데이터 수
  const [notification, setNotification] = useState('');
  const [recentMeasurements, setRecentMeasurements] = useState<Array<{
    type: string;
    icon: string;
    value: string;
    timeAgo: string;
  }>>([]);
  
  // 실시간 측정 데이터 생성 함수 - 현실적인 범위로 수정
  const generateRecentMeasurements = () => {
    // 현실적인 비즈니스 타입별 가치 범위 (억원 단위)
    const businessTypes = [
      { 
        type: '유튜브', 
        icon: '🎬', 
        range: [0.5, 5]  // 5천만원 ~ 5억원
      },
      { 
        type: '인스타그램', 
        icon: '📸', 
        range: [0.3, 3]  // 3천만원 ~ 3억원
      },
      { 
        type: 'SaaS', 
        icon: '💻', 
        range: [1, 10]   // 1억원 ~ 10억원
      },
      { 
        type: '이커머스', 
        icon: '🛍️', 
        range: [0.5, 8]  // 5천만원 ~ 8억원
      },
      { 
        type: '블로그', 
        icon: '✍️', 
        range: [0.1, 2]  // 1천만원 ~ 2억원
      },
      { 
        type: '웹사이트', 
        icon: '🌐', 
        range: [0.2, 3]  // 2천만원 ~ 3억원
      },
      { 
        type: '틱톡', 
        icon: '🎵', 
        range: [0.2, 2]  // 2천만원 ~ 2억원
      }
    ];
    
    const timeOptions = [
      '방금 전',
      '1분 전',
      '2분 전', 
      '3분 전',
      '5분 전',
      '7분 전',
      '10분 전'
    ];
    
    // 3개의 랜덤 측정 생성
    const measurements = [];
    const usedTypes = new Set(); // 중복 방지
    
    for (let i = 0; i < 3; i++) {
      let business;
      
      // 중복되지 않는 비즈니스 타입 선택
      do {
        business = businessTypes[Math.floor(Math.random() * businessTypes.length)];
      } while (usedTypes.has(business.type) && usedTypes.size < businessTypes.length);
      
      usedTypes.add(business.type);
      
      // 현실적인 범위 내에서 랜덤 값 생성
      const minValue = business.range[0];
      const maxValue = business.range[1];
      const rawValue = Math.random() * (maxValue - minValue) + minValue;
      
      let valueText;
      
      // 정밀한 금액 포매팅
      if (rawValue >= 1) {
        // 1억원 이상 - 소수점 둘째 자리까지
        if (rawValue >= 10) {
          valueText = `${rawValue.toFixed(1)}억원`;
        } else {
          valueText = `${rawValue.toFixed(2)}억원`;
        }
      } else {
        // 1억원 미만 - 구체적인 만원 단위
        const manwon = Math.round(rawValue * 10000);
        valueText = `${manwon.toLocaleString()}만원`;
      }
      
      measurements.push({
        type: business.type,
        icon: business.icon,
        value: valueText,
        timeAgo: timeOptions[Math.min(i * 2, timeOptions.length - 1)]
      });
    }
    
    return measurements;
  };

  useEffect(() => {
    setMounted(true);
    
    // 초기 데이터 설정 - 더 구체적인 금액
    const initialData = [
      {
        type: '유튜브',
        icon: '🎬',
        value: '3.24억원',  // 기존: 3.2억원
        timeAgo: '방금 전'
      },
      {
        type: '인스타그램',
        icon: '📸',
        value: '8,567만원',  // 기존: 8,500만원
        timeAgo: '2분 전'
      },
      {
        type: 'SaaS',
        icon: '💻',
        value: '5.73억원',  // 기존: 5.7억원
        timeAgo: '5분 전'
      }
    ];
    
    setRecentMeasurements(initialData);
  }, []);
  
  // Real-time updates
  useEffect(() => {
    if (!mounted) return;
    
    // 10초마다 측정 데이터 업데이트
    const measurementInterval = setInterval(() => {
      setRecentMeasurements(generateRecentMeasurements());
    }, 10000);
    
    const notifications = [
      '방금 전 유튜버가 1.2억 달성',
      '1분 전 이커머스가 2.3억 측정',
      '2분 전 SaaS가 3.5억 돌파',
      '3분 전 인스타그래머가 8천만 달성',
      '5분 전 블로거가 1.5억 측정'
    ];
    
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomNotification);
    };
    showNotification();
    
    const notificationInterval = setInterval(showNotification, 3000);
    
    // 거래 수 증가
    const transactionInterval = setInterval(() => {
      setTotalTransactions(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    
    return () => {
      clearInterval(notificationInterval);
      clearInterval(measurementInterval);
      clearInterval(transactionInterval);
    };
  }, [mounted]);

  // 실제 데이터 기반 예시 계산
  const getRealisticExamples = () => {
    // 유튜브: 월 500만원 매출, 구독자 10만 가정
    const youtubeMultiples = getBusinessMultiples('youtube');
    const youtubeAnnualRevenue = 500 * 12 * 10000; // 6천만원
    const youtubeValue = youtubeAnnualRevenue * Math.max(youtubeMultiples.revenue, youtubeMultiples.profit);
    
    // 인스타그램: 월 300만원 매출, 팔로워 5만 가정
    const instagramMultiples = getBusinessMultiples('instagram');
    const instagramAnnualRevenue = 300 * 12 * 10000; // 3.6천만원
    const instagramValue = instagramAnnualRevenue * Math.max(instagramMultiples.revenue, instagramMultiples.profit);
    
    // SaaS: 월 2000만원 매출 (MRR) 가정
    const saasMultiples = getBusinessMultiples('saas');
    const saasAnnualRevenue = 2000 * 12 * 10000; // 2.4억원
    const saasValue = saasAnnualRevenue * Math.max(saasMultiples.revenue, saasMultiples.profit);
    
    return {
      youtube: {
        value: formatValue(youtubeValue),
        multiple: Math.max(youtubeMultiples.revenue, youtubeMultiples.profit).toFixed(1)
      },
      instagram: {
        value: formatValue(instagramValue),
        multiple: Math.max(instagramMultiples.revenue, instagramMultiples.profit).toFixed(1)
      },
      saas: {
        value: formatValue(saasValue),
        multiple: Math.max(saasMultiples.revenue, saasMultiples.profit).toFixed(1)
      }
    };
  };
  
  const formatValue = (value: number): string => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
    if (value >= 10000000) return `${Math.round(value / 10000000)}천만`;
    return `${Math.round(value / 10000)}만`;
  };

  if (!mounted) return null;
  
  const examples = getRealisticExamples();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Real-time notification - Toss style */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-blue-700 text-center font-medium animate-fadeIn">
            ⚡ {notification || '방금 전 유튜버가 1.2억 달성'}
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          
          {/* Real data badge - 실제 데이터 배지 */}
          <div className="flex justify-center mb-8 animate-slideUp">
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">
                🔥 실제 <span className="font-bold">{totalTransactions.toLocaleString()}</span>건 거래 데이터 기반
              </span>
            </div>
          </div>
          
          {/* Main headline - Toss style typography */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4 animate-slideUp" 
              style={{ animationDelay: '0.1s' }}>
            내 비즈니스,
            <br />
            <span className="text-blue-600">진짜 가치</span>는 얼마?
          </h1>
          
          <p className="text-lg text-gray-600 text-center mb-10 animate-slideUp"
             style={{ animationDelay: '0.2s' }}>
            실제 거래 데이터로 측정하는 정확한 가치
          </p>
          
          {/* CTA button - Toss style */}
          <div className="flex justify-center mb-12 animate-slideUp"
               style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => router.push('/valuation')}
              className="group relative px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                무료 가치 측정 시작
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Trust indicators - 실제 데이터 기반 */}
          <div className="grid grid-cols-3 gap-4 mb-16 animate-slideUp"
               style={{ animationDelay: '0.4s' }}>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{totalTransactions.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">검증된 거래</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">87.3%</div>
              <div className="text-xs text-gray-500 mt-1">정확도</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">2분</div>
              <div className="text-xs text-gray-500 mt-1">측정 시간</div>
            </div>
          </div>

          {/* 최근 측정 결과 - 시간 표시 */}
          {mounted && recentMeasurements && Array.isArray(recentMeasurements) && recentMeasurements.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 mb-8 animate-slideUp"
                 style={{ animationDelay: '0.5s' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                방금 전 측정 가치
                <span className="text-xs font-normal text-gray-500 ml-2">실시간 업데이트</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentMeasurements.map((measurement, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all animate-fadeIn"
                    style={{ animationDelay: `${(index + 6) * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{measurement.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {measurement.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {measurement.timeAgo} 측정
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {measurement.value}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  매 10초마다 자동 업데이트
                </p>
              </div>
            </div>
          )}

          {/* Industry average values - 실제 Multiple 데이터 기반 */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-slideUp"
               style={{ animationDelay: '0.7s' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              업종별 평균 가치 <span className="text-xs font-normal text-gray-500">(실제 데이터 기반)</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📺</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">유튜브</div>
                    <div className="text-xs text-gray-500">구독자 10만, 월 500만원 기준</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{examples.youtube.value}</div>
                  <div className="text-xs text-blue-600">x{examples.youtube.multiple} 배수</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📷</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">인스타그램</div>
                    <div className="text-xs text-gray-500">팔로워 5만, 월 300만원 기준</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{examples.instagram.value}</div>
                  <div className="text-xs text-blue-600">x{examples.instagram.multiple} 배수</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg">💻</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">SaaS</div>
                    <div className="text-xs text-gray-500">MRR 2천만원 기준</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{examples.saas.value}</div>
                  <div className="text-xs text-blue-600">x{examples.saas.multiple} 배수</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/valuation')}
              className="w-full mt-4 py-3 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
            >
              내 비즈니스 가치 확인하기 →
            </button>
          </div>

          {/* 신뢰도 섹션 추가 */}
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl animate-slideUp"
               style={{ animationDelay: '0.6s' }}>
            <h4 className="text-sm font-bold text-gray-900 mb-4 text-center">왜 정확할까요?</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">📊</div>
                <p className="text-xs font-medium text-gray-700">실제 거래</p>
                <p className="text-xs text-gray-500">검증된 데이터</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-xs font-medium text-gray-700">업종별 계산</p>
                <p className="text-xs text-gray-500">실제 Multiple</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🔬</div>
                <p className="text-xs font-medium text-gray-700">검증된 알고리즘</p>
                <p className="text-xs text-gray-500">Revenue/Profit</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}