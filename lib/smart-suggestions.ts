import { BusinessType } from '@/types/valuation';

// 업종별 평균 데이터 (실제 Flippa 데이터 기반)
const industryAverages = {
  YouTube: {
    monthlyRevenue: { min: 500000, avg: 2000000, max: 10000000 },
    monthlyProfit: { min: 200000, avg: 800000, max: 4000000 },
    profitMargin: { min: 30, avg: 40, max: 50 },
    subscribers: { min: 10000, avg: 100000, max: 1000000 },
    revenuePerSubscriber: { min: 50, avg: 200, max: 500 }
  },
  Instagram: {
    monthlyRevenue: { min: 300000, avg: 1500000, max: 8000000 },
    monthlyProfit: { min: 150000, avg: 600000, max: 3200000 },
    profitMargin: { min: 35, avg: 40, max: 45 },
    subscribers: { min: 5000, avg: 50000, max: 500000 },
    revenuePerSubscriber: { min: 60, avg: 300, max: 600 }
  },
  TikTok: {
    monthlyRevenue: { min: 200000, avg: 1000000, max: 5000000 },
    monthlyProfit: { min: 80000, avg: 350000, max: 1750000 },
    profitMargin: { min: 25, avg: 35, max: 40 },
    subscribers: { min: 20000, avg: 200000, max: 2000000 },
    revenuePerSubscriber: { min: 10, avg: 50, max: 100 }
  },
  Ecommerce: {
    monthlyRevenue: { min: 1000000, avg: 5000000, max: 20000000 },
    monthlyProfit: { min: 200000, avg: 1000000, max: 4000000 },
    profitMargin: { min: 15, avg: 20, max: 25 }
  },
  'SaaS/App': {
    monthlyRevenue: { min: 500000, avg: 3000000, max: 15000000 },
    monthlyProfit: { min: 350000, avg: 2100000, max: 10500000 },
    profitMargin: { min: 60, avg: 70, max: 80 }
  },
  'Content/Blog': {
    monthlyRevenue: { min: 100000, avg: 500000, max: 2000000 },
    monthlyProfit: { min: 80000, avg: 400000, max: 1600000 },
    profitMargin: { min: 70, avg: 80, max: 85 }
  },
  Website: {
    monthlyRevenue: { min: 200000, avg: 1000000, max: 5000000 },
    monthlyProfit: { min: 140000, avg: 700000, max: 3500000 },
    profitMargin: { min: 60, avg: 70, max: 75 }
  }
};

// 매출 추천
export function getRevenueSuggestion(
  businessType: BusinessType,
  subscribers?: number
): { value: number; label: string } | null {
  const averages = industryAverages[businessType];
  if (!averages) return null;

  // SNS 채널의 경우 구독자 기반 추천
  if (subscribers && 'revenuePerSubscriber' in averages) {
    const estimatedRevenue = subscribers * averages.revenuePerSubscriber.avg;
    return {
      value: Math.round(estimatedRevenue / 100) * 100,
      label: `${businessType} ${subscribers.toLocaleString()}명 구독자 평균 매출`
    };
  }

  // 일반적인 업종 평균
  return {
    value: averages.monthlyRevenue.avg,
    label: `${businessType} 업종 평균 매출`
  };
}

// 수익 추천
export function getProfitSuggestion(
  businessType: BusinessType,
  monthlyRevenue: number
): { value: number; label: string } | null {
  const averages = industryAverages[businessType];
  if (!averages) return null;

  const profitMargin = averages.profitMargin.avg / 100;
  const suggestedProfit = Math.round(monthlyRevenue * profitMargin);

  return {
    value: suggestedProfit,
    label: `매출의 ${averages.profitMargin.avg}% (${businessType} 평균 수익률)`
  };
}

// 구독자 기반 매출 추정
export function getSubscriberBasedRevenue(
  businessType: BusinessType,
  subscribers: number
): number | null {
  const averages = industryAverages[businessType];
  if (!averages || !('revenuePerSubscriber' in averages)) return null;

  return subscribers * averages.revenuePerSubscriber.avg;
}

// 성장률 추천
export function getGrowthRateSuggestion(
  monthlyRevenue: number,
  previousRevenue?: number
): 'rapid' | 'steady' | 'stable' | 'declining' | null {
  if (!previousRevenue) return null;

  const growthRate = ((monthlyRevenue - previousRevenue) / previousRevenue) * 100;

  if (growthRate >= 20) return 'rapid';
  if (growthRate >= 10) return 'steady';
  if (growthRate >= 0) return 'stable';
  return 'declining';
}

// 입력값 검증
export function validateInput(
  field: string,
  value: number,
  businessType?: BusinessType,
  relatedValue?: number
): { isValid: boolean; error?: string; warning?: string } {
  // 음수 체크
  if (value < 0) {
    return { isValid: false, error: '0 이상의 값을 입력해주세요' };
  }

  // 최대값 체크
  const MAX_VALUE = 100000000000; // 1000억
  if (value > MAX_VALUE) {
    return { isValid: false, error: '입력 가능한 최대값을 초과했습니다' };
  }

  // 필드별 검증
  switch (field) {
    case 'revenue':
      if (value === 0) {
        return { isValid: true, warning: '매출이 없으면 가치 평가가 제한적일 수 있습니다' };
      }
      if (businessType) {
        const avg = industryAverages[businessType]?.monthlyRevenue;
        if (avg && value > avg.max * 2) {
          return { isValid: true, warning: '업종 평균보다 매우 높은 매출입니다. 정확한 값인지 확인해주세요' };
        }
      }
      break;

    case 'profit':
      if (relatedValue && value > relatedValue) {
        return { isValid: false, error: '수익이 매출보다 클 수 없습니다' };
      }
      if (relatedValue && businessType) {
        const expectedMargin = industryAverages[businessType]?.profitMargin;
        if (expectedMargin) {
          const actualMargin = (value / relatedValue) * 100;
          if (actualMargin > expectedMargin.max * 1.5) {
            return { isValid: true, warning: '수익률이 업종 평균보다 매우 높습니다' };
          }
        }
      }
      break;

    case 'subscribers':
      if (value === 0) {
        return { isValid: false, error: '1명 이상의 구독자/팔로워가 필요합니다' };
      }
      if (value > 100000000) {
        return { isValid: true, warning: '매우 많은 구독자 수입니다. 정확한 값인지 확인해주세요' };
      }
      break;
  }

  return { isValid: true };
}

// 벤치마크 데이터 가져오기
export function getBenchmarkData(businessType: BusinessType) {
  const data = industryAverages[businessType];
  if (!data) return null;

  return {
    revenue: {
      low: data.monthlyRevenue.min,
      average: data.monthlyRevenue.avg,
      high: data.monthlyRevenue.max
    },
    profit: {
      low: data.monthlyProfit.min,
      average: data.monthlyProfit.avg,
      high: data.monthlyProfit.max
    },
    profitMargin: data.profitMargin,
    subscribers: 'subscribers' in data ? {
      low: data.subscribers.min,
      average: data.subscribers.avg,
      high: data.subscribers.max
    } : null
  };
}