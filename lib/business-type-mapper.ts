import { BusinessType } from '@/types/valuation';

/**
 * Maps lowercase business type IDs to proper BusinessType values
 */
export const businessTypeMap: Record<string, BusinessType> = {
  'youtube': 'YouTube',
  'instagram': 'Instagram',
  'tiktok': 'TikTok',
  'ecommerce': 'Ecommerce',
  'saas': 'SaaS/App',
  'blog': 'Content/Blog',
  'website': 'Website'
};

export function mapBusinessType(type: string): BusinessType {
  const mapped = businessTypeMap[type.toLowerCase()];
  if (!mapped) {
    throw new Error(`Unknown business type: ${type}`);
  }
  return mapped;
}