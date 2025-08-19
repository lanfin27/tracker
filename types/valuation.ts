export type BusinessType = 
  | 'YouTube'
  | 'Instagram'
  | 'TikTok'
  | 'Ecommerce'
  | 'SaaS/App'
  | 'Content/Blog'
  | 'Website';

export type GrowthRate = 'rapid' | 'steady' | 'stable' | 'declining';
export type BusinessAge = 'new' | 'growing' | 'established' | 'mature';

export interface BusinessMultiples {
  business_type: BusinessType;
  revenue_multiple_mean: number;
  revenue_multiple_median: number;
  revenue_multiple_q1: number;
  revenue_multiple_q3: number;
  profit_multiple_mean: number;
  profit_multiple_median: number;
  profit_multiple_q1: number;
  profit_multiple_q3: number;
  sample_count: number;
}

export interface ValuationInput {
  businessType: BusinessType;
  monthlyRevenue: number;
  monthlyProfit: number;
  subscribers?: number;
  growthRate?: GrowthRate;
  businessAge: BusinessAge;
}

export interface ValuationResult {
  value: number;
  percentile: number;
  breakdown: {
    revenueMultiple: number;
    profitMultiple: number;
    growthAdjustment: number;
    ageAdjustment: number;
  };
}

export interface ValuationRecord {
  id: string;
  session_id: string;
  business_type: BusinessType;
  monthly_revenue: number;
  monthly_profit: number;
  subscribers?: number;
  growth_rate: GrowthRate;
  business_age: BusinessAge;
  calculated_value: number;
  percentile: number;
  created_at: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface EmailLead {
  id: string;
  email: string;
  valuation_id: string;
  business_type: BusinessType;
  calculated_value: number;
  subscribed: boolean;
  created_at: string;
}