import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
  onClick,
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs ${
        hoverEffect ? 'hover:shadow-md hover:border-slate-300/80 transition-all duration-200' : ''
      } ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: 'lavender' | 'blue' | 'pink' | 'mint';
  badgeText?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accent = 'lavender',
  badgeText,
  onClick,
}) => {
  const accentIconBg = {
    lavender: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    pink: 'bg-pink-50 text-pink-600 border-pink-100',
    mint: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <Card
      hoverEffect={!!onClick}
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      padding="md"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </span>
          <span className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {subtitle && (
            <span className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              {subtitle}
            </span>
          )}
        </div>
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl border shrink-0 ${accentIconBg[accent]}`}
        >
          {icon}
        </div>
      </div>
      {badgeText && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">{badgeText}</span>
          <span className="text-xs font-semibold text-purple-600">View Details →</span>
        </div>
      )}
    </Card>
  );
};
