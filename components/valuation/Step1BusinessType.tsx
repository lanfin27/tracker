'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useValuationStore } from '@/lib/store';
import { BusinessType } from '@/types/valuation';
import { Youtube, Instagram, Music, ShoppingCart, Code, FileText, Globe } from 'lucide-react';

interface Step1Props {
  onNext: () => void;
}

export default function Step1BusinessType({ onNext }: Step1Props) {
  const { setInput } = useValuationStore();

  const businessTypes = [
    { type: 'YouTube' as BusinessType, icon: Youtube, label: '유튜브 채널', color: 'hover:border-red-500 hover:bg-red-50' },
    { type: 'Instagram' as BusinessType, icon: Instagram, label: '인스타그램 계정', color: 'hover:border-pink-500 hover:bg-pink-50' },
    { type: 'TikTok' as BusinessType, icon: Music, label: '틱톡 계정', color: 'hover:border-purple-500 hover:bg-purple-50' },
    { type: 'Ecommerce' as BusinessType, icon: ShoppingCart, label: '이커머스/쇼핑몰', color: 'hover:border-green-500 hover:bg-green-50' },
    { type: 'SaaS/App' as BusinessType, icon: Code, label: 'SaaS/앱 서비스', color: 'hover:border-blue-500 hover:bg-blue-50' },
    { type: 'Content/Blog' as BusinessType, icon: FileText, label: '블로그/콘텐츠', color: 'hover:border-orange-500 hover:bg-orange-50' },
    { type: 'Website' as BusinessType, icon: Globe, label: '웹사이트/기타', color: 'hover:border-gray-500 hover:bg-gray-50' },
  ];

  const handleSelect = (type: BusinessType) => {
    setInput({ businessType: type });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          어떤 비즈니스를 운영하시나요?
        </h2>
        <p className="text-gray-600">
          가장 가까운 유형을 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businessTypes.map(({ type, icon: Icon, label, color }) => (
          <Card
            key={type}
            className={`cursor-pointer transition-all border-2 ${color}`}
            onClick={() => handleSelect(type)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-lg font-medium">{label}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}