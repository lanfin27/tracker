'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TestResult {
  step: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

export default function TestFlowPage() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  console.log('Test Flow Page Loaded'); // 페이지 로드 확인

  // localStorage 데이터 로드
  useEffect(() => {
    loadLocalStorageData();
  }, []);

  const loadLocalStorageData = () => {
    console.log('Loading localStorage data...');
    try {
      const trackerDraft = localStorage.getItem('tracker_draft');
      const valuationAnswers = localStorage.getItem('valuation_answers');
      
      setLocalStorageData({
        tracker_draft: trackerDraft ? JSON.parse(trackerDraft) : null,
        valuation_answers: valuationAnswers ? JSON.parse(valuationAnswers) : null
      });
    } catch (error) {
      console.error('localStorage 로드 실패:', error);
      setLocalStorageData(null);
    }
  };

  // 전체 플로우 테스트
  const runFullFlowTest = async () => {
    console.log('=== runFullFlowTest 함수 호출됨 ===');
    setIsRunning(true);
    setTestResults([]);

    const steps = [
      { name: 'localStorage 초기화', action: clearLocalStorageQuiet },
      { name: '홈페이지 접속', action: () => testPageAccess('/') },
      { name: '가치측정 페이지 이동', action: () => testPageAccess('/valuation') },
      { name: '비즈니스 타입 설정', action: () => setTestData('businessType', 'youtube') },
      { name: '매출 입력', action: () => setTestData('monthlyRevenue', 5000000) },
      { name: '수익 입력', action: () => setTestData('monthlyProfit', 4000000) },
      { name: '구독자 입력', action: () => setTestData('subscribers', 50000) },
      { name: '성장률 설정', action: () => setTestData('growthRate', 'rapid') },
      { name: '업력 설정', action: () => setTestData('businessAge', 'established') },
      { name: '결과 페이지 이동', action: () => testResultPage() }
    ];

    for (const step of steps) {
      try {
        await step.action();
        addTestResult(step.name, 'success', '✅ 성공');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: any) {
        addTestResult(step.name, 'error', `❌ 실패: ${error.message}`);
        break;
      }
    }

    setIsRunning(false);
    loadLocalStorageData();
    console.log('테스트 완료');
  };

  // 모든 비즈니스 타입 테스트
  const testAllBusinessTypes = async () => {
    console.log('=== testAllBusinessTypes 함수 호출됨 ===');
    setIsRunning(true);
    setTestResults([]);

    const businessTypes = ['youtube', 'instagram', 'tiktok', 'ecommerce', 'saas', 'blog', 'website'];

    for (const type of businessTypes) {
      try {
        await setTestData('businessType', type);
        addTestResult(`${type} 테스트`, 'success', '✅ 정상');
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error: any) {
        addTestResult(`${type} 테스트`, 'error', `❌ 실패: ${error.message}`);
      }
    }

    setIsRunning(false);
    loadLocalStorageData();
    console.log('비즈니스 타입 테스트 완료');
  };

  // localStorage 확인
  const checkLocalStorage = () => {
    console.log('=== checkLocalStorage 함수 호출됨 ===');
    loadLocalStorageData();
    
    if (localStorageData) {
      alert(`localStorage 데이터:\n\n${JSON.stringify(localStorageData, null, 2)}`);
    } else {
      alert('localStorage에 데이터가 없습니다.');
    }
  };

  // localStorage 초기화 (조용히)
  const clearLocalStorageQuiet = () => {
    localStorage.removeItem('tracker_draft');
    localStorage.removeItem('valuation_answers');
    return Promise.resolve();
  };

  // localStorage 초기화 (알림 포함)
  const clearLocalStorage = () => {
    console.log('=== clearLocalStorage 함수 호출됨 ===');
    localStorage.removeItem('tracker_draft');
    localStorage.removeItem('valuation_answers');
    loadLocalStorageData();
    alert('localStorage가 초기화되었습니다.');
  };

  // 페이지 접속 테스트
  const testPageAccess = (path: string) => {
    console.log(`페이지 접속 테스트: ${path}`);
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  };

  // 테스트 데이터 설정
  const setTestData = (key: string, value: any) => {
    console.log(`데이터 설정: ${key} = ${value}`);
    
    const currentData = localStorage.getItem('tracker_draft');
    const data = currentData ? JSON.parse(currentData) : { answers: {}, step: 1 };
    
    data.answers[key] = value;
    data.timestamp = Date.now();
    
    localStorage.setItem('tracker_draft', JSON.stringify(data));
    localStorage.setItem('valuation_answers', JSON.stringify(data.answers));
    
    return Promise.resolve();
  };

  // 결과 페이지 테스트
  const testResultPage = () => {
    console.log('결과 페이지 테스트');
    
    const data = localStorage.getItem('tracker_draft');
    if (!data) {
      throw new Error('테스트 데이터가 없습니다');
    }
    
    window.open('/valuation/result', '_blank');
    return Promise.resolve();
  };

  // 테스트 결과 추가
  const addTestResult = (step: string, status: 'success' | 'error' | 'pending', message: string) => {
    setTestResults(prev => [...prev, { step, status, message }]);
  };

  // 페이지 이동 함수들
  const navigateToHome = () => {
    console.log('=== navigateToHome 함수 호출됨 ===');
    router.push('/');
  };

  const navigateToValuation = () => {
    console.log('=== navigateToValuation 함수 호출됨 ===');
    router.push('/valuation');
  };

  const navigateToResult = () => {
    console.log('=== navigateToResult 함수 호출됨 ===');
    
    // 테스트 데이터 생성
    const testAnswers = {
      businessType: 'youtube',
      monthlyRevenue: 5000000,
      monthlyProfit: 4000000,
      subscribers: 50000,
      growthRate: 'rapid',
      businessAge: 'established'
    };
    
    localStorage.setItem('tracker_draft', JSON.stringify({
      answers: testAnswers,
      step: 6,
      timestamp: Date.now()
    }));
    
    localStorage.setItem('valuation_answers', JSON.stringify(testAnswers));
    
    router.push('/valuation/result');
  };

  // 빠른 테스트 데이터 생성
  const createQuickTestData = (type: string) => {
    console.log(`=== createQuickTestData 함수 호출됨: ${type} ===`);
    
    const testData: any = {
      youtube: {
        businessType: 'youtube',
        monthlyRevenue: 5000000,
        monthlyProfit: 4000000,
        subscribers: 50000,
        growthRate: 'rapid',
        businessAge: 'established'
      },
      ecommerce: {
        businessType: 'ecommerce',
        monthlyRevenue: 30000000,
        monthlyProfit: 5000000,
        subscribers: 0,
        growthRate: 'steady',
        businessAge: 'mature'
      },
      saas: {
        businessType: 'saas',
        monthlyRevenue: 10000000,
        monthlyProfit: 7000000,
        subscribers: 0,
        growthRate: 'stable',
        businessAge: 'growing'
      }
    };

    const answers = testData[type];
    
    if (answers) {
      localStorage.setItem('tracker_draft', JSON.stringify({
        answers,
        step: 6,
        timestamp: Date.now()
      }));
      
      localStorage.setItem('valuation_answers', JSON.stringify(answers));
      
      alert(`${type} 테스트 데이터가 생성되었습니다. 결과 페이지로 이동합니다.`);
      router.push('/valuation/result');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 트래커 플로우 테스트</h1>

        {/* 테스트 실행 섹션 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">테스트 실행</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={runFullFlowTest}
              disabled={isRunning}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              🚀 전체 플로우 테스트
            </button>
            <button
              type="button"
              onClick={testAllBusinessTypes}
              disabled={isRunning}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              🏢 모든 비즈니스 타입 테스트
            </button>
            <button
              type="button"
              onClick={checkLocalStorage}
              className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              💾 LocalStorage 확인
            </button>
            <button
              type="button"
              onClick={clearLocalStorage}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              🗑️ LocalStorage 초기화
            </button>
          </div>
        </div>

        {/* 페이지 이동 섹션 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">페이지 이동</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={navigateToHome}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🏠 홈
            </button>
            <button
              type="button"
              onClick={navigateToValuation}
              className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            >
              📊 가치측정
            </button>
            <button
              type="button"
              onClick={navigateToResult}
              className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              📈 결과
            </button>
          </div>
        </div>

        {/* 빠른 테스트 시나리오 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🚀 빠른 테스트 시나리오</h2>
          <p className="text-gray-600 mb-4">
            클릭 한 번으로 테스트 데이터를 생성하고 결과 페이지로 이동합니다.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => createQuickTestData('youtube')}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              📺 YouTube 테스트
            </button>
            <button
              type="button"
              onClick={() => createQuickTestData('ecommerce')}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              🛍️ 이커머스 테스트
            </button>
            <button
              type="button"
              onClick={() => createQuickTestData('saas')}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              💻 SaaS 테스트
            </button>
          </div>
        </div>

        {/* 테스트 결과 표시 */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">테스트 결과</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.status === 'success' 
                      ? 'bg-green-50 text-green-800' 
                      : result.status === 'error'
                      ? 'bg-red-50 text-red-800'
                      : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  <span className="font-medium">{result.step}:</span> {result.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* localStorage 데이터 표시 */}
        {localStorageData && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">📦 현재 LocalStorage 데이터</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </div>
        )}

        {/* 디버그 정보 */}
        <div className="bg-yellow-50 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">🔍 디버그 정보</h3>
          <p className="text-sm text-gray-600">
            콘솔(F12)을 열어서 버튼 클릭 시 로그를 확인하세요.
            각 버튼 클릭 시 콘솔에 "=== 함수명 ===" 형태로 로그가 출력됩니다.
          </p>
        </div>

        {/* 실행 중 표시 */}
        {isRunning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-center">테스트 실행 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}