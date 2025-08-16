'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X, Mail, CheckCircle } from 'lucide-react';
import { ValuationResult, BusinessType } from '@/types/valuation';

interface EmailCaptureProps {
  onClose: () => void;
  valuationResult: ValuationResult;
  businessType: BusinessType;
}

export default function EmailCapture({ onClose, valuationResult, businessType }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement actual email capture logic with Supabase
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-2xl">상세 리포트 받기</CardTitle>
          <CardDescription>
            이메일로 상세한 분석 리포트를 보내드려요
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">리포트를 발송했어요!</h3>
              <p className="text-gray-600">
                입력하신 이메일로 상세 리포트를 전송했습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-blue-900">리포트에 포함된 내용:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 업종별 상세 비교 분석</li>
                  <li>• 가치 상승을 위한 전략 제안</li>
                  <li>• 시장 트렌드 및 인사이트</li>
                  <li>• M&A 시장 동향</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    발송 중...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 w-4 h-4" />
                    리포트 받기
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                이메일은 리포트 발송 용도로만 사용되며, 마케팅 목적으로 사용되지 않습니다.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}