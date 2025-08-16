'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TossButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export default function TossButton({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  loading = false,
  icon,
  children,
  className,
  disabled,
  onClick,
  ...props
}: TossButtonProps) {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 햅틱 피드백
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // 리플 효과
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    if (onClick) onClick(e);
  };

  const variants = {
    primary: 'bg-toss-blue text-white hover:bg-toss-blue-hover',
    secondary: 'bg-toss-gray-100 text-toss-gray-700 hover:bg-toss-gray-200',
    ghost: 'bg-transparent text-toss-gray-700 hover:bg-toss-gray-50',
    danger: 'bg-toss-red text-white hover:bg-red-600'
  };

  const sizes = {
    sm: 'h-10 px-4 text-sm font-medium',
    md: 'h-12 px-5 text-base font-medium', 
    lg: 'h-14 px-6 text-toss-body font-semibold',
    xl: 'h-16 px-8 text-lg font-semibold'
  };

  return (
    <>
      <button
        className={cn(
          'toss-button relative inline-flex items-center justify-center gap-2',
          'rounded-toss-lg toss-transition',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          loading && 'pointer-events-none',
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
          </>
        )}
      </button>
      
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}