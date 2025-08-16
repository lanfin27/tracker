'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useValuationStore } from '@/lib/store';
import { Calculator } from 'lucide-react';

interface Step3Props {
  onNext: () => void;
}

export default function Step3Profit({ onNext }: Step3Props) {
  const { input, setInput } = useValuationStore();
  const [profit, setProfit] = useState(input.monthlyProfit?.toString() || '');
  const [profitMargin, setProfitMargin] = useState(30);

  useEffect(() => {
    if (input.monthlyRevenue && profitMargin > 0) {
      const calculatedProfit = Math.round(input.monthlyRevenue * (profitMargin / 100));
      setProfit(calculatedProfit.toString());
    }
  }, [profitMargin, input.monthlyRevenue]);

  const handleSubmit = () => {
    const numericProfit = parseInt(profit.replace(/[^0-9]/g, ''));
    if (!isNaN(numericProfit)) {
      setInput({ monthlyProfit: numericProfit });
    } else {
      setInput({ monthlyProfit: 0 });
    }
    onNext();
  };

  const formatNumber = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setProfit(formatted);
  };

  const quickMargins = [10, 20, 30, 40, 50];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          월 평균 순수익은?
        </h2>
        <p className="text-gray-600">
          비용을 제외한 순수익을 입력해주세요
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          {input.monthlyRevenue && input.monthlyRevenue > 0 && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Calculator className="w-4 h-4" />
                <span>간단 계산기</span>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">수익률 선택</Label>
                <div className="flex gap-2">
                  {quickMargins.map((margin) => (
                    <Button
                      key={margin}
                      type="button"
                      variant={profitMargin === margin ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setProfitMargin(margin)}
                    >
                      {margin}%
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  매출의 {profitMargin}% = {formatNumber(Math.round(input.monthlyRevenue * (profitMargin / 100)).toString())}원
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="profit" className="text-base">월 평균 순수익</Label>
            <div className="relative">
              <Input
                id="profit"
                type="text"
                placeholder="300,000"
                value={profit}
                onChange={handleInputChange}
                className="text-lg pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                원
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setProfit('0');
            }}
          >
            아직 수익이 없어요
          </Button>

          {profit && parseInt(profit.replace(/[^0-9]/g, '')) > 0 && (
            <p className="text-sm text-gray-600 text-center">
              연 수익: 약 {formatNumber((parseInt(profit.replace(/[^0-9]/g, '')) * 12).toString())}원
            </p>
          )}

          <Button
            onClick={handleSubmit}
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