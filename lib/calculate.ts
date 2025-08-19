import { ValuationInput, ValuationResult, BusinessType } from '@/types/valuation';
import { multiplesData } from './multiples-data';

const GROWTH_MULTIPLIERS = {
  rapid: 1.4,
  steady: 1.2,
  stable: 1.0,
  declining: 0.8
};

const AGE_MULTIPLIERS = {
  new: 0.9,
  growing: 1.0,
  established: 1.1,
  mature: 1.2
};

const SUBSCRIBER_VALUES: Record<string, number> = {
  'YouTube': 50,
  'Instagram': 30,
  'TikTok': 20
};

export function calculateSubscriberValue(type: BusinessType, subscribers: number): number {
  if (type in SUBSCRIBER_VALUES) {
    return subscribers * SUBSCRIBER_VALUES[type];
  }
  return 0;
}

export async function calculateValuation(input: ValuationInput): Promise<ValuationResult> {
  const {
    businessType,
    monthlyRevenue,
    monthlyProfit,
    subscribers = 0,
    growthRate = 'stable',
    businessAge
  } = input;

  const multiples = multiplesData[businessType];
  
  if (!multiples) {
    throw new Error(`Invalid business type: ${businessType}`);
  }

  let baseValue = 0;

  const annualRevenue = monthlyRevenue * 12;
  const revenueValue = annualRevenue * multiples.revenue_multiple_median;

  let profitValue = 0;
  if (monthlyProfit > 0) {
    const annualProfit = monthlyProfit * 12;
    profitValue = annualProfit * multiples.profit_multiple_median;
  }

  baseValue = Math.max(revenueValue, profitValue);

  if (['YouTube', 'Instagram', 'TikTok'].includes(businessType) && subscribers) {
    const subscriberValue = calculateSubscriberValue(businessType, subscribers);
    baseValue = Math.max(baseValue, subscriberValue);
  }

  const growthMultiplier = GROWTH_MULTIPLIERS[growthRate];
  const ageMultiplier = AGE_MULTIPLIERS[businessAge];

  const finalValue = baseValue * growthMultiplier * ageMultiplier;

  const percentile = await calculatePercentile(businessType, finalValue);

  return {
    value: Math.round(finalValue),
    percentile,
    breakdown: {
      revenueMultiple: multiples.revenue_multiple_median,
      profitMultiple: multiples.profit_multiple_median,
      growthAdjustment: growthMultiplier,
      ageAdjustment: ageMultiplier
    }
  };
}

async function calculatePercentile(businessType: BusinessType, value: number): Promise<number> {
  const multiples = multiplesData[businessType];
  
  if (!multiples) return 50;

  const avgMultiple = (multiples.revenue_multiple_mean + multiples.profit_multiple_mean) / 2;
  const q1Multiple = (multiples.revenue_multiple_q1 + multiples.profit_multiple_q1) / 2;
  const q3Multiple = (multiples.revenue_multiple_q3 + multiples.profit_multiple_q3) / 2;

  const normalizedValue = value / 1000000;
  const normalizedAvg = avgMultiple * 2;
  const normalizedQ1 = q1Multiple * 2;
  const normalizedQ3 = q3Multiple * 2;

  if (normalizedValue <= normalizedQ1) {
    return Math.round((normalizedValue / normalizedQ1) * 25);
  } else if (normalizedValue <= normalizedAvg) {
    return Math.round(25 + ((normalizedValue - normalizedQ1) / (normalizedAvg - normalizedQ1)) * 25);
  } else if (normalizedValue <= normalizedQ3) {
    return Math.round(50 + ((normalizedValue - normalizedAvg) / (normalizedQ3 - normalizedAvg)) * 25);
  } else {
    return Math.min(99, Math.round(75 + ((normalizedValue - normalizedQ3) / normalizedQ3) * 25));
  }
}