'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';

export interface TossButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'full';
  loading?: boolean;
  asChild?: boolean;
  haptic?: boolean;
}

const TossButton = forwardRef<HTMLButtonElement, TossButtonProps>(({
  className,
  variant = 'primary',
  size = 'medium',
  loading = false,
  asChild = false,
  haptic = true,
  disabled,
  children,
  onClick,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : 'button';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary: cn(
      "bg-blue-500 text-white",
      "hover:bg-blue-600 active:bg-blue-700",
      "disabled:bg-gray-200 disabled:text-gray-400"
    ),
    secondary: cn(
      "bg-gray-100 text-gray-900",
      "hover:bg-gray-200 active:bg-gray-300",
      "disabled:bg-gray-50 disabled:text-gray-400"
    ),
    ghost: cn(
      "bg-transparent text-gray-700",
      "hover:bg-gray-100 active:bg-gray-200",
      "disabled:text-gray-400"
    ),
    danger: cn(
      "bg-red-500 text-white",
      "hover:bg-red-600 active:bg-red-700",
      "disabled:bg-gray-200 disabled:text-gray-400"
    )
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm rounded-lg",
    medium: "px-6 py-3 text-base rounded-xl",
    large: "px-8 py-4 text-lg rounded-xl",
    full: "w-full px-6 py-4 text-base rounded-xl"
  };

  return (
    <motion.div
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      className={size === 'full' ? 'w-full' : 'inline-block'}
    >
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          "font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          "disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
        )}
        <span className={cn(loading && "opacity-0")}>
          {children}
        </span>
      </Comp>
    </motion.div>
  );
});

TossButton.displayName = 'TossButton';

export default TossButton;