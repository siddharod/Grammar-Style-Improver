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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer';

  const variantStyles = {
    primary:
      'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 shadow-sm focus:ring-purple-400 border border-transparent',
    secondary:
      'bg-purple-50 text-purple-700 hover:bg-purple-100 active:bg-purple-200 border border-purple-200/70 focus:ring-purple-300',
    outline:
      'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 shadow-2xs hover:border-slate-300 focus:ring-slate-300',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 focus:ring-slate-200',
    mint:
      'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 focus:ring-emerald-300',
    danger:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 focus:ring-rose-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-sm px-4 py-2 gap-2 font-medium',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
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
