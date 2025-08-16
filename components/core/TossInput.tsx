'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';

export interface TossInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  error?: string;
  helper?: string;
  success?: boolean;
  autoFormat?: 'currency' | 'number' | 'phone';
  showPasswordToggle?: boolean;
  suggestion?: {
    value: string | number;
    label: string;
  };
  onSuggestionAccept?: () => void;
}

const TossInput = forwardRef<HTMLInputElement, TossInputProps>(({
  label,
  value = '',
  onChange,
  error,
  helper,
  success,
  autoFormat,
  showPasswordToggle,
  type = 'text',
  suggestion,
  onSuggestionAccept,
  className,
  disabled,
  required,
  autoFocus,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value.toString());
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const formatValue = (val: string): string => {
    if (!autoFormat) return val;

    const numericValue = val.replace(/[^0-9]/g, '');
    
    switch (autoFormat) {
      case 'currency':
        if (!numericValue) return '';
        return parseInt(numericValue).toLocaleString('ko-KR');
        
      case 'number':
        if (!numericValue) return '';
        return parseInt(numericValue).toLocaleString('ko-KR');
        
      case 'phone':
        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 7) {
          return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        }
        return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
        
      default:
        return val;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatValue(rawValue);
    setInternalValue(formattedValue);
    
    if (onChange) {
      const valueToSend = autoFormat ? rawValue.replace(/[^0-9]/g, '') : rawValue;
      onChange(valueToSend);
    }
  };

  const handleSuggestionAccept = () => {
    if (suggestion) {
      const formattedValue = formatValue(suggestion.value.toString());
      setInternalValue(formattedValue);
      if (onChange) {
        onChange(suggestion.value.toString());
      }
      if (onSuggestionAccept) {
        onSuggestionAccept();
      }
    }
  };

  const inputType = showPassword ? 'text' : type;

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={props.id}
          className={cn(
            "block mb-2 toss-label transition-colors",
            isFocused && "text-blue-600",
            error && "text-red-500",
            success && "text-green-600"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
            (inputRef as any).current = node;
          }}
          type={inputType}
          value={internalValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3.5 rounded-xl border bg-white",
            "text-base transition-all duration-200",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            !error && !success && "border-gray-200 focus:border-blue-500 focus:ring-blue-100",
            error && "border-red-500 focus:ring-red-100",
            success && "border-green-500 focus:ring-green-100",
            disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
            className
          )}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : helper ? `${props.id}-helper` : undefined}
          {...props}
        />

        {/* 상태 아이콘 */}
        <AnimatePresence>
          {(error || success) && !showPasswordToggle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {error && <AlertCircle className="w-5 h-5 text-red-500" />}
              {success && <Check className="w-5 h-5 text-green-500" />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 비밀번호 토글 */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* 추천 값 */}
      <AnimatePresence>
        {suggestion && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 p-3 bg-blue-50 rounded-lg"
          >
            <p className="text-sm text-blue-700 mb-1">
              💡 {suggestion.label}
            </p>
            <button
              type="button"
              onClick={handleSuggestionAccept}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              {formatValue(suggestion.value.toString())} 사용하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 에러 메시지 */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${props.id}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm text-red-500"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 도움말 */}
      {helper && !error && (
        <p
          id={`${props.id}-helper`}
          className="mt-2 text-sm text-gray-500"
        >
          {helper}
        </p>
      )}
    </div>
  );
});

TossInput.displayName = 'TossInput';

export default TossInput;