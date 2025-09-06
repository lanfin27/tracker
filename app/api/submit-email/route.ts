import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📥 Submit-email received:', body);
    
    const { 
      email, 
      type = 'detailed_analysis',
      businessData 
    } = body;

    // 이메일 유효성 검사
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요' },
        { status: 400 }
      );
    }

    // track-view와 동일한 방식으로 데이터 준비
    const dataToInsert = {
      email: email,
      business_type: businessData?.businessType || null,
      monthly_revenue: businessData?.monthlyRevenue || null,
      monthly_profit: businessData?.monthlyProfit || null,
      business_age: businessData?.businessAge || null,
      subscribers: businessData?.subscribers || null,
      // 핵심 필드들 - track-view와 동일하게 처리
      avg_views: businessData?.avgViews || 0,
      avg_likes: businessData?.avgLikes || 0,
      category: businessData?.category || null,
      calculated_value: businessData?.calculatedValue || null,
      percentile: businessData?.percentile || null,
      page_source: type === 'weekly_report' ? 'weekly_report' : 'detailed_analysis',
      utm_source: businessData?.utmSource || null,
      utm_medium: businessData?.utmMedium || null,
      utm_campaign: businessData?.utmCampaign || null,
      created_at: new Date().toISOString()
    };
    
    console.log('💾 Inserting to Supabase:', dataToInsert);
    
    const { data, error } = await supabase
      .from('leads')
      .insert([dataToInsert])
      .select();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { 
          error: '처리 중 오류가 발생했습니다.',
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Successfully saved:', data);
    
    return NextResponse.json({ 
      success: true,
      message: type === 'weekly_report' 
        ? '주간 리포트 구독이 완료되었습니다!' 
        : '상세 분석이 이메일로 전송됩니다!',
      data
    });

  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { 
        error: '처리 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}