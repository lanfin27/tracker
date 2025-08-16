'use client';

import { Button } from '@/components/ui/button';
import { Share2, Link2, MessageCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

interface ShareButtonsProps {
  value: number;
  percentile: number;
}

export default function ShareButtons({ value, percentile }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `내 비즈니스 가치는 ${formatCurrency(value)}! 상위 ${100 - percentile}%에 속해요. 당신의 비즈니스 가치도 측정해보세요!`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tracker.co.kr';

  const handleCopyLink = () => {
    const text = `${shareText}\n${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '내 비즈니스 가치 측정 결과',
          description: shareText,
          imageUrl: `${shareUrl}/og-image.png`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '나도 측정하기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        onClick={handleCopyLink}
        className="flex-1"
      >
        {copied ? (
          '복사됨!'
        ) : (
          <>
            <Link2 className="mr-2 w-5 h-5" />
            링크 복사
          </>
        )}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={handleKakaoShare}
        className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400"
      >
        <MessageCircle className="mr-2 w-5 h-5" />
        카카오톡
      </Button>
    </div>
  );
}