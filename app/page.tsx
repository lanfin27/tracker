'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, Clock, ChevronRight, Zap, Trophy } from 'lucide-react';
import { getInitialCounter, generateLiveNotification } from '@/lib/fake-data';

export default function Home() {
  const router = useRouter();
  const [todayCount, setTodayCount] = useState(0);
  const [currentNotification, setCurrentNotification] = useState('');
  const [showUrgency, setShowUrgency] = useState(false);
  
  useEffect(() => {
    setTodayCount(getInitialCounter());
  }, []);
  
  // 실시간 카운터 증가 (1-3명씩 랜덤)
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.random() * 5000 + 3000); // 3-8초마다
    return () => clearInterval(interval);
  }, []);
  
  // 실시간 알림 (3초마다 새로운 알림)
  useEffect(() => {
    const showNotification = () => {
      setCurrentNotification(generateLiveNotification());
    };
    
    showNotification(); // 초기 알림
    const interval = setInterval(showNotification, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // 24시간 한정 메시지 (5초 후 표시)
  useEffect(() => {
    const timer = setTimeout(() => setShowUrgency(true), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 실시간 알림 바 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNotification}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Zap className="w-4 h-4" />
            {currentNotification}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* 히어로 섹션 */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* 실시간 카운터 */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-6"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-semibold">
              오늘 {todayCount.toLocaleString()}명이 측정했습니다
            </span>
          </motion.div>
          
          {/* 메인 헤드라인 */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            내 비즈니스,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              지금 얼마일까?
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            5,795개 실제 거래 데이터로 측정하는 정확한 가치
          </motion.p>
          
          {/* CTA 버튼 */}
          <motion.button
            onClick={() => router.push('/valuation')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
          >
            무료로 가치 측정하기
            <ChevronRight className="inline-block ml-2 w-5 h-5" />
          </motion.button>
          
          {/* 긴급성 메시지 */}
          <AnimatePresence>
            {showUrgency && (
              <motion.p 
                className="mt-4 text-red-600 font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                ⚡ 24시간 한정 무료 (이후 ₩99,000)
              </motion.p>
            )}
          </AnimatePresence>
          
          {/* 신뢰 지표 */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              누적 12,384명
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              평균 2분 47초
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              평균 가치 1.8억
            </span>
          </div>
        </div>
        
        {/* 호기심 유발 섹션 */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            당신은 평균보다 높을까요, 낮을까요?
          </h2>
          
          {/* 블러 처리된 순위표 */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-10 pointer-events-none" />
            <div className="filter blur-sm">
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 opacity-70">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">1위</span>
                    <span className="text-gray-600">YouTube</span>
                  </span>
                  <span className="font-bold">12.3억</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">2위</span>
                    <span className="text-gray-600">SaaS</span>
                  </span>
                  <span className="font-bold">8.7억</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="flex items-center gap-2">
                    <span className="text-gray-400">3위</span>
                    <span className="text-gray-600">이커머스</span>
                  </span>
                  <span className="font-bold">6.2억</span>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button
                onClick={() => router.push('/valuation')}
                className="bg-white/95 backdrop-blur px-6 py-3 rounded-full font-bold text-gray-900 shadow-lg hover:bg-white transition-all"
              >
                측정 후 확인 가능
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}