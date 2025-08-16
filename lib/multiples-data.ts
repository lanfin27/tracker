import { BusinessMultiples, BusinessType } from '@/types/valuation';

export const multiplesData: Record<BusinessType, BusinessMultiples> = {
  'YouTube': {
    business_type: 'YouTube',
    revenue_multiple_mean: 1.7,
    revenue_multiple_median: 1.4,
    revenue_multiple_q1: 0.9,
    revenue_multiple_q3: 2.0,
    profit_multiple_mean: 2.0,
    profit_multiple_median: 1.7,
    profit_multiple_q1: 1.2,
    profit_multiple_q3: 2.6,
    sample_count: 241
  },
  'Instagram': {
    business_type: 'Instagram',
    revenue_multiple_mean: 1.3,
    revenue_multiple_median: 0.9,
    revenue_multiple_q1: 0.5,
    revenue_multiple_q3: 1.7,
    profit_multiple_mean: 2.1,
    profit_multiple_median: 1.6,
    profit_multiple_q1: 0.9,
    profit_multiple_q3: 2.9,
    sample_count: 141
  },
  'TikTok': {
    business_type: 'TikTok',
    revenue_multiple_mean: 1.0,
    revenue_multiple_median: 0.6,
    revenue_multiple_q1: 0.3,
    revenue_multiple_q3: 1.3,
    profit_multiple_mean: 1.4,
    profit_multiple_median: 1.1,
    profit_multiple_q1: 0.7,
    profit_multiple_q3: 1.8,
    sample_count: 39
  },
  'Ecommerce': {
    business_type: 'Ecommerce',
    revenue_multiple_mean: 1.0,
    revenue_multiple_median: 0.6,
    revenue_multiple_q1: 0.3,
    revenue_multiple_q3: 1.2,
    profit_multiple_mean: 2.1,
    profit_multiple_median: 1.8,
    profit_multiple_q1: 1.0,
    profit_multiple_q3: 2.8,
    sample_count: 2451
  },
  'SaaS/App': {
    business_type: 'SaaS/App',
    revenue_multiple_mean: 2.2,
    revenue_multiple_median: 1.8,
    revenue_multiple_q1: 1.1,
    revenue_multiple_q3: 2.8,
    profit_multiple_mean: 3.0,
    profit_multiple_median: 2.7,
    profit_multiple_q1: 1.7,
    profit_multiple_q3: 3.8,
    sample_count: 1417
  },
  'Content/Blog': {
    business_type: 'Content/Blog',
    revenue_multiple_mean: 2.8,
    revenue_multiple_median: 2.2,
    revenue_multiple_q1: 1.5,
    revenue_multiple_q3: 3.3,
    profit_multiple_mean: 2.8,
    profit_multiple_median: 2.4,
    profit_multiple_q1: 1.7,
    profit_multiple_q3: 3.6,
    sample_count: 913
  },
  'Website': {
    business_type: 'Website',
    revenue_multiple_mean: 1.6,
    revenue_multiple_median: 1.1,
    revenue_multiple_q1: 0.6,
    revenue_multiple_q3: 1.9,
    profit_multiple_mean: 2.2,
    profit_multiple_median: 1.7,
    profit_multiple_q1: 1.0,
    profit_multiple_q3: 3.1,
    sample_count: 499
  }
};