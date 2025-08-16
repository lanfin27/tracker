'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TossButton from '@/components/toss/TossButton';
import { formatCurrency } from '@/lib/utils';
import { calculateValuation } from '@/lib/calculate';
import { mapBusinessType } from '@/lib/business-type-mapper';
import { 
  Share2, Download, ArrowRight, TrendingUp, Award, 
  Lock, Mail, CheckCircle, Star, Trophy, Target,
  Users, Zap, AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { 
  calculateRank, 
  generateExitAnalysis, 
  generateRivals 
} from '@/lib/fake-data';
import { 
  saveEmailLead, 
  checkEmailSubmitted, 
  getUnlockedData 
} from '@/lib/email-service';
import confetti from 'canvas-confetti';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [rankData, setRankData] = useState<any>(null);
  const [exitAnalysis, setExitAnalysis] = useState<any>(null);
  const [rivals, setRivals] = useState<any>(null);
  const [stage, setStage] = useState<'basic' | 'teaser' | 'unlocked'>('basic');

  useEffect(() => {
    const calculateResult = async () => {
      // Check if already unlocked
      const unlocked = checkEmailSubmitted();
      if (unlocked) {
        setIsUnlocked(true);
        setStage('unlocked');
      }

      // Get valuation answers
      let saved = localStorage.getItem('valuation_answers');
      let answers;
      
      if (!saved) {
        const draft = localStorage.getItem('tracker_draft');
        if (!draft) {
          router.push('/valuation');
          return;
        }
        const draftData = JSON.parse(draft);
        answers = draftData.answers;
      } else {
        answers = JSON.parse(saved);
      }

      if (!answers) {
        router.push('/valuation');
        return;
      }
      
      try {
        const valuationResult = await calculateValuation({
          businessType: mapBusinessType(answers.businessType),
          monthlyRevenue: answers.monthlyRevenue || 0,
          monthlyProfit: answers.monthlyProfit || 0,
          subscribers: answers.subscribers || 0,
          growthRate: answers.growthRate as any,
          businessAge: answers.businessAge as any,
        });
        
        // Generate additional data
        const rank = calculateRank(valuationResult.value);
        const exit = generateExitAnalysis(valuationResult.value, answers.growthRate);
        const rivalData = generateRivals(valuationResult.value, rank.nationalRank);
        
        setResult({
          ...valuationResult,
          businessType: answers.businessType,
          answers
        });
        setRankData(rank);
        setExitAnalysis(exit);
        setRivals(rivalData);
        
        // Stage progression
        if (!unlocked) {
          setTimeout(() => setStage('teaser'), 2000);
        }
      } catch (error) {
        console.error('Calculation error:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateResult();
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !marketingConsent) {
      alert('이메일과 마케팅 수신 동의가 필요합니다.');
      return;
    }

    try {
      await saveEmailLead({
        email,
        businessType: result.businessType,
        value: result.value,
        nationalRank: rankData.nationalRank,
        percentile: rankData.percentile,
        createdAt: new Date(),
        source: 'result_page',
        marketingConsent
      });

      // Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsUnlocked(true);
      setStage('unlocked');
      setShowEmailModal(false);
    } catch (error) {
      console.error('Email save error:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="toss-container flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-toss-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-toss-body text-toss-gray-600">가치를 계산하고 있어요...</p>
        </motion.div>
      </div>
    );
  }

  if (!result || !rankData) return null;

  const getPercentileBg = (percentile: number) => {
    if (percentile >= 75) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (percentile >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (percentile >= 25) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  // Chart data
  const chartData = [
    { name: '하위 25%', value: result.value * 0.5 },
    { name: '평균', value: result.value * 0.8 },
    { name: '내 비즈니스', value: result.value },
    { name: '상위 25%', value: result.value * 1.3 },
  ];

  const colors = ['#E5E8EB', '#B0B8C1', '#0064FF', '#00C853'];

  return (
    <div className="toss-container pb-20">
      {/* Stage 1: Basic Result */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-8 bg-gradient-to-b from-toss-blue-lighter to-white"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-toss-full mb-6"
          >
            <Award className="w-5 h-5 text-toss-blue" />
            <span className="text-toss-body font-medium text-toss-gray-900">
              평가 완료
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-toss-h1 text-toss-gray-900 mb-4"
          >
            당신의 비즈니스 가치
          </motion.h1>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="text-5xl font-bold text-toss-blue mb-4"
          >
            {formatCurrency(result.value)}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`inline-flex items-center gap-2 px-4 py-2 ${getPercentileBg(rankData.percentile)} text-white rounded-toss-full`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">상위 {100 - rankData.percentile}%</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Stage 2: Teaser Content (Blurred) */}
      {stage !== 'basic' && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-6 py-8"
        >
          <div className="relative">
            {/* Blurred content */}
            <div className={stage === 'teaser' ? 'filter blur-sm pointer-events-none' : ''}>
              {/* Ranking Card */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-toss-xl border border-purple-200 p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-toss-h3 text-toss-gray-900">🏆 전국 순위</h3>
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-toss-caption text-toss-gray-600">전체 순위</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {rankData.nationalRank.toLocaleString()}위
                    </p>
                    <p className="text-xs text-gray-500">
                      전체 {rankData.totalUsers.toLocaleString()}명 중
                    </p>
                  </div>
                  <div>
                    <p className="text-toss-caption text-toss-gray-600">업종 순위</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {rankData.industryRank.toLocaleString()}위
                    </p>
                    <p className="text-xs text-gray-500">
                      업종 {rankData.industryTotal.toLocaleString()}명 중
                    </p>
                  </div>
                </div>
              </div>

              {/* EXIT Analysis */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-toss-xl border border-green-200 p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-toss-h3 text-toss-gray-900">📊 EXIT 분석</h3>
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">6개월 후 예상</span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(exitAnalysis.sixMonths)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">1년 후 예상</span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(exitAnalysis.oneYear)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">최적 EXIT 시기</span>
                      <span className="text-sm font-bold text-green-700">
                        {exitAnalysis.optimal.timing}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">예상 가치</span>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(exitAnalysis.optimal.value)}
                      </span>
                    </div>
                    <div className="mt-2 bg-green-100 rounded-lg p-2">
                      <p className="text-xs text-green-700 text-center">
                        성공 확률 {exitAnalysis.optimal.probability}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rivals */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-toss-xl border border-red-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-toss-h3 text-toss-gray-900">⚔️ 라이벌 분석</h3>
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        👆 {rivals.ahead.rank}위 ({rivals.ahead.type})
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        +{formatCurrency(rivals.ahead.gap)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      가치: {formatCurrency(rivals.ahead.value)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        👇 {rivals.behind.rank}위 ({rivals.behind.type})
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        +{formatCurrency(rivals.behind.gap)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      가치: {formatCurrency(rivals.behind.value)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lock overlay for teaser */}
            {stage === 'teaser' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-sm text-center"
                >
                  <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    상세 분석 잠김
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    전국 순위, EXIT 전략, 라이벌 분석 등<br />
                    더 자세한 인사이트를 확인하세요
                  </p>
                  <TossButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<Mail className="w-5 h-5" />}
                    onClick={() => setShowEmailModal(true)}
                  >
                    무료로 전체 결과 받기
                  </TossButton>
                  <p className="text-xs text-gray-500 mt-3">
                    24시간 한정 무료 제공
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Chart (Always visible) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="px-6 py-8"
      >
        <div className="bg-white rounded-toss-xl border border-toss-gray-100 p-6">
          <h2 className="text-toss-h3 text-toss-gray-900 mb-4">업종 내 포지션</h2>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F6" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6B7684' }}
                axisLine={{ stroke: '#E5E8EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7684' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                axisLine={{ stroke: '#E5E8EB' }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E8EB',
                  borderRadius: '12px'
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Action Buttons */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="px-6 py-8 space-y-3"
      >
        {stage === 'unlocked' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">
                전체 분석이 잠금 해제되었습니다!
              </p>
            </div>
          </div>
        )}

        <TossButton
          variant="primary"
          size="lg"
          fullWidth
          icon={<Share2 className="w-5 h-5" />}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: '내 비즈니스 가치 측정 결과',
                text: `내 비즈니스 가치는 ${formatCurrency(result.value)}! 상위 ${100 - rankData.percentile}%에 속해요.`,
                url: window.location.origin
              });
            }
          }}
        >
          결과 공유하기
        </TossButton>

        {stage !== 'unlocked' && (
          <TossButton
            variant="secondary"
            size="lg"
            fullWidth
            icon={<Lock className="w-5 h-5" />}
            onClick={() => setShowEmailModal(true)}
          >
            상세 분석 잠금 해제
          </TossButton>
        )}

        <TossButton
          variant="ghost"
          size="lg"
          fullWidth
          onClick={() => {
            localStorage.removeItem('valuation_answers');
            localStorage.removeItem('tracker_draft');
            router.push('/');
          }}
        >
          처음으로 돌아가기
        </TossButton>
      </motion.section>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  무료로 전체 분석 받기
                </h3>
                <p className="text-sm text-gray-600">
                  이메일 주소만 입력하시면<br />
                  상세한 분석 결과를 모두 확인하실 수 있습니다
                </p>
              </div>

              <form onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                  required
                />

                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    비즈니스 성장을 위한 유용한 정보와<br />
                    업데이트 소식을 받아보겠습니다
                  </span>
                </label>

                <TossButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!email || !marketingConsent}
                >
                  잠금 해제하기
                </TossButton>

                <p className="text-xs text-center text-gray-500 mt-4">
                  언제든지 구독을 해지할 수 있습니다
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}