'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TossProgressProps {
  current: number;
  total: number;
  label?: string;
  showSteps?: boolean;
  animated?: boolean;
}

export default function TossProgress({
  current,
  total,
  label,
  showSteps = true,
  animated = true
}: TossProgressProps) {
  const [width, setWidth] = useState(0);
  const percentage = (current / total) * 100;

  useEffect(() => {
    // 애니메이션 효과를 위한 지연
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      <div className="relative h-1 bg-toss-gray-100 rounded-toss-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 bg-toss-blue rounded-toss-full",
            animated && "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          )}
          style={{ width: `${width}%` }}
        >
          {animated && (
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30 animate-toss-shimmer" />
          )}
        </div>
      </div>
      
      {(showSteps || label) && (
        <div className="flex justify-between items-center mt-3">
          {showSteps && (
            <span className="text-toss-caption text-toss-gray-500 font-medium">
              {current}/{total} 단계
            </span>
          )}
          {label && (
            <span className="text-toss-caption text-toss-gray-700 font-medium">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}