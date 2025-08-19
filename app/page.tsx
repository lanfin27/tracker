'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [todayCount, setTodayCount] = useState(12384);
  const [notification, setNotification] = useState('');
  const [showUrgency, setShowUrgency] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time counter (increase 1-3 every 2-5 seconds)
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setTodayCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.random() * 3000 + 2000);
    
    return () => clearInterval(interval);
  }, [mounted]);
  
  // Real-time notifications (change every 3 seconds)
  useEffect(() => {
    if (!mounted) return;
    
    const notifications = [
      '서울의 유튜버가 2.3억 달성',
      '경기의 이커머스가 5.1억 측정',
      '부산의 SaaS가 9.8억 돌파',
      '인천의 인스타그래머가 1.5억 달성',
      '대구의 틱톡커가 1.8억 측정'
    ];
    
    const showNotification = () => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomNotification);
    };
    showNotification();
    
    const interval = setInterval(showNotification, 3000);
    return () => clearInterval(interval);
  }, [mounted]);
  
  // Urgency message (show after 5 seconds)
  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => setShowUrgency(true), 5000);
    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Real-time notification - Toss style */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <p className="text-sm text-blue-700 text-center font-medium animate-fadeIn">
            ⚡ {notification || '서울의 유튜버가 2.3억 달성'}
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          
          {/* Real-time counter - Toss style badge */}
          <div className="flex justify-center mb-8 animate-slideUp">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                오늘 <span className="text-blue-600 font-bold">{todayCount.toLocaleString()}</span>명이 측정 중
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

          {/* Trust indicators - Toss style cards */}
          <div className="grid grid-cols-3 gap-4 mb-16 animate-slideUp"
               style={{ animationDelay: '0.4s' }}>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">12,384</div>
              <div className="text-xs text-gray-500 mt-1">검증된 거래</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">94.2%</div>
              <div className="text-xs text-gray-500 mt-1">정확도</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">3분</div>
              <div className="text-xs text-gray-500 mt-1">측정 시간</div>
            </div>
          </div>

          {/* Industry average values - Toss style list */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-slideUp"
               style={{ animationDelay: '0.5s' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              업종별 평균 가치
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📺</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">유튜브</div>
                    <div className="text-xs text-gray-500">구독자 10만 기준</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">3.0억</div>
                  <div className="text-xs text-blue-600">x2.5 배수</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📷</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">인스타그램</div>
                    <div className="text-xs text-gray-500">팔로워 5만 기준</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">1.5억</div>
                  <div className="text-xs text-blue-600">x2.0 배수</div>
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
                  <div className="font-bold text-gray-900">9.6억</div>
                  <div className="text-xs text-blue-600">x4.0 배수</div>
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

        </div>
      </main>
    </div>
  );
}