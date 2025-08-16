'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TossButton from '@/components/toss/TossButton';
import { ArrowRight, TrendingUp, Users, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div className="toss-container">
      {/* 히어로 섹션 */}
      <section className="relative px-6 pt-20 pb-16 bg-gradient-to-b from-toss-blue-lighter to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-white/80 backdrop-blur rounded-toss-full">
            <span className="w-2 h-2 bg-toss-green rounded-full animate-pulse" />
            <span className="text-toss-micro font-medium text-toss-gray-700">
              5,795개 실제 거래 데이터 기반
            </span>
          </div>
          
          <h1 className="text-toss-h1 text-toss-gray-900 mb-4">
            내 비즈니스,<br />
            <span className="text-toss-blue">지금 얼마일까?</span>
          </h1>
          
          <p className="text-toss-body text-toss-gray-600 mb-8">
            3분 만에 측정하는 정확한 비즈니스 가치<br />
            유튜브, 인스타그램, 이커머스 모두 가능해요
          </p>
          
          <TossButton
            size="xl"
            fullWidth
            icon={<TrendingUp className="w-5 h-5" />}
            className="mb-4"
            onClick={() => router.push('/valuation')}
          >
            무료로 가치 측정하기
          </TossButton>
          
          <div className="flex items-center justify-center gap-4 text-toss-caption text-toss-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              오늘 324명이 측정
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              100% 무료
            </span>
          </div>
        </motion.div>
      </section>

      {/* 특징 카드 */}
      <section className="px-6 py-12">
        <div className="grid gap-4">
          {[
            {
              icon: '📊',
              title: '실제 거래 데이터',
              desc: 'Flippa 5,795개 거래 분석'
            },
            {
              icon: '⚡',
              title: '3분 완성',
              desc: '간단한 6단계 질문'
            },
            {
              icon: '🎯',
              title: '업종별 비교',
              desc: '같은 업종 내 순위 확인'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-5 bg-toss-gray-50 rounded-toss-lg hover:bg-toss-gray-100 toss-transition cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h3 className="text-toss-body font-semibold text-toss-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-toss-caption text-toss-gray-600">
                  {item.desc}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-toss-gray-400" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="px-6 py-12">
        <div className="bg-gradient-to-r from-toss-blue to-toss-blue-hover rounded-toss-xl p-8 text-center text-white">
          <h2 className="text-toss-h2 mb-4">
            지금 시작하세요
          </h2>
          <p className="text-toss-body mb-6 opacity-90">
            회원가입 없이 바로 측정 가능
          </p>
          <TossButton
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => router.push('/valuation')}
          >
            무료 측정 시작하기
          </TossButton>
        </div>
      </section>
    </div>
  );
}