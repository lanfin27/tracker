'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStats } from '@/lib/supabase';

interface Stats {
  totalValuations: number;
  totalEmails: number;
  businessTypeStats: Record<string, number>;
  averageValue: number;
  totalPageViews: number;
}

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalValuations: 0,
    totalEmails: 0,
    businessTypeStats: {},
    averageValue: 0,
    totalPageViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number): string => {
    if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억원`;
    if (value >= 10000000) return `${Math.round(value / 10000000)}천만원`;
    if (value >= 10000) return `${Math.round(value / 10000)}만원`;
    return `${value.toLocaleString()}원`;
  };

  const businessTypeLabels: Record<string, string> = {
    youtube: '유튜브',
    instagram: '인스타그램',
    tiktok: '틱톡',
    blog: '블로그',
    ecommerce: '이커머스',
    saas: 'SaaS',
    website: '웹사이트',
    content: '콘텐츠',
    newsletter: '뉴스레터',
    app: '앱',
    other: '기타'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">통계 로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">📊 실시간 통계 대시보드</h1>
          <p className="text-gray-600 mt-2">The Founder Inc. 비즈니스 가치 측정 서비스 현황</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Valuations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-xs text-gray-500">실시간</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalValuations.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">총 가치 측정 수</p>
          </div>

          {/* Total Emails */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <span className="text-xs text-gray-500">누적</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEmails.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">이메일 수집</p>
          </div>

          {/* Average Value */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-xs text-gray-500">평균</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatValue(stats.averageValue)}</p>
            <p className="text-sm text-gray-600 mt-1">평균 가치</p>
          </div>

          {/* Page Views */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👀</span>
              </div>
              <span className="text-xs text-gray-500">누적</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPageViews.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">페이지뷰</p>
          </div>
        </div>

        {/* Business Type Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">비즈니스 타입별 분포</h2>
          
          {Object.keys(stats.businessTypeStats).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.businessTypeStats)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => {
                  const total = Object.values(stats.businessTypeStats).reduce((sum, c) => sum + c, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={type} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium text-gray-700">
                        {businessTypeLabels[type] || type}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                            <div 
                              className="h-full bg-purple-600 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-sm text-gray-600 w-20 text-right">
                            {count}건 ({percentage.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">아직 데이터가 없습니다.</p>
          )}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">전환 퍼널</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">페이지 방문</p>
                  <p className="text-sm text-gray-600">총 방문자 수</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.totalPageViews}</p>
            </div>

            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">가치 측정 완료</p>
                  <p className="text-sm text-gray-600">측정 완료 수</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{stats.totalValuations}</p>
                {stats.totalPageViews > 0 && (
                  <p className="text-xs text-gray-500">
                    전환율: {((stats.totalValuations / stats.totalPageViews) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">이메일 수집</p>
                  <p className="text-sm text-gray-600">리드 전환</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{stats.totalEmails}</p>
                {stats.totalValuations > 0 && (
                  <p className="text-xs text-gray-500">
                    전환율: {((stats.totalEmails / stats.totalValuations) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>📊 30초마다 자동 업데이트 • 마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}</p>
        </div>
      </div>
    </div>
  );
}