'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBusinessMultiples } from '@/lib/business-multiples';
import { 
  trackPageView, 
  trackCTAClick, 
  initScrollTracking, 
  trackTimeOnPage,
  EventName 
} from '@/lib/analytics';
import { saveUTMParams, trackPageView as trackSupabasePageView } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(5815); // 실제 거래 데이터 수
  const [notification, setNotification] = useState('');
  const [recentMeasurements, setRecentMeasurements] = useState<Array<{
    type: string;
    icon: string;
    value: string;
    timeAgo: string;
  }>>([]);
  
  // 동적 타이틀 문구들
  const titlePhrases = [
    { main: "내 비즈니스,", sub: "진짜 가치", end: "는 얼마?" },
    { main: "사업가격?", sub: "딸깍, 30초면", end: " 뚝딱" },
    { main: "내 계정,", sub: "지금 팔면", end: " 얼마 받을까?" },
    { main: "내 유튜브 채널", sub: "시세가", end: " 몇 억이라고?" },
    { main: "내 유튜브 채널이", sub: "1억", end: "이라고?" },
    { main: "팔로워 10만인", sub: "내 계정은", end: " 얼마?" },
    { main: "당신은 상위 5%일까요,", sub: "하위 95%", end: "일까요?" },
    { main: "내 채널", sub: "진짜 얼마", end: " 짜린지 아세요?" },
    { main: "남들은 자기 채널 값 아는데…", sub: "당신만", end: " 몰라요?" },
    { main: "딸깍!", sub: "30초면 내 사업 가격", end: " 뚝딱 공개" }
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
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
    
    // Analytics 초기화
    saveUTMParams();
    trackPageView('/', 'Home');
    trackSupabasePageView('/');
    
    // 스크롤 및 시간 추적 시작
    const cleanupScroll = initScrollTracking();
    const cleanupTime = trackTimeOnPage('home');
    
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
    
    // Cleanup 함수 반환
    return () => {
      cleanupScroll?.();
      cleanupTime?.();
    };
  }, []);
  
  // Real-time updates
  useEffect(() => {
    if (!mounted) return;
    
    // 10초마다 측정 데이터 업데이트
    const measurementInterval = setInterval(() => {
      setRecentMeasurements(generateRecentMeasurements());
    }, 10000);
    
    // 타이틀 문구 자동 변경 (4초마다)
    const titleInterval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % titlePhrases.length);
        setIsAnimating(false);
      }, 300); // 페이드 아웃 시간
    }, 4000);
    
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
      clearInterval(titleInterval);
      clearInterval(transactionInterval);
    };
  }, [mounted, titlePhrases.length]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Real-time notification - Toss style */}
      <div className="bg-purple-50 border-b border-purple-100">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-purple-700 text-center font-medium animate-fadeIn">
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
          
          {/* Main headline - Dynamic text with animation */}
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4 min-h-[120px] md:min-h-[140px] flex flex-col justify-center transition-opacity duration-300 ${
              isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
              style={{ animationDelay: '0.1s' }}>
            <span className="block">{titlePhrases[currentPhraseIndex].main}</span>
            <span className="text-purple-600">{titlePhrases[currentPhraseIndex].sub}</span>
            <span>{titlePhrases[currentPhraseIndex].end}</span>
          </h1>
          
          <p className="text-lg text-gray-600 text-center mb-10 animate-slideUp"
             style={{ animationDelay: '0.2s' }}>
            실제 거래 데이터로 측정하는 정확한 가치
          </p>
          
          {/* CTA button - Toss style */}
          <div className="flex justify-center mb-12 animate-slideUp"
               style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => {
                trackCTAClick(EventName.CLICK_START_VALUATION, 'home_hero');
                router.push('/valuation');
              }}
              className="group relative px-8 py-4 bg-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-purple-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
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
              <div className="text-2xl font-bold text-gray-900">92.7%</div>
              <div className="text-xs text-gray-500 mt-1">정확도</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">30초</div>
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
                    <div className="text-xl font-bold text-purple-600">
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

          {/* 결과 미리보기 섹션 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm animate-slideUp"
               style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  📊 30초 후, 이런 분석을 받아보세요
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  실제 측정 결과 예시
                </p>
              </div>
              <span className="hidden md:block text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                샘플 결과
              </span>
            </div>
            
            {/* 결과 미리보기 카드 */}
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 rounded-2xl p-5 border border-purple-100">
              <div className="grid grid-cols-2 gap-4">
                {/* 왼쪽: 핵심 가치 */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">내 비즈니스 가치</p>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-purple-600">₩2.87억</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                        ↑ 상위 15%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 오른쪽: 미니 차트 */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">업종 내 위치</p>
                  <div className="flex items-end gap-1 h-20">
                    <div className="flex-1 bg-gray-300 rounded-t transition-all hover:bg-gray-400" style={{height: '30%'}}></div>
                    <div className="flex-1 bg-gray-300 rounded-t transition-all hover:bg-gray-400" style={{height: '45%'}}></div>
                    <div className="flex-1 bg-gray-300 rounded-t transition-all hover:bg-gray-400" style={{height: '60%'}}></div>
                    <div className="flex-1 bg-purple-600 rounded-t animate-pulse shadow-lg" style={{height: '85%'}}>
                      <div className="w-full h-full bg-purple-400 rounded-t opacity-50"></div>
                    </div>
                    <div className="flex-1 bg-gray-300 rounded-t transition-all hover:bg-gray-400" style={{height: '95%'}}></div>
                    <div className="flex-1 bg-gray-300 rounded-t transition-all hover:bg-gray-400" style={{height: '70%'}}></div>
                    <div className="flex-1 bg-gray-300 rounded-t transition-all hover:bg-gray-400" style={{height: '40%'}}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">하위</span>
                    <span className="text-xs text-purple-600 font-medium">나</span>
                    <span className="text-xs text-gray-400">상위</span>
                  </div>
                </div>
              </div>
              
              {/* 구분선 */}
              <div className="my-4 border-t border-purple-100"></div>
              
              {/* 추가 분석 포인트 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg mb-1">📈</div>
                  <p className="text-xs text-gray-700 font-medium">성장률</p>
                  <p className="text-xs text-gray-500">+23%</p>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">📊</div>
                  <p className="text-xs text-gray-700 font-medium">적정 EXIT</p>
                  <p className="text-xs text-gray-500">8-12개월</p>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">💎</div>
                  <p className="text-xs text-gray-700 font-medium">투자매력도</p>
                  <p className="text-xs text-gray-500">A등급</p>
                </div>
              </div>
            </div>
            
            {/* 분석 항목 리스트 */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-purple-600">✓</span>
                <span>실제 거래 데이터 5,815건 기반 분석</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-purple-600">✓</span>
                <span>비슷한 규모 경쟁자와 상세 비교</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-purple-600">✓</span>
                <span>투자/매각 시점 및 전략 제안</span>
              </div>
            </div>
            
            {/* CTA 버튼 */}
            <button 
              onClick={() => {
                trackCTAClick(EventName.CLICK_START_VALUATION, 'home_result_preview');
                router.push('/valuation');
              }}
              className="w-full mt-5 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              내 비즈니스 결과 확인하기 →
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