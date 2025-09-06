import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔵 Track-view received:', body);
    
    const { businessData, sessionId } = body;

    // 임시 이메일 형식으로 저장 (익명 추적)
    const tempEmail = `visitor_${sessionId}@temp.com`;

    // 데이터 준비
    const dataToInsert = {
      email: tempEmail,
      business_type: businessData?.businessType || null,
      monthly_revenue: businessData?.monthlyRevenue || null,
      monthly_profit: businessData?.monthlyProfit || null,
      subscribers: businessData?.subscribers || null,
      business_age: businessData?.businessAge || null,
      calculated_value: businessData?.calculatedValue || null,
      percentile: businessData?.percentile || null,
      avg_views: businessData?.avgViews || 0,
      avg_likes: businessData?.avgLikes || 0,
      category: businessData?.category || null,
      page_source: 'anonymous_view',
      created_at: new Date().toISOString()
    };
    
    console.log('💾 Inserting to Supabase:', dataToInsert);
    
    const { data, error } = await supabase
      .from('leads')
      .insert([dataToInsert])
      .select();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message });
    }

    console.log('✅ Successfully inserted:', data);
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}