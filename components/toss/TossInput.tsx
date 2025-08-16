'use client';

import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TossInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
  suffix?: string;
  prefix?: string;
  formatNumber?: boolean;
  recommendation?: {
    text: string;
    value: string | number;
    onUse: () => void;
  };
}

export default function TossInput({
  label,
  helper,
  error,
  suffix,
  prefix,
  formatNumber = false,
  recommendation,
  className,
  value,
  onChange,
  ...props
}: TossInputProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const formatNumberValue = (val: string) => {
    const number = val.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (formatNumber) {
      newValue = formatNumberValue(newValue);
    }
    
    setInternalValue(newValue);
    
    if (onChange) {
      e.target.value = newValue;
      onChange(e);
    }
  };

  const handleFocus = () => {
    setFocused(true);
    
    // 포커스 애니메이션
    if (inputRef.current) {
      inputRef.current.style.transform = 'scale(1.01)';
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.transform = 'scale(1)';
        }
      }, 200);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-semibold text-toss-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-toss-gray-500">
            {prefix}
          </span>
        )}
        
        <input
          ref={inputRef}
          className={cn(
            'toss-input-base',
            prefix && 'pl-12',
            suffix && 'pr-16',
            error && 'border-toss-red focus:border-toss-red',
            className
          )}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-toss-gray-500 font-medium">
            {suffix}
          </span>
        )}
      </div>
      
      {helper && !error && (
        <p className="mt-2 text-toss-caption text-toss-gray-500">
          {helper}
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-toss-caption text-toss-red animate-toss-slide-down">
          {error}
        </p>
      )}
      
      {recommendation && focused && (
        <div className="mt-3 p-4 bg-toss-blue-lighter rounded-toss-md animate-toss-slide-down">
          <p className="text-toss-caption text-toss-blue font-medium mb-2">
            💡 {recommendation.text}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-toss-body font-semibold text-toss-gray-900">
              {formatNumber ? formatNumberValue(recommendation.value.toString()) : recommendation.value}
            </span>
            <button
              type="button"
              onClick={recommendation.onUse}
              className="px-3 py-1.5 bg-toss-blue text-white text-sm font-medium rounded-toss-sm hover:bg-toss-blue-hover toss-transition"
            >
              사용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}