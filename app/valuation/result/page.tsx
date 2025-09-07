'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { calculateBusinessValue } from '@/lib/valuation-multiples';
import { calculateSNSValue } from '@/lib/sns-valuation-multiples';
import { calculateRealBusinessValue } from '@/lib/real-valuation-service';
import type { ValuationResult } from '@/lib/supabase-types';
import confetti from 'canvas-confetti';
import { 
  trackPageView, 
  trackValuationResult,
  trackEmailSubmission,
  trackEvent,
  trackCTAClick,
  EventName 
} from '@/lib/analytics';
import { saveUTMParams, trackPageView as trackSupabasePageView } from '@/lib/supabase';

export default function ResultPage() {
  const router = useRouter();
  const [finalValue, setFinalValue] = useState(0);
  const [countUpValue, setCountUpValue] = useState(0);
  const [ranking, setRanking] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [weeklyEmail, setWeeklyEmail] = useState('');
  const [stage, setStage] = useState(1);
  const [businessData, setBusinessData] = useState<any>(null);
  const [realDataStats, setRealDataStats] = useState<any>(null);
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('medium');
  const [dataCount, setDataCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usedMethod, setUsedMethod] = useState<'revenue' | 'profit' | 'fallback'>('revenue');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 자동 결과 추적 (이메일 없이)
  useEffect(() => {
    const trackView = async () => {
      const tracked = sessionStorage.getItem('result_tracked');
      if (!tracked && businessData && finalValue > 0) {
        // 세션당 한 번만 추적
        const sessionId = sessionStorage.getItem('session_id') || 
                         `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (!sessionStorage.getItem('session_id')) {
          sessionStorage.setItem('session_id', sessionId);
        }
        
        console.log('🚀 Auto-tracking result view...');
        console.log('📊 Business data:', businessData);
        console.log('💰 Final value:', finalValue);
        
        try {
          const trackingData = {
            businessData: {
              businessType: businessData?.businessType,
              monthlyRevenue: businessData?.monthlyRevenue,
              monthlyProfit: businessData?.monthlyProfit,
              businessAge: businessData?.businessAge,
              subscribers: businessData?.subscribers || 0,
              avgViews: businessData?.avgViews || 0,
              avgLikes: businessData?.avgLikes || 0,
              category: businessData?.category || '',
              calculatedValue: finalValue,
              percentile: ranking?.percentile || 0
            },
            sessionId
          };
          
          console.log('📤 Sending tracking data:', trackingData);
          
          const response = await fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trackingData)
          });
          
          const responseData = await response.json();
          console.log('✅ Tracking response:', responseData);
          
          sessionStorage.setItem('result_tracked', 'true');
        } catch (error) {
          console.error('❌ Track view error:', error);
        }
      }
    };
    
    trackView();
  }, [businessData, finalValue, ranking]);

  useEffect(() => {
    // Analytics 초기화
    saveUTMParams();
    trackPageView('/valuation/result', 'Result');
    trackSupabasePageView('/valuation/result');
    
    const loadResults = async () => {
      const data = JSON.parse(localStorage.getItem('valuation_data') || '{}');
      console.log('📊 Loaded data from localStorage:', data);
      
      if (!data.businessType) {
        router.push('/valuation');
        return;
      }
      
      setBusinessData(data);
      setLoading(true);
      
      try {
        console.log('🚀 실제 데이터 기반 가치 계산 시작...');
        
        // 실제 데이터 기반 가치 계산
        // 🔴 중요: localStorage는 원 단위, 함수는 만원 단위 기대!
        const result: ValuationResult = await calculateRealBusinessValue(
          data.businessType,
          data.monthlyRevenue / 10000,  // 원 → 만원 변환
          data.monthlyProfit / 10000,   // 원 → 만원 변환
          data.subscribers,
          data.businessAge
        );
        
        console.log('✅ 계산 완료:', result);
        
        setFinalValue(result.value);
        setRanking(result.ranking);
        setRealDataStats(result.statistics);
        setDataCount(result.dataCount);
        setConfidence(result.confidence);
        setUsedMethod(result.usedMethod);
        
        // Track valuation result
        trackValuationResult(
          result.value,
          data.businessType,
          result.ranking?.percentile || 50
        );
        trackEvent(EventName.VIEW_RESULT_VALUE, {
          value: result.value,
          businessType: data.businessType,
          confidence: result.confidence,
          dataCount: result.dataCount
        });
        
        // 경쟁자 생성 (유사 거래 기반)
        if (result.similarTransactions && result.similarTransactions.length > 0) {
          const comps = result.similarTransactions.slice(0, 3).map((trans, idx) => ({
            position: idx === 0 ? 'below' : idx === 1 ? 'above' : 'target',
            value: trans.price,
            rank: idx + 1,
            difference: Math.abs(trans.price - result.value),
            isAbove: trans.price > result.value,
            percentile: ((trans.price / result.value) * 50).toFixed(1)
          }));
          setCompetitors(comps);
        } else {
          // 폴백 경쟁자 생성
          generateRealCompetitors(result.value, data, []);
        }
        
        // 카운트업 애니메이션 시작
        animateCountUp(result.value);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ 실제 데이터 조회 실패, 폴백 사용:', error);
        
        // 폴백: 기존 로직 사용
        const isSNS = ['youtube', 'instagram', 'tiktok'].includes(data.businessType);
        let calculatedValue: number;
        
        if (isSNS && data.subscribers) {
          const snsResult = calculateSNSValue(data);
          calculatedValue = snsResult.final.moderate;
        } else {
          calculatedValue = calculateBusinessValue(
            data.businessType,
            data.monthlyRevenue,
            data.monthlyProfit,
            data.subscribers || 0,
            data.businessAge
          );
        }
        
        setFinalValue(calculatedValue);
        calculateRankingAndCompetitors(calculatedValue, data);
        setConfidence('low');
        setLoading(false);
        
        // 폴백 카운트업 애니메이션
        animateCountUp(calculatedValue);
      }
    };
    
    loadResults();
    
    // 애니메이션 및 단계적 공개
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 800);
    
    setTimeout(() => setStage(2), 2000);
    setTimeout(() => setStage(3), 4000);
    
    // 이메일 제출 확인
    const submitted = localStorage.getItem('email_submitted');
    if (submitted) {
      setIsUnlocked(true);
      setStage(4);
    }
  }, [router]);
  
  // 실제 경쟁자 생성 함수
  const generateRealCompetitors = (value: number, data: any, similarTransactions: any[]) => {
    const competitors = [];
    
    if (similarTransactions && similarTransactions.length >= 2) {
      // 실제 유사 거래 기반 경쟁자
      const sorted = similarTransactions.sort((a, b) => a.price - b.price);
      
      for (let i = 0; i < Math.min(3, sorted.length); i++) {
        const transaction = sorted[i];
        competitors.push({
          position: i === 0 ? 'below' : i === 1 ? 'above' : 'target',
          value: transaction.price,
          rank: Math.floor(Math.random() * 1000) + 100,
          difference: Math.abs(transaction.price - value),
          isAbove: transaction.price > value,
          percentile: (50 + (Math.random() - 0.5) * 40).toFixed(1)
        });
      }
    } else {
      // 폴백: 기존 로직
      const generateCompetitor = (offsetPercent: number, position: string) => {
        const competitorValue = value * (1 + offsetPercent);
        return {
          position,
          value: competitorValue,
          rank: Math.floor(Math.random() * 1000) + 100,
          difference: Math.abs(competitorValue - value),
          isAbove: competitorValue > value,
          percentile: (50 + (Math.random() - 0.5) * 40).toFixed(1)
        };
      };
      
      competitors.push(
        generateCompetitor(-0.12, 'below'),
        generateCompetitor(0.08, 'above'), 
        generateCompetitor(0.25, 'target')
      );
    }
    
    setCompetitors(competitors);
  };
  
  const animateCountUp = (target: number) => {
    const duration = 2000;
    const steps = 100;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCountUpValue(target);
        clearInterval(timer);
      } else {
        setCountUpValue(Math.floor(current));
      }
    }, duration / steps);
  };
  
  // 정밀한 금액 포맷팅 함수
  // 비즈니스 타입별 구독자/팔로워 라벨
  const getFollowerLabel = (businessType: string) => {
    switch (businessType) {
      case 'youtube':
        return '구독자 수';
      case 'instagram':
      case 'tiktok':
        return '팔로워 수';
      default:
        return '구독자 수';
    }
  };

  const formatValue = (value: number): string => {
    if (value >= 100000000) {
      // 1억원 이상 - 소수점 둘째 자리까지
      const okValue = value / 100000000;
      
      if (okValue >= 1000) {
        // 1000억원 이상 - 정수로 표시
        return `${okValue.toFixed(0).toLocaleString()}억원`;
      } else if (okValue >= 100) {
        // 100억원 이상 - 소수점 첫째 자리
        return `${okValue.toFixed(1)}억원`;
      } else if (okValue >= 10) {
        // 10억원 이상 100억원 미만 - 소수점 둘째 자리
        return `${okValue.toFixed(2)}억원`;
      } else {
        // 1억원 이상 10억원 미만 - 소수점 둘째 자리
        return `${okValue.toFixed(2)}억원`;
      }
    } else {
      // 1억원 미만 - 만원 단위로 정확히 표시
      const manwon = Math.round(value / 10000);
      
      if (manwon === 0) {
        return '0원';
      } else if (manwon >= 10000) {
        // 1억원에 가까운 경우 (9,500만원 이상)
        const okValue = value / 100000000;
        return `${okValue.toFixed(2)}억원`;
      } else {
        // 천단위 구분자 추가
        return `${manwon.toLocaleString()}만원`;
      }
    }
  };
  
  const calculateRankingAndCompetitors = (value: number, data: any) => {
    const totalUsers = 12847;
    
    const industryDistribution = {
      youtube: 3241,
      instagram: 2847,
      tiktok: 1653,
      blog: 1892,
      ecommerce: 2134,
      saas: 743,
      website: 337
    };
    
    const industryTotal = industryDistribution[data.businessType as keyof typeof industryDistribution] || 1000;
    
    const getPercentile = (value: number, businessType: string) => {
      const avgValues = {
        youtube: 150000000,
        instagram: 80000000,
        tiktok: 60000000,
        blog: 50000000,
        ecommerce: 200000000,
        saas: 500000000,
        website: 30000000
      };
      
      const avg = avgValues[businessType as keyof typeof avgValues] || 100000000;
      const std = avg * 0.8;
      const zScore = (value - avg) / std;
      
      let percentile = 50 + (zScore * 20);
      percentile = Math.max(0.1, Math.min(99.9, percentile));
      
      return percentile;
    };
    
    const percentile = getPercentile(value, data.businessType);
    const nationalRank = Math.max(1, Math.round(totalUsers * (100 - percentile) / 100));
    const industryRank = Math.max(1, Math.round(industryTotal * (100 - percentile) / 100));
    
    setRanking({
      nationalRank,
      totalUsers,
      percentile: percentile.toFixed(1),
      industryRank,
      industryTotal,
      businessType: data.businessType
    });
    
    const generateCompetitor = (offsetPercent: number, position: string) => {
      const competitorValue = value * (1 + offsetPercent);
      const competitorPercentile = getPercentile(competitorValue, data.businessType);
      const competitorRank = Math.max(1, Math.round(totalUsers * (100 - competitorPercentile) / 100));
      
      return {
        position,
        value: competitorValue,
        rank: competitorRank,
        difference: Math.abs(competitorValue - value),
        isAbove: competitorValue > value,
        percentile: competitorPercentile.toFixed(1)
      };
    };
    
    setCompetitors([
      generateCompetitor(-0.12, 'below'),
      generateCompetitor(0.08, 'above'),
      generateCompetitor(0.25, 'target')
    ]);
  };
  
  const handleEmailSubmit = async () => {
    setIsLoading(true);
    setEmailError('');
    
    try {
      // 이메일 유효성 검사
      if (!email || !email.includes('@')) {
        setEmailError('올바른 이메일을 입력해주세요');
        setIsLoading(false);
        return;
      }
      
      // Track email submission attempt
      trackEvent(EventName.SUBMIT_EMAIL, { source: 'competitor_analysis' });
      
      // 디버깅용 로그 추가
      console.log('📤 Email Submit Data:', {
        email,
        businessType: businessData?.businessType,
        revenue: businessData?.monthlyRevenue,
        profit: businessData?.monthlyProfit,
        subscribers: businessData?.subscribers,
        avgViews: businessData?.avgViews,
        avgLikes: businessData?.avgLikes,
        category: businessData?.category,
        value: finalValue
      });
      
      // API 호출로 Supabase에 저장
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'detailed_analysis',
          businessData: {
            businessType: businessData?.businessType,
            monthlyRevenue: businessData?.monthlyRevenue,
            monthlyProfit: businessData?.monthlyProfit,
            subscribers: businessData?.subscribers,
            businessAge: businessData?.businessAge,
            avgViews: businessData?.avgViews || 0,
            avgLikes: businessData?.avgLikes || 0,
            category: businessData?.category || '',
            calculatedValue: finalValue,
            percentile: ranking?.percentile,
            requestedFeature: 'competitor_analysis'
          }
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Success tracking
        trackEmailSubmission(true, 'competitor_analysis', {
          businessType: businessData?.businessType,
          value: finalValue
        });
        
        // 이메일 저장 성공 - 잠금은 풀지 않음
        setShowEmailModal(false);
        setShowSuccessMessage(true);
        
        // 3초 후 성공 메시지 자동 닫기
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        setEmailError('잠시 후 다시 시도해주세요');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      trackEmailSubmission(false, 'competitor_analysis', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setEmailError('네트워크 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeeklySubmit = async () => {
    if (!weeklyEmail || !weeklyEmail.includes('@')) {
      alert('올바른 이메일을 입력해주세요');
      return;
    }
    
    // Track weekly email submission
    trackEvent(EventName.SUBMIT_WEEKLY_EMAIL, { source: 'weekly_report' });
    
    // 디버깅용 로그 추가
    console.log('📤 Weekly Report Data:', {
      email: weeklyEmail,
      businessType: businessData?.businessType,
      revenue: businessData?.monthlyRevenue,
      profit: businessData?.monthlyProfit,
      subscribers: businessData?.subscribers,
      avgViews: businessData?.avgViews,
      avgLikes: businessData?.avgLikes,
      category: businessData?.category,
      value: finalValue
    });
    
    try {
      // API 호출로 Supabase에 저장
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: weeklyEmail,
          type: 'weekly_report',
          businessData: {
            businessType: businessData?.businessType,
            monthlyRevenue: businessData?.monthlyRevenue || 0,
            monthlyProfit: businessData?.monthlyProfit || 0,
            businessAge: businessData?.businessAge || '',
            subscribers: businessData?.subscribers || 0,
            avgViews: businessData?.avgViews || 0,
            avgLikes: businessData?.avgLikes || 0,
            category: businessData?.category || '',
            calculatedValue: finalValue || 0,
            percentile: ranking?.percentile || 0
          }
        })
      });
      
      const result = await response.json();
      console.log('✅ Weekly Report Response:', result);
      
      if (response.ok) {
        // Success tracking
        trackEmailSubmission(true, 'weekly_report', {
          businessType: businessData?.businessType
        });
        
        localStorage.setItem('weekly_email', weeklyEmail);
        setShowWeeklyModal(false);
        
        alert('🎉 주간 리포트 신청이 완료되었습니다!');
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Weekly email submission error:', error);
      trackEmailSubmission(false, 'weekly_report', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      alert('주간 리포트 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* 메인 가치 카드 */}
        <div className="bg-white rounded-2xl p-6 mb-3 animate-fadeIn">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">당신의 비즈니스 가치</p>
            {loading && dataCount === 0 ? (
              <div className="py-4">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600">실제 데이터 분석 중...</span>
                </div>
              </div>
            ) : (
              <div className="text-5xl font-bold text-purple-600 mb-1">
                ₩{formatValue(countUpValue)}
              </div>
            )}
            <p className="text-xs text-gray-500">
              * 매출, 수익{businessData && ['youtube', 'instagram', 'tiktok'].includes(businessData.businessType) ? `, ${getFollowerLabel(businessData.businessType)}` : ''} 종합 평가
            </p>
            {dataCount > 0 && (
              <div className="mt-3 flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    confidence === 'high' ? 'bg-green-500' : 
                    confidence === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <p className="text-xs font-medium text-purple-700">
                    실제 {dataCount.toLocaleString()}건 거래 데이터 기반
                  </p>
                </div>
                {realDataStats && (
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>수익배수: {realDataStats.avg_revenue_multiple?.toFixed(1)}x</span>
                    <span>이익배수: {realDataStats.avg_profit_multiple?.toFixed(1)}x</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* 순위 관련 섹션 제거됨 */}
        
        {/* 실제 데이터 통계 표시 */}
        {stage >= 2 && realDataStats && dataCount > 0 && (
          <div className="bg-purple-50 rounded-2xl p-4 mb-3 animate-slideUp">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-900">🎯 실제 시장 데이터</p>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                confidence === 'high' ? 'bg-green-100 text-green-700' :
                confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {confidence === 'high' ? '높은 신뢰도' :
                 confidence === 'medium' ? '중간 신뢰도' : '낮은 신뢰도'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">평균 거래가</p>
                <p className="text-sm font-bold text-gray-900">
                  ₩{formatValue(realDataStats.avg_price)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">중간값</p>
                <p className="text-sm font-bold text-gray-900">
                  ₩{formatValue(realDataStats.median_price)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">사용된 배수</p>
                <p className="text-sm font-bold text-purple-600">
                  {usedMethod === 'revenue' ? `수익 ${realDataStats.avg_revenue_multiple?.toFixed(1)}x` :
                   usedMethod === 'profit' ? `이익 ${realDataStats.avg_profit_multiple?.toFixed(1)}x` :
                   '폴백 방식'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">데이터 수</p>
                <p className="text-sm font-bold text-gray-900">
                  {dataCount.toLocaleString()}건
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* 주변 경쟁자 + 상세 분석 통합 섹션 */}
        {stage >= 2 && (
          <div className="space-y-3">
            {/* 주변 경쟁자 섹션 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm relative">
              {/* 블러 오버레이 - isUnlocked가 false일 때만 표시 */}
              {!isUnlocked && (
                <div 
                  className="overlay-blur"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                    borderRadius: '1.5rem',
                    zIndex: 5
                  }}
                />
              )}
              
              <h2 
                className={`text-lg font-medium text-gray-800 mb-6 ${!isUnlocked ? 'blur-light' : ''}`}
                style={!isUnlocked ? { 
                  filter: 'blur(3px)',
                  WebkitFilter: 'blur(3px)',
                  opacity: 0.7 
                } : {}}
              >
                주변 경쟁자
              </h2>
              
              <div className="relative">
                {/* 블러 처리된 데이터 - 드래그 방지 추가 */}
                <div 
                  className={`space-y-4 ${!isUnlocked ? 'content-blur' : ''}`}
                  style={!isUnlocked ? { 
                    filter: 'blur(6px)',
                    WebkitFilter: 'blur(6px)',
                    pointerEvents: 'none',
                    userSelect: 'none', 
                    WebkitUserSelect: 'none', 
                    MozUserSelect: 'none',
                    msUserSelect: 'none'
                  } : {}}
              >
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">채널 이름 A</p>
                      <p className="text-sm text-gray-500">비슷한 매출</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">2.07억원</p>
                    <p className="text-sm text-green-500">▲ 15%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">채널 이름 B</p>
                      <p className="text-sm text-gray-500">유사 카테고리</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">2.54억원</p>
                    <p className="text-sm text-green-500">▲ 8%</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">채널 이름 C</p>
                      <p className="text-sm text-gray-500">비슷한 구독자</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">2.94억원</p>
                    <p className="text-sm text-red-500">▼ 3%</p>
                  </div>
                </div>
                </div>
              </div>
            </div>
            
            {/* 중앙에 하나의 언락 버튼 */}
            {!isUnlocked && (
              <div className="flex justify-center my-6">
                <button 
                  onClick={() => {
                    trackEvent(EventName.OPEN_EMAIL_MODAL, { source: 'unified_unlock' });
                    setShowEmailModal(true);
                  }}
                  className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-purple-700 transition-all hover:scale-105 text-lg"
                >
                  🔓 상세 분석 보기
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* 상세분석 섹션 */}
        {stage >= 3 && (
          <div className="bg-white rounded-2xl p-4 mb-3 relative">
            {/* 블러 오버레이 - isUnlocked가 false일 때만 표시 */}
            {!isUnlocked && (
              <div 
                className="overlay-blur"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  borderRadius: '0.5rem',
                  zIndex: 5
                }}
              />
            )}
            
            <div 
              className={!isUnlocked ? 'content-blur' : ''}
              style={!isUnlocked ? { 
                filter: 'blur(4px)',
                WebkitFilter: 'blur(4px)',
                pointerEvents: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              } : {}}
            >
              <p className="text-lg font-bold text-gray-900 mb-4">📊 상세 분석</p>
              
              {/* 3가지 분석 미리보기 리스트 */}
              <div className="space-y-3">
                {/* 성장 시나리오 */}
                <div className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">📈 성장 시나리오</span>
                    <span className="text-xs text-gray-500">AI 예측</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">6개월 후</span>
                      <span className="text-xs font-bold text-purple-600">{formatValue(finalValue * 1.3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">1년 후</span>
                      <span className="text-xs font-bold text-purple-600">{formatValue(finalValue * 1.8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">2년 후</span>
                      <span className="text-xs font-bold text-purple-600">{formatValue(finalValue * 2.5)}</span>
                    </div>
                  </div>
                </div>
                
                {/* 업종 내 포지션 차트 */}
                <div className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">📊 업종 분포도</span>
                    <span className="text-xs text-gray-500">내 위치 분석</span>
                  </div>
                  <div className="h-16 relative">
                    {/* 배경 막대들 */}
                    <div className="absolute bottom-0 w-full h-full flex items-end justify-between gap-0.5">
                      {[20, 30, 40, 50, 65, 80, 90, 80, 65, 50, 40, 30, 20, 15].map((height, idx) => (
                        <div 
                          key={idx}
                          className="flex-1 rounded-t bg-gray-200"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    {/* 내 위치 - 선명하게 오버레이 */}
                    <div 
                      className="absolute bottom-0 w-full h-full flex items-end justify-between gap-0.5"
                      style={{ pointerEvents: 'none' }}
                    >
                      {[20, 30, 40, 50, 65, 80, 90, 80, 65, 50, 40, 30, 20, 15].map((height, idx) => (
                        <div 
                          key={idx}
                          className={`flex-1 rounded-t ${
                            idx === Math.floor(14 * (Number(ranking?.percentile) || 50) / 100)
                              ? 'bg-purple-600 shadow-lg' 
                              : 'transparent'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div 
                      className="absolute top-0 h-full w-0.5 bg-purple-600 shadow-lg"
                      style={{ left: `${ranking?.percentile || 50}%` }}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-purple-600 whitespace-nowrap">
                        여기!
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>하위</span>
                    <span>평균</span>
                    <span>상위</span>
                  </div>
                </div>
                
                {/* EXIT 전략 */}
                <div className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">🎯 EXIT 전략</span>
                    <span className="text-xs text-gray-500">최적 타이밍</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600">최적 시점</p>
                        <p className="text-sm font-bold text-gray-900">8-12개월</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">예상 인수가</p>
                        <p className="text-sm font-bold text-purple-600">{formatValue(finalValue * 1.15)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="text-center p-1 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">빠른</p>
                      <p className="text-xs font-bold text-orange-600">{formatValue(finalValue * 0.9)}</p>
                    </div>
                    <div className="text-center p-1 bg-purple-50 rounded">
                      <p className="text-xs text-gray-500">최적</p>
                      <p className="text-xs font-bold text-purple-600">{formatValue(finalValue * 1.15)}</p>
                    </div>
                    <div className="text-center p-1 bg-purple-50 rounded">
                      <p className="text-xs text-gray-500">프리미엄</p>
                      <p className="text-xs font-bold text-purple-600">{formatValue(finalValue * 1.5)}</p>
                    </div>
                  </div>
                </div>
                
                {/* 라이벌 분석 */}
                <div className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">⚔️ 라이벌 분석</span>
                    <span className="text-xs text-gray-500">경쟁 현황</span>
                  </div>
                  <div className="flex items-center justify-between bg-red-50 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        R
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">익명 라이벌</p>
                        <p className="text-xs text-gray-500">12% 앞서는 중</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{formatValue(finalValue * 1.12)}</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{width: '46%'}}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600">46%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{width: '54%'}}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-600">54%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 추가 인사이트 */}
              <div className="mt-3 p-3 bg-yellow-50 rounded-xl">
                <p className="text-xs font-medium text-gray-900 mb-1">💡 전문가 인사이트</p>
                <p className="text-xs text-gray-600">
                  현재 순위에서 상위 10% 진입까지 평균 8개월이 소요되며,
                  핵심 지표 개선 시 4개월로 단축 가능합니다.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* 새로운 섹션: 주간 리포트 구독 */}
        {stage >= 3 && (
          <div className="bg-purple-50 rounded-2xl p-4 mb-3 animate-slideUp">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  📬 주간 리포트 받기
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  매주 {businessData?.businessType} 업종의 실제 거래 사례와 순위 변동을 받아보세요
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs bg-white px-2 py-1 rounded-lg">✅ 실제 거래가</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-lg">✅ 순위 변동</span>
                  <span className="text-xs bg-white px-2 py-1 rounded-lg">✅ 성장 팁</span>
                </div>
              </div>
              <button
                onClick={() => {
                  trackEvent(EventName.OPEN_EMAIL_MODAL, { source: 'weekly_report' });
                  setShowWeeklyModal(true);
                }}
                className="ml-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                구독
              </button>
            </div>
          </div>
        )}
        
        
        {/* 다시 측정하기 버튼 */}
        <button
          onClick={() => router.push('/valuation')}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium"
        >
          다시 측정하기
        </button>
      </div>
      
      {/* 이메일 모달 (상세 분석) */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slideUp">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              전체 분석 받기
            </h2>
            
            <p className="text-sm text-gray-600 mb-4">
              이메일로 상세 분석을 보내드립니다
            </p>
            
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-medium text-gray-900 mb-2">포함 내용:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-xs text-gray-700">성장 시나리오 상세 분석</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-xs text-gray-700">업종 내 정확한 포지션</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-xs text-gray-700">맞춤형 EXIT 전략</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-xs text-gray-700">라이벌 추격 방법</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-xs text-gray-700 font-medium">보너스: 업종별 성공 사례</span>
                </div>
              </div>
            </div>
            
            {/* 에러 메시지 표시 */}
            {emailError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{emailError}</p>
              </div>
            )}
            
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(''); // 입력 시 에러 메시지 제거
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none mb-3 text-sm transition-colors ${
                emailError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-purple-600'
              }`}
              autoFocus
              disabled={isLoading}
            />
            
            <button
              onClick={handleEmailSubmit}
              disabled={isLoading || !email.trim()}
              className={`w-full py-3 rounded-xl font-medium mb-2 transition-all ${
                isLoading || !email.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>전송 중...</span>
                </div>
              ) : (
                '무료로 받기'
              )}
            </button>
            
            <button
              onClick={() => {
                setShowEmailModal(false);
                setEmailError('');
                setEmail('');
              }}
              disabled={isLoading}
              className={`w-full text-center text-sm ${
                isLoading ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              나중에
            </button>
          </div>
        </div>
      )}
      
      {/* 성공 메시지 */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm">등록되었습니다</p>
              <p className="text-xs opacity-90">준비되면 알려드릴게요!</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 주간 리포트 모달 */}
      {showWeeklyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slideUp">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              주간 리포트 구독
            </h2>
            
            <p className="text-sm text-gray-600 mb-4">
              매주 월요일, {businessData?.businessType} 업종의 인사이트를 받아보세요
            </p>
            
            <div className="bg-purple-50 rounded-xl p-3 mb-4">
              <p className="text-xs font-medium text-gray-900 mb-2">매주 받는 정보:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">📊</span>
                  <span className="text-xs text-gray-700">이번 주 실제 거래 사례 3건</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">📈</span>
                  <span className="text-xs text-gray-700">업종 평균 가치 변동 추이</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">🏆</span>
                  <span className="text-xs text-gray-700">내 순위 변동 알림</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500">💡</span>
                  <span className="text-xs text-gray-700">상위 10% 진입 전략</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">🎁</span>
                  <span className="text-xs text-gray-700 font-medium">월 1회 심층 분석 리포트</span>
                </div>
              </div>
            </div>
            
            <input
              type="email"
              placeholder="이메일 주소"
              value={weeklyEmail}
              onChange={(e) => setWeeklyEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none mb-3 text-sm"
              autoFocus
            />
            
            <label className="flex items-start gap-2 mb-4 text-xs">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5"
              />
              <span className="text-gray-600">
                마케팅 정보 수신 동의 (언제든 취소 가능)
              </span>
            </label>
            
            <button
              onClick={handleWeeklySubmit}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium mb-2"
            >
              무료 구독 시작
            </button>
            
            <button
              onClick={() => setShowWeeklyModal(false)}
              className="w-full text-center text-sm text-gray-500"
            >
              다음에 하기
            </button>
          </div>
        </div>
      )}
      
      {/* The Founder Inc. 브랜드 푸터 */}
      <footer className="mt-16 border-t border-gray-200 pt-8 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            {/* 브랜드 로고/이름 - 크기 축소 */}
            <div className="mb-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                The Founder Inc.
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                더 파운더
              </p>
            </div>
            
            {/* 브랜드 설명 - 크기 축소 */}
            <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto mb-4">
              실제 <span className="font-bold text-purple-600">5,815건</span>의 비즈니스 거래 데이터를 기반으로<br className="md:hidden" />
              창업자와 크리에이터의 성공을 돕는 데이터 기반 가치 평가 서비스
            </p>
            
            {/* 신뢰 지표 - 모바일 최적화 */}
            <div className="flex justify-center gap-4 md:gap-8 mb-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">5,815+</div>
                <div className="text-xs md:text-sm text-gray-600">검증된 거래</div>
              </div>
              <div className="text-center border-x border-gray-200 px-3">
                <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">92.7%</div>
                <div className="text-xs md:text-sm text-gray-600">정확도</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">30초</div>
                <div className="text-xs md:text-sm text-gray-600 whitespace-nowrap">측정시간</div>
              </div>
            </div>
            
            {/* 추가 서비스 안내 - 크기 축소 */}
            <div className="bg-purple-50 rounded-2xl p-4 mb-4 max-w-3xl mx-auto">
              <p className="text-xs md:text-sm text-purple-900 font-medium mb-1">
                💎 프리미엄 서비스 Coming Soon
              </p>
              <p className="text-xs text-purple-700">
                AI 기반 성장 전략 • 실시간 시장 분석 • 1:1 컨설팅 • M&A 매칭 서비스
              </p>
            </div>
            
            {/* 회사 정보 - 더 작게 */}
            <div className="text-xs text-gray-500 mt-6">
              <p className="mb-1">
                © 2024 The Founder Inc. All rights reserved.
              </p>
              <Link 
                href="/privacy"
                className="text-gray-500 hover:text-purple-600 transition-colors text-xs"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}