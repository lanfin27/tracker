'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BusinessType } from '@/types/valuation';
import { formatCurrency } from '@/lib/utils';
import { multiplesData } from '@/lib/multiples-data';

interface ValuationChartProps {
  businessType: BusinessType;
  value: number;
  percentile: number;
}

export default function ValuationChart({ businessType, value, percentile }: ValuationChartProps) {
  const multiples = multiplesData[businessType];
  
  const mockAverageRevenue = 1000000;
  const data = [
    {
      name: '하위 25%',
      value: multiples.revenue_multiple_q1 * mockAverageRevenue * 12,
    },
    {
      name: '평균',
      value: multiples.revenue_multiple_median * mockAverageRevenue * 12,
    },
    {
      name: '상위 25%',
      value: multiples.revenue_multiple_q3 * mockAverageRevenue * 12,
    },
    {
      name: '내 비즈니스',
      value: value,
      isYours: true,
    },
  ].sort((a, b) => a.value - b.value);

  const colors = ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#3b82f6'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tickFormatter={(value) => formatCurrency(value)}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.isYours ? '#3b82f6' : colors[index % colors.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}