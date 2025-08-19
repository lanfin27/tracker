'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">🚨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                시스템 오류
              </h2>
              <p className="text-gray-600 mb-6">
                애플리케이션에 문제가 발생했습니다.
              </p>
              <button
                onClick={reset}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}