import { NextResponse } from 'next/server';
import { saveEmailLead, saveWeeklySubscription } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      type = 'detailed_analysis', // 'detailed_analysis' or 'weekly_report'
      businessData 
    } = body;

    // 이메일 유효성 검사
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요' },
        { status: 400 }
      );
    }

    // 타입에 따라 다른 처리
    if (type === 'weekly_report') {
      // 주간 리포트 구독
      await saveWeeklySubscription({
        email,
        business_type: businessData?.businessType
      });
    } else {
      // 상세 분석 이메일 수집
      await saveEmailLead({
        email,
        business_type: businessData?.businessType,
        monthly_revenue: businessData?.monthlyRevenue,
        monthly_profit: businessData?.monthlyProfit,
        subscribers: businessData?.subscribers,
        business_age: businessData?.businessAge,
        calculated_value: businessData?.calculatedValue,
        percentile: businessData?.percentile,
        page_source: 'detailed_analysis'
      });
    }

    return NextResponse.json({ 
      success: true,
      message: type === 'weekly_report' 
        ? '주간 리포트 구독이 완료되었습니다!' 
        : '상세 분석이 이메일로 전송됩니다!'
    });

  } catch (error) {
    console.error('Email submission error:', error);
    
    return NextResponse.json(
      { 
        error: '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}