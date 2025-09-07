import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const logData = await request.json();
    
    // Vercel 서버 로그에 출력
    console.log('========================================');
    console.log(`[${logData.calcId}] 🧮 가치평가 계산 로그`);
    console.log('========================================');
    
    // 각 로그 항목 출력
    if (logData.logs && Array.isArray(logData.logs)) {
      logData.logs.forEach((log: any) => {
        console.log(log);
      });
    }
    
    // 요약 정보
    if (logData.summary) {
      console.log('📊 계산 요약:', JSON.stringify(logData.summary, null, 2));
    }
    
    // 에러 정보
    if (logData.error) {
      console.error('❌ 계산 오류:', logData.error);
    }
    
    console.log('========================================\n');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('로그 전송 오류:', error);
    return NextResponse.json({ error: 'Failed to log calculation' }, { status: 500 });
  }
}