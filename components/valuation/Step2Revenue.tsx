'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useValuationStore } from '@/lib/store';

interface Step2Props {
  onNext: () => void;
}

export default function Step2Revenue({ onNext }: Step2Props) {
  const { input, setInput } = useValuationStore();
  const [revenue, setRevenue] = useState(input.monthlyRevenue?.toString() || '');
  const [hasNoRevenue, setHasNoRevenue] = useState(false);

  const handleSubmit = () => {
    if (hasNoRevenue) {
      setInput({ monthlyRevenue: 0 });
    } else {
      const numericRevenue = parseInt(revenue.replace(/[^0-9]/g, ''));
      if (!isNaN(numericRevenue)) {
        setInput({ monthlyRevenue: numericRevenue });
      }
    }
    onNext();
  };

  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setRevenue(formatted);
    setHasNoRevenue(false);
  };

  const isValid = hasNoRevenue || (revenue && parseInt(revenue.replace(/[^0-9]/g, '')) > 0);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          최근 3개월 평균 월 매출은?
        </h2>
        <p className="text-gray-600">
          대략적인 금액을 입력해주세요
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="revenue" className="text-base">월 평균 매출</Label>
            <div className="relative">
              <Input
                id="revenue"
                type="text"
                placeholder="1,000,000"
                value={revenue}
                onChange={handleInputChange}
                className="text-lg pr-12"
                disabled={hasNoRevenue}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                원
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={hasNoRevenue ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setHasNoRevenue(true);
                setRevenue('');
              }}
            >
              아직 매출이 없어요
            </Button>
          </div>

          {revenue && !hasNoRevenue && (
            <p className="text-sm text-gray-600 text-center">
              연 매출: 약 {formatNumber((parseInt(revenue.replace(/[^0-9]/g, '')) * 12).toString())}원
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            size="lg"
            className="w-full"
          >
            다음
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}