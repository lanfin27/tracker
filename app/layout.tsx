import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';
import { AutoSaveRecovery } from '@/components/valuation/AutoSaveRecovery';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '트래커(Tracker) - 내 비즈니스 가치 측정',
  description: '5,795개 실제 거래 데이터로 측정하는 정확한 비즈니스 가치. 3분 만에 내 비즈니스 가치를 확인하세요.',
  keywords: '비즈니스 가치, 기업 가치 평가, 유튜브 채널 가치, 인스타그램 계정 가치, 이커머스 가치, SaaS 가치',
  openGraph: {
    title: '트래커(Tracker) - 내 비즈니스 가치 측정',
    description: '5,795개 실제 거래 데이터로 측정하는 정확한 비즈니스 가치',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '트래커(Tracker) - 내 비즈니스 가치 측정',
    description: '5,795개 실제 거래 데이터로 측정하는 정확한 비즈니스 가치',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `}
            </Script>
          </>
        )}
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
          strategy="afterInteractive"
        />
        <Script id="kakao-init" strategy="afterInteractive">
          {`
            if (window.Kakao) {
              window.Kakao.init('YOUR_KAKAO_APP_KEY');
            }
          `}
        </Script>
      </head>
      <body className={cn(inter.className, 'min-h-screen bg-white')}>
        {children}
        <AutoSaveRecovery />
      </body>
    </html>
  );
}