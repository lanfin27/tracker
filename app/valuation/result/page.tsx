'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateBusinessValue } from '@/lib/valuation-multiples';
import { calculateSNSValue } from '@/lib/sns-valuation-multiples';
import confetti from 'canvas-confetti';

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
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('valuation_data') || '{}');
    if (!data.businessType) {
      router.push('/valuation');
      return;
    }
    
    setBusinessData(data);
    
    // 가치 계산
    let calculatedValue: number;
    const isSNS = ['youtube', 'instagram', 'tiktok'].includes(data.businessType);
    
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
    
    // 순위 계산
    calculateRankingAndCompetitors(calculatedValue, data);
    
    // 카운트업 애니메이션
    animateCountUp(calculatedValue);
    
    // Confetti 효과
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 800);
    
    // 단계적 공개
    setTimeout(() => setStage(2), 2000);
    setTimeout(() => setStage(3), 4000);
    
    // 이메일 제출 확인
    const submitted = localStorage.getItem('email_submitted');
    if (submitted) {
      setIsUnlocked(true);
      setStage(4);
    }
  }, [router]);
  
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
  
  const formatValue = (value: number): string => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
    if (value >= 10000000) return `${(value / 10000000).toFixed(0)}천만`;
    return `${(value / 10000).toFixed(0)}만`;
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
    if (!email || !email.includes('@')) {
      alert('올바른 이메일을 입력해주세요');
      return;
    }
    
    localStorage.setItem('email_submitted', email);
    setIsUnlocked(true);
    setShowEmailModal(false);
    setStage(4);
    
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 }
    });
  };

  const handleWeeklySubmit = async () => {
    if (!weeklyEmail || !weeklyEmail.includes('@')) {
      alert('올바른 이메일을 입력해주세요');
      return;
    }
    
    localStorage.setItem('weekly_email', weeklyEmail);
    setShowWeeklyModal(false);
    
    alert('🎉 주간 리포트 신청이 완료되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* 메인 가치 카드 */}
        <div className="bg-white rounded-2xl p-6 mb-3 animate-fadeIn">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">당신의 비즈니스 가치</p>
            <div className="text-5xl font-bold text-blue-600 mb-1">
              ₩{formatValue(countUpValue)}
            </div>
            <p className="text-xs text-gray-500">
              * 매출, 수익{businessData && ['youtube', 'instagram', 'tiktok'].includes(businessData.businessType) ? ', 구독자 수' : ''} 종합 평가
            </p>
          </div>
        </div>
        
        {/* 순위 정보 */}
        {stage >= 2 && ranking && (
          <div className="grid grid-cols-2 gap-2 mb-3 animate-slideUp">
            <div className="bg-white rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">전국 순위</p>
              <p className="text-2xl font-bold text-gray-900">
                {ranking.nationalRank.toLocaleString()}위
              </p>
              <p className="text-xs text-blue-600 font-medium">
                상위 {ranking.percentile}%
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-4">
              <p className="text-xs text-gray-500 mb-1">{ranking.businessType} 순위</p>
              <p className="text-2xl font-bold text-gray-900">
                {ranking.industryRank.toLocaleString()}위
              </p>
              <p className="text-xs text-green-600 font-medium">
                {ranking.industryTotal.toLocaleString()}명 중
              </p>
            </div>
          </div>
        )}
        
        {/* 평균 대비 위치 */}
        {stage >= 2 && ranking && (
          <div className="bg-white rounded-2xl p-4 mb-3 animate-slideUp">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-900">평균 대비 위치</span>
              <span className="text-sm font-bold text-blue-600">
                {Number(ranking.percentile) > 50 ? '+' : ''}{((Number(ranking.percentile) - 50) * 2).toFixed(0)}%
              </span>
            </div>
            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-400 z-10"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full">
                <div className="text-xs text-gray-500 whitespace-nowrap">평균</div>
              </div>
              <div 
                className="absolute top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-1000"
                style={{
                  left: Number(ranking.percentile) > 50 ? '50%' : `${ranking.percentile}%`,
                  right: Number(ranking.percentile) > 50 ? `${100 - Number(ranking.percentile)}%` : '50%'
                }}
              >
                <div className={`absolute top-1/2 -translate-y-1/2 ${Number(ranking.percentile) > 50 ? 'right-2' : 'left-2'}`}>
                  <span className="text-xs text-white font-bold">나</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 주변 경쟁자 비교 */}
        {stage >= 2 && competitors.length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-3 animate-slideUp">
            <p className="text-sm font-medium text-gray-900 mb-3">주변 경쟁자</p>
            <div className="space-y-2">
              {competitors.map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      comp.isAbove ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {comp.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comp.position === 'below' ? '바로 아래' : comp.position === 'above' ? '바로 위' : '다음 목표'}
                      </p>
                      <p className="text-xs text-gray-500">상위 {comp.percentile}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatValue(comp.value)}</p>
                    <p className={`text-xs ${comp.isAbove ? 'text-red-600' : 'text-blue-600'}`}>
                      {comp.isAbove ? '+' : '-'}{formatValue(comp.difference)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 통합된 상세분석 섹션 */}
        {stage >= 3 && (
          <div className="relative mb-3">
            {/* 실제 콘텐츠 */}
            <div className={`bg-white rounded-2xl p-4 ${!isUnlocked ? 'select-none pointer-events-none' : ''}`}>
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
                      <span className="text-xs font-bold text-green-600">{formatValue(finalValue * 1.3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">1년 후</span>
                      <span className="text-xs font-bold text-blue-600">{formatValue(finalValue * 1.8)}</span>
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
                    <div className="absolute bottom-0 w-full h-full flex items-end justify-between gap-0.5">
                      {[20, 30, 40, 50, 65, 80, 90, 80, 65, 50, 40, 30, 20, 15].map((height, idx) => (
                        <div 
                          key={idx}
                          className={`flex-1 rounded-t ${
                            idx === Math.floor(14 * (Number(ranking?.percentile) || 50) / 100)
                              ? 'bg-blue-600' 
                              : 'bg-gray-200'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div 
                      className="absolute top-0 h-full w-0.5 bg-blue-600"
                      style={{ left: `${ranking?.percentile || 50}%` }}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 whitespace-nowrap">
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
                        <p className="text-sm font-bold text-green-600">{formatValue(finalValue * 1.15)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="text-center p-1 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">빠른</p>
                      <p className="text-xs font-bold text-orange-600">{formatValue(finalValue * 0.9)}</p>
                    </div>
                    <div className="text-center p-1 bg-blue-50 rounded">
                      <p className="text-xs text-gray-500">최적</p>
                      <p className="text-xs font-bold text-blue-600">{formatValue(finalValue * 1.15)}</p>
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
                        <div className="h-full bg-blue-500 rounded-full" style={{width: '46%'}}></div>
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
            
            {/* 블러 오버레이 - 통합된 하나의 CTA */}
            {!isUnlocked && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px]"></div>
                  <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-[6px]"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-[6px]"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-medium shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                  >
                    🔓 상세 분석 전체 보기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 새로운 섹션: 주간 리포트 구독 */}
        {stage >= 3 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 mb-3 animate-slideUp">
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
                onClick={() => setShowWeeklyModal(true)}
                className="ml-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                구독
              </button>
            </div>
          </div>
        )}
        
        {/* CTA 버튼들 */}
        {!isUnlocked && stage >= 3 && (
          <div className="space-y-2 mb-3">
            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-medium"
            >
              무료로 전체 분석 받기
            </button>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-xs text-gray-500">✅ 성장 시나리오</span>
              <span className="text-xs text-gray-500">✅ 업종 분포도</span>
              <span className="text-xs text-gray-500">✅ EXIT 전략</span>
              <span className="text-xs text-gray-500">✅ 라이벌 분석</span>
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
            
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none mb-3 text-sm"
              autoFocus
            />
            
            <button
              onClick={handleEmailSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium mb-2"
            >
              무료로 받기
            </button>
            
            <button
              onClick={() => setShowEmailModal(false)}
              className="w-full text-center text-sm text-gray-500"
            >
              나중에
            </button>
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
    </div>
  );
}