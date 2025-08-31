import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '내 사업 가격 30초만에 측정 | 더파운더',
  description: '실제 5,815건의 거래 데이터로 내 비즈니스 가치를 30초만에 정확하게 측정하세요',
  keywords: '비즈니스 가치, 사업 가격, 유튜브 채널 가격, 인스타그램 계정 가치, 더파운더',
  openGraph: {
    title: '내 사업 가격 30초만에 측정 | 더파운더',
    description: '실제 거래 데이터 기반 정확한 비즈니스 가치 평가',
    url: 'https://founderthe.vercel.app',
    siteName: '더파운더',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '내 사업 가격 30초만에 측정 | 더파운더',
    description: '실제 거래 데이터 기반 정확한 비즈니스 가치 평가',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}