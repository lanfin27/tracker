'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useValuationStore } from '@/lib/store';
import { Users } from 'lucide-react';

interface Step4Props {
  onNext: () => void;
}

export default function Step4Subscribers({ onNext }: Step4Props) {
  const { input, setInput } = useValuationStore();
  const [subscribers, setSubscribers] = useState(input.subscribers?.toString() || '');

  const handleSubmit = () => {
    const numericSubscribers = parseInt(subscribers.replace(/[^0-9]/g, ''));
    if (!isNaN(numericSubscribers)) {
      setInput({ subscribers: numericSubscribers });
    } else {
      setInput({ subscribers: 0 });
    }
    onNext();
  };

  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setSubscribers(formatted);
  };

  const getLabel = () => {
    switch (input.businessType) {
      case 'YouTube':
        return '구독자';
      case 'Instagram':
      case 'TikTok':
        return '팔로워';
      default:
        return '구독자/팔로워';
    }
  };

  const getPlaceholder = () => {
    switch (input.businessType) {
      case 'YouTube':
        return '10,000';
      case 'Instagram':
        return '5,000';
      case 'TikTok':
        return '20,000';
      default:
        return '10,000';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          {getLabel()} 수는?
        </h2>
        <p className="text-gray-600">
          현재 {getLabel()} 수를 입력해주세요
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscribers" className="text-base">{getLabel()} 수</Label>
            <div className="relative">
              <Input
                id="subscribers"
                type="text"
                placeholder={getPlaceholder()}
                value={subscribers}
                onChange={handleInputChange}
                className="text-lg pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                명
              </span>
            </div>
          </div>

          {subscribers && parseInt(subscribers.replace(/[^0-9]/g, '')) >= 10000 && (
            <p className="text-sm text-gray-600 text-center">
              {(parseInt(subscribers.replace(/[^0-9]/g, '')) / 10000).toFixed(1)}만 {getLabel()}
            </p>
          )}

          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full"
            disabled={!subscribers || parseInt(subscribers.replace(/[^0-9]/g, '')) === 0}
          >
            다음
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}