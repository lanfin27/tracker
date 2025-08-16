// 실시간처럼 보이는 가짜 데이터 생성

export const liveNotifications = [
  "방금 서울의 유튜버가 2.3억 달성",
  "강남의 이커머스가 상위 5% 진입", 
  "부산의 SaaS가 전월 대비 34% 성장",
  "인천의 블로거가 실버 클럽 승급",
  "대구의 앱 개발자가 3.2억 EXIT 성공",
  "분당의 인스타그래머가 1.8억 측정",
  "판교의 개발자가 골드 클럽 진입",
  "제주의 카페 사장이 가치 측정 완료",
  "대전의 쇼핑몰이 상위 10% 달성",
  "광주의 틱톡커가 5천만원 돌파"
];

export const locations = ["서울", "강남", "판교", "분당", "부산", "대구", "인천", "광주", "대전", "제주"];
export const businessTypes = ["유튜버", "이커머스", "SaaS", "블로거", "인스타그래머", "틱톡커", "쇼핑몰", "앱"];

// 초기 카운터 값 (페이지 로드할 때마다 랜덤)
export const getInitialCounter = () => {
  const hour = new Date().getHours();
  // 시간대별로 다른 초기값 (오후가 더 높음)
  const base = hour < 12 ? 100 : 200;
  return base + Math.floor(Math.random() * 100);
};

// 가짜 실시간 알림 생성
export const generateLiveNotification = () => {
  const location = locations[Math.floor(Math.random() * locations.length)];
  const business = businessTypes[Math.floor(Math.random() * businessTypes.length)];
  const value = (Math.random() * 5 + 0.5).toFixed(1);
  
  const templates = [
    `${location}의 ${business}가 ${value}억 달성`,
    `${location}에서 ${business}가 상위 ${Math.floor(Math.random() * 20 + 1)}% 진입`,
    `${location}의 ${business}가 방금 측정 완료`,
    `${location}에서 누군가 ${value}억 기록`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

// 순위 계산 (정규분포 시뮬레이션)
export const calculateRank = (value: number): {
  nationalRank: number;
  totalUsers: number;
  percentile: number;
  industryRank: number;
  industryTotal: number;
} => {
  // 가상의 전체 사용자 수 (계속 증가하는 느낌)
  const baseUsers = 3945;
  const days = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const totalUsers = baseUsers + days * 12; // 하루에 12명씩 증가
  
  // 정규분포 기반 순위 계산
  const mean = 150000000; // 평균 1.5억
  const std = 80000000; // 표준편차 0.8억
  
  // z-score 계산
  const zScore = (value - mean) / std;
  
  // 순위 계산 (높을수록 좋은 순위)
  const percentile = Math.min(99, Math.max(1, 50 + zScore * 20));
  const nationalRank = Math.round(totalUsers * (100 - percentile) / 100);
  
  // 업종별 순위 (전체의 1/7로 가정)
  const industryTotal = Math.floor(totalUsers / 7);
  const industryRank = Math.floor(nationalRank / 7);
  
  return {
    nationalRank: Math.max(1, nationalRank),
    totalUsers,
    percentile: Math.round(percentile),
    industryRank: Math.max(1, industryRank),
    industryTotal
  };
};

// EXIT 분석 생성
export const generateExitAnalysis = (currentValue: number, growthRate: string) => {
  const growthMultipliers = {
    rapid: 2.5,
    steady: 1.8,
    stable: 1.3,
    declining: 0.9
  };
  
  const multiplier = growthMultipliers[growthRate as keyof typeof growthMultipliers] || 1.5;
  
  return {
    current: currentValue,
    sixMonths: Math.round(currentValue * 1.3),
    oneYear: Math.round(currentValue * multiplier),
    optimal: {
      timing: `${Math.floor(Math.random() * 6 + 6)}개월 후`,
      value: Math.round(currentValue * (multiplier * 0.8)),
      probability: Math.floor(Math.random() * 30 + 60) // 60-90%
    }
  };
};

// 라이벌 생성
export const generateRivals = (value: number, rank: number) => {
  return {
    ahead: {
      rank: Math.max(1, rank - Math.floor(Math.random() * 5 + 1)),
      value: Math.round(value * (1 + Math.random() * 0.1 + 0.05)),
      gap: Math.round(value * (Math.random() * 0.1 + 0.05)),
      type: businessTypes[Math.floor(Math.random() * businessTypes.length)]
    },
    behind: {
      rank: rank + Math.floor(Math.random() * 5 + 1),
      value: Math.round(value * (1 - Math.random() * 0.1 - 0.05)),
      gap: Math.round(value * (Math.random() * 0.1 + 0.05)),
      type: businessTypes[Math.floor(Math.random() * businessTypes.length)]
    }
  };
};