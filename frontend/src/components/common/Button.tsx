import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#04123F] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variantStyles = {
    primary:
      'bg-[#021861] text-white hover:bg-[#0a2782] active:bg-[#010e3b] shadow-sm hover:shadow-[0_0_18px_rgba(37,93,206,0.40)] focus:ring-[#255DCE]/50 border border-[rgba(37,93,206,0.5)]',
    secondary:
      'bg-[#255DCE] text-white hover:bg-[#1d4bb0] active:bg-[#163b90] shadow-sm hover:shadow-[0_0_18px_rgba(37,93,206,0.50)] focus:ring-[#255DCE]/50 border border-transparent',
    outline:
      'bg-transparent text-[#B8C8F5] hover:bg-[#0A245F] hover:text-white active:bg-[#071B50] border border-[rgba(79,130,255,0.35)] hover:border-[rgba(37,93,206,0.60)] focus:ring-[#255DCE]/30 shadow-none',
    ghost:
      'bg-transparent text-[#B8C8F5] hover:bg-[#071B50] hover:text-white focus:ring-[rgba(37,93,206,0.30)]',
    mint:
      'bg-[#0A245F] text-[#B8C8F5] hover:bg-[#0D2E7A] hover:text-white border border-[rgba(79,130,255,0.35)] focus:ring-[#255DCE]/30',
    danger:
      'bg-[#DE1110] text-white hover:bg-[#B80D0C] active:bg-[#960908] shadow-sm hover:shadow-[0_0_14px_rgba(222,17,16,0.40)] focus:ring-[#DE1110]/40 border border-transparent',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2 font-medium',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
