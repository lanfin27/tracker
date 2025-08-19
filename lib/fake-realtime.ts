// 실시간처럼 보이는 데이터 생성기

// 실시간 알림 메시지 풀
const locations = ['서울', '강남', '판교', '부산', '대구', '인천', '광주', '분당', '송파', '성남'];
const businessTypes = ['유튜버', '이커머스', 'SaaS', '블로거', '스타트업', '인스타그래머', '쇼핑몰', '앱 개발자'];

// 초기 카운터 값 (시간대별로 다르게)
export const getInitialCounter = () => {
  const hour = new Date().getHours();
  const base = hour < 12 ? 234 : 456; // 오후가 더 많음
  return base + Math.floor(Math.random() * 100);
};

// 실시간 알림 생성기
export const generateNotification = () => {
  const notifications = [
    () => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const type = businessTypes[Math.floor(Math.random() * businessTypes.length)];
      const value = (Math.random() * 3 + 1).toFixed(1);
      return `방금 ${location}의 ${type}가 ${value}억 달성`;
    },
    () => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const type = businessTypes[Math.floor(Math.random() * businessTypes.length)];
      const percent = Math.floor(Math.random() * 15) + 1;
      return `${location}의 ${type}가 상위 ${percent}% 진입`;
    },
    () => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const type = businessTypes[Math.floor(Math.random() * businessTypes.length)];
      const growth = Math.floor(Math.random() * 50) + 10;
      return `${location}의 ${type}가 전월 대비 ${growth}% 성장`;
    },
    () => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const clubs = ['실버', '골드', '플래티넘'];
      const club = clubs[Math.floor(Math.random() * clubs.length)];
      return `${location}의 사업가가 ${club} 클럽 승급`;
    },
    () => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const value = (Math.random() * 4 + 1).toFixed(1);
      return `${location}의 스타트업이 ${value}억 EXIT 성공`;
    }
  ];

  const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
  return randomNotification();
};

// 순위 계산 (정규분포 기반)
export const calculateRanking = (value: number) => {
  const totalUsers = 12384 + Math.floor(Math.random() * 1000);
  const mean = 150000000; // 1.5억
  const std = 80000000; // 0.8억
  
  // z-score 기반 순위 계산
  const zScore = (value - mean) / std;
  const percentile = Math.min(99, Math.max(1, 50 + zScore * 20));
  const rank = Math.round(totalUsers * (100 - percentile) / 100);
  
  return {
    nationalRank: Math.max(1, rank),
    totalUsers,
    percentile: Math.round(percentile),
    industryRank: Math.max(1, Math.floor(rank / 7)),
    industryTotal: Math.floor(totalUsers / 7),
    club: value > 1000000000 ? '골드' : value > 500000000 ? '실버' : '브론즈'
  };
};

// 라이벌 생성 (경쟁심 유발)
export const generateRivals = (value: number, rank: number) => {
  const types = ['유튜버', '이커머스', 'SaaS', '블로거', '스타트업', '쇼핑몰'];
  
  const ahead = {
    rank: Math.max(1, rank - Math.floor(Math.random() * 10 + 1)),
    value: value * (1 + Math.random() * 0.1 + 0.05),
    gap: value * (Math.random() * 0.1 + 0.05),
    type: types[Math.floor(Math.random() * types.length)]
  };
  
  const behind = {
    rank: rank + Math.floor(Math.random() * 10 + 1),
    value: value * (1 - Math.random() * 0.1 - 0.05),
    gap: value * (Math.random() * 0.1 + 0.05),
    type: types[Math.floor(Math.random() * types.length)]
  };
  
  return { ahead, behind };
};

// 블러 처리된 가짜 순위 데이터
export const getBlurredRankingData = () => {
  return [
    { rank: 1, type: '유튜브', value: '12.3억', location: '강남' },
    { rank: 2, type: 'SaaS', value: '8.7억', location: '판교' },
    { rank: 3, type: '이커머스', value: '6.5억', location: '서울' },
    { rank: 4, type: '인스타그램', value: '5.2억', location: '성남' },
    { rank: 5, type: '블로그', value: '4.8억', location: '부산' }
  ];
};

// EXIT 예측
export const predictExit = (currentValue: number) => {
  const growth6Month = 1.2 + Math.random() * 0.3; // 20-50% 성장
  const growth1Year = 1.5 + Math.random() * 0.5; // 50-100% 성장
  const optimalMonth = Math.floor(Math.random() * 6) + 6; // 6-12개월
  const optimalGrowth = 1.3 + Math.random() * 0.4; // 30-70% 성장
  const successRate = Math.floor(Math.random() * 20) + 65; // 65-85%
  
  return {
    sixMonth: Math.round(currentValue * growth6Month),
    oneYear: Math.round(currentValue * growth1Year),
    optimal: {
      month: optimalMonth,
      value: Math.round(currentValue * optimalGrowth),
      successRate
    }
  };
};

// 가치 포맷팅
export const formatValue = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000000) {
    return `${Math.round(value / 10000000) / 10}억`;
  }
  if (value >= 10000) {
    return `${Math.round(value / 10000)}만`;
  }
  return value.toLocaleString();
};