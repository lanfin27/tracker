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
  const [category, setCategory] = useState('');
  
  // 비즈니스 타입별 설정
  const config = {
    youtube: {
      subscriberLabel: '구독자 수',
      subscriberPlaceholder: '예: 50000',
      viewsLabel: '최근 영상 평균 조회수',
      viewsPlaceholder: '최근 10개 영상 평균',
      categories: [
        '교육/강의', '금융/경제', '테크/IT', 
        '뷰티/패션', '요리/먹방', '엔터테인먼트', 
        '일상/브이로그', '게임', '키즈', '기타'
      ],
      benchmarks: [
        { subs: 10000, value: '300만원 ~ 520만원' },
        { subs: 100000, value: '3천만원 ~ 5.2억원' },
        { subs: 1000000, value: '3억원 ~ 52억원' }
      ]
    },
    instagram: {
      subscriberLabel: '팔로워 수',
      subscriberPlaceholder: '예: 30000',
      viewsLabel: '게시물당 평균 조회수',
      viewsPlaceholder: '최근 10개 게시물 평균',
      categories: [
        '패션', '뷰티', '피트니스', '여행', 
        '음식', '라이프스타일', '사진', '예술', '펫', '기타'
      ],
      benchmarks: [
        { subs: 10000, value: '120만원 ~ 210만원' },
        { subs: 50000, value: '600만원 ~ 1,050만원' },
        { subs: 100000, value: '1,200만원 ~ 3,150만원' }
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
        { subs: 10000, value: '100만원 ~ 180만원' },
        { subs: 100000, value: '1,000만원 ~ 2,520만원' },
        { subs: 1000000, value: '1억원 ~ 25억원' }
      ]
    }
  };
  
  const currentConfig = config[businessType];
  
  // 구독자 수 입력 시 처리
  const handleSubscriberChange = (value: string) => {
    setSubscribers(value);
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
        
        
        <div className="relative">
          <input
            type="number"
            value={subscribers}
            onChange={(e) => handleSubscriberChange(e.target.value)}
            placeholder={currentConfig.subscriberPlaceholder}
            className="w-full px-6 py-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-2xl focus:border-purple-600 focus:outline-none transition-colors"
            autoFocus
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
            명
          </span>
        </div>
      </div>
      
      {/* 조회수 입력 - YouTube와 TikTok만 표시 */}
      {businessType !== 'instagram' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentConfig.viewsLabel}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {currentConfig.viewsPlaceholder}
          </p>
          
          <input
            type="number"
            value={avgViews}
            onChange={(e) => setAvgViews(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
          />
        </div>
      )}
      
      
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
                  ? 'border-purple-600 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <span className="text-sm font-medium">{cat}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 다음 버튼 */}
      <button
        onClick={() => {
          // 디버깅 로그 추가
          console.log('📊 SNS Metrics Input:', {
            businessType: businessType,
            subscribers: subscribers,
            avgViews: businessType === 'instagram' ? '0 (Instagram - 자동설정)' : avgViews,
            parsedSubscribers: parseInt(subscribers) || 0,
            parsedAvgViews: businessType === 'instagram' ? 0 : parseInt(avgViews) || 0,
            category
          });
          
          onNext({
            subscribers: parseInt(subscribers) || 0,
            avgViews: businessType === 'instagram' ? 0 : parseInt(avgViews) || 0,
            avgLikes: 0,
            category
          });
        }}
        disabled={!subscribers || Number(subscribers) <= 0}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          subscribers && Number(subscribers) > 0
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        다음
      </button>
    </div>
  );
}