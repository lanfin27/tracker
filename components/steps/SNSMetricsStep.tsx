'use client';

import { useState, useEffect } from 'react';

interface SNSMetricsStepProps {
  businessType: 'youtube' | 'instagram' | 'tiktok';
  onNext: (data: any) => void;
  previousData: any;
}

export default function SNSMetricsStep({ businessType, onNext, previousData }: SNSMetricsStepProps) {
  const [subscribers, setSubscribers] = useState('');
  const [avgViews, setAvgViews] = useState('');
  const [avgLikes, setAvgLikes] = useState('');
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // 비즈니스 타입별 설정
  const config = {
    youtube: {
      subscriberLabel: '구독자 수',
      subscriberPlaceholder: '예: 50000',
      viewsLabel: '최근 영상 평균 조회수',
      viewsPlaceholder: '최근 10개 영상 평균',
      categories: [
        '교육/강의', '금융/경제', '테크/IT', '부동산', 
        '뷰티/패션', '요리/먹방', '엔터테인먼트', 
        '일상/브이로그', '게임', '키즈', '기타'
      ],
      benchmarks: [
        { subs: 10000, value: '1,800만원' },
        { subs: 100000, value: '3억원' },
        { subs: 1000000, value: '40억원' }
      ]
    },
    instagram: {
      subscriberLabel: '팔로워 수',
      subscriberPlaceholder: '예: 30000',
      viewsLabel: '게시물당 평균 좋아요',
      viewsPlaceholder: '최근 10개 게시물 평균',
      categories: [
        '패션', '뷰티', '피트니스', '여행', 
        '음식', '라이프스타일', '사진', '예술', '펫', '기타'
      ],
      benchmarks: [
        { subs: 10000, value: '1,500만원' },
        { subs: 50000, value: '1.1억원' },
        { subs: 100000, value: '2.8억원' }
      ]
    },
    tiktok: {
      subscriberLabel: '팔로워 수',
      subscriberPlaceholder: '예: 100000',
      viewsLabel: '최근 영상 평균 조회수',
      viewsPlaceholder: '최근 10개 영상 평균',
      categories: [
        '댄스/음악', '코미디', '교육', '요리',
        '뷰티', '게임', '펫', '일상', '기타'
      ],
      benchmarks: [
        { subs: 10000, value: '600만원' },
        { subs: 100000, value: '1억원' },
        { subs: 1000000, value: '20억원' }
      ]
    }
  };
  
  const currentConfig = config[businessType];
  
  // 구독자 수 입력 시 피드백
  const handleSubscriberChange = (value: string) => {
    setSubscribers(value);
    const numValue = Number(value);
    
    if (numValue >= 1000000) {
      setFeedback('🔥 백만 크리에이터! 최상위 0.1%');
    } else if (numValue >= 100000) {
      setFeedback('⭐ 대형 채널! 상위 1%');
    } else if (numValue >= 10000) {
      setFeedback('💎 중견 채널! 상위 5%');
    } else if (numValue >= 1000) {
      setFeedback('🌱 성장 중! 상위 20%');
    } else if (numValue > 0) {
      setFeedback('🚀 시작이 반! 무한한 가능성');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* 구독자/팔로워 수 입력 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {currentConfig.subscriberLabel}는 몇 명인가요?
        </h2>
        <p className="text-gray-600 mb-6">
          정확한 가치 측정의 핵심 지표예요
        </p>
        
        {/* 벤치마크 표시 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
          <p className="text-sm font-medium text-blue-900 mb-2">
            💡 평균 가치 참고
          </p>
          <div className="space-y-1">
            {currentConfig.benchmarks.map((benchmark, idx) => (
              <div key={idx} className="flex justify-between text-sm text-blue-700">
                <span>{benchmark.subs.toLocaleString()}명</span>
                <span className="font-medium">{benchmark.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 피드백 메시지 */}
        {feedback && (
          <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm text-green-700 font-medium">{feedback}</p>
          </div>
        )}
        
        <div className="relative">
          <input
            type="number"
            value={subscribers}
            onChange={(e) => handleSubscriberChange(e.target.value)}
            placeholder={currentConfig.subscriberPlaceholder}
            className="w-full px-6 py-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:outline-none transition-colors"
            autoFocus
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
            명
          </span>
        </div>
      </div>
      
      {/* 조회수/좋아요 입력 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {currentConfig.viewsLabel}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {currentConfig.viewsPlaceholder}
        </p>
        
        <input
          type="number"
          value={businessType === 'instagram' ? avgLikes : avgViews}
          onChange={(e) => businessType === 'instagram' ? setAvgLikes(e.target.value) : setAvgViews(e.target.value)}
          placeholder="0"
          className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none"
        />
      </div>
      
      {/* 카테고리 선택 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          주요 콘텐츠 카테고리
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          카테고리별로 가치가 달라져요
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {currentConfig.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`p-3 rounded-xl border-2 transition-all ${
                category === cat
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-sm font-medium">{cat}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 다음 버튼 */}
      <button
        onClick={() => onNext({
          subscribers: Number(subscribers),
          avgViews: Number(avgViews),
          avgLikes: Number(avgLikes),
          category
        })}
        disabled={!subscribers || Number(subscribers) <= 0}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          subscribers && Number(subscribers) > 0
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </div>
  );
}