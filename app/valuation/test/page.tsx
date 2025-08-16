'use client';

import { useState } from 'react';

export default function TestPage() {
  const [counter, setCounter] = useState(0);
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        테스트 페이지
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
        <p className="text-gray-600 mb-4">
          이 페이지가 보인다면 기본 라우팅은 정상입니다.
        </p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCounter(counter - 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            -
          </button>
          
          <span className="text-2xl font-bold">{counter}</span>
          
          <button
            onClick={() => setCounter(counter + 1)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            +
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <a href="/valuation" className="text-blue-500 hover:underline">
            → 원래 valuation 페이지로
          </a>
        </div>
      </div>
    </div>
  );
}