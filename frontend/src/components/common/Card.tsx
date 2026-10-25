import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'navy' | 'blue' | 'elevated' | 'glass';
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'dark',
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

  const variantStyles = {
    dark:     'bg-[#071B50] text-[#F5F7FF] border border-[rgba(79,130,255,0.22)] shadow-sm',
    navy:     'bg-[#021861] text-[#F5F7FF] border border-[rgba(37,93,206,0.45)] shadow-sm',
    blue:     'bg-[#255DCE] text-white border border-[rgba(255,255,255,0.2)] shadow-sm',
    elevated: 'bg-[#0A245F] text-[#F5F7FF] border border-[rgba(79,130,255,0.30)] shadow-md',
    glass:    'bg-[rgba(7,27,80,0.70)] text-[#F5F7FF] border border-[rgba(79,130,255,0.25)] backdrop-blur-md shadow-sm',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl ${variantStyles[variant]} ${
        hoverEffect
          ? 'hover:shadow-lg hover:border-[rgba(37,93,206,0.55)] hover:-translate-y-0.5 transition-all duration-200'
          : ''
      } ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};

/* ─── StatCard ─────────────────────────────────────────────────────────────── */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'navy' | 'blue' | 'red' | 'elevated';
  accent?: 'blue' | 'cobalt' | 'red';
  badgeText?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'navy',
  accent = 'blue',
  badgeText,
  onClick,
}) => {
  /* ── Navy dark stat card ── */
  if (variant === 'navy') {
    return (
      <div
        onClick={onClick}
        className={`p-6 rounded-2xl bg-[#021861] text-white border border-[rgba(37,93,206,0.45)] shadow-sm relative overflow-hidden transition-all duration-200 ${
          onClick ? 'hover:shadow-[0_0_24px_rgba(37,93,206,0.35)] hover:border-[rgba(37,93,206,0.7)] hover:-translate-y-0.5 cursor-pointer' : ''
        }`}
      >
        {/* ambient glow blob */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#255DCE]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-[#B8C8F5] uppercase">{title}</span>
            <span className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</span>
            {subtitle && <span className="mt-1 text-xs text-[#7B9AD0]">{subtitle}</span>}
          </div>
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#0A245F] text-white border border-[rgba(37,93,206,0.5)] shrink-0">
            {icon}
          </div>
        </div>
        {badgeText && (
          <div className="relative z-10 mt-3 pt-3 border-t border-[rgba(37,93,206,0.3)] flex items-center justify-between">
            <span className="text-xs font-medium text-[#B8C8F5]">{badgeText}</span>
            <span className="text-xs font-semibold text-white hover:text-[#B8C8F5]">View →</span>
          </div>
        )}
      </div>
    );
  }

  /* ── Cobalt-blue gradient stat card ── */
  if (variant === 'blue') {
    return (
      <div
        onClick={onClick}
        className={`p-6 rounded-2xl text-white border border-[rgba(255,255,255,0.15)] shadow-sm relative overflow-hidden transition-all duration-200 ${
          onClick ? 'hover:shadow-[0_0_30px_rgba(37,93,206,0.50)] hover:-translate-y-0.5 cursor-pointer' : ''
        }`}
        style={{ background: 'linear-gradient(135deg, #1a44a8 0%, #255DCE 100%)' }}
      >
        <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-blue-100 uppercase">{title}</span>
            <span className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</span>
            {subtitle && <span className="mt-1 text-xs text-blue-100/90">{subtitle}</span>}
          </div>
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/15 text-white border border-white/25 shrink-0">
            {icon}
          </div>
        </div>
        {badgeText && (
          <div className="relative z-10 mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs font-medium text-blue-100">{badgeText}</span>
            <span className="text-xs font-semibold text-white">View →</span>
          </div>
        )}
      </div>
    );
  }

  /* ── Red-accent stat card ── */
  if (variant === 'red') {
    return (
      <div
        onClick={onClick}
        className={`p-6 rounded-2xl bg-[#071B50] text-[#F5F7FF] border-2 border-[#DE1110]/40 shadow-sm relative overflow-hidden transition-all duration-200 ${
          onClick ? 'hover:shadow-[0_0_24px_rgba(222,17,16,0.30)] hover:border-[#DE1110]/70 hover:-translate-y-0.5 cursor-pointer' : ''
        }`}
      >
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-[#DE1110]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-[#DE1110] uppercase">{title}</span>
            <span className="mt-2 text-2xl font-bold tracking-tight text-[#DE1110]">{value}</span>
            {subtitle && <span className="mt-1 text-xs text-[#B8C8F5]">{subtitle}</span>}
          </div>
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#DE1110]/15 text-[#DE1110] border border-[#DE1110]/35 shrink-0">
            {icon}
          </div>
        </div>
        {badgeText && (
          <div className="relative z-10 mt-3 pt-3 border-t border-[#DE1110]/20 flex items-center justify-between">
            <span className="text-xs font-medium text-[#B8C8F5]">{badgeText}</span>
            <span className="text-xs font-semibold text-[#DE1110]">Fix Issues →</span>
          </div>
        )}
      </div>
    );
  }

  /* ── Elevated card (default / white-accent variant) ── */
  const accentIconBg: Record<string, string> = {
    blue:   'bg-[#0A245F] text-[#B8C8F5] border-[rgba(37,93,206,0.4)]',
    cobalt: 'bg-[#255DCE]/15 text-[#255DCE] border-[rgba(37,93,206,0.5)]',
    red:    'bg-[#DE1110]/10 text-[#DE1110] border-[rgba(222,17,16,0.3)]',
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl bg-[#0A245F] text-[#F5F7FF] border border-[rgba(79,130,255,0.28)] shadow-sm relative overflow-hidden transition-all duration-200 ${
        onClick ? 'hover:shadow-[0_0_22px_rgba(37,93,206,0.30)] hover:border-[rgba(37,93,206,0.55)] hover:-translate-y-0.5 cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-wider text-[#B8C8F5] uppercase">{title}</span>
          <span className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</span>
          {subtitle && <span className="mt-1 text-xs text-[#7B9AD0]">{subtitle}</span>}
        </div>
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl border shrink-0 ${accentIconBg[accent ?? 'blue']}`}
        >
          {icon}
        </div>
      </div>
      {badgeText && (
        <div className="mt-3 pt-3 border-t border-[rgba(79,130,255,0.2)] flex items-center justify-between">
          <span className="text-xs font-medium text-[#B8C8F5]">{badgeText}</span>
          <span className="text-xs font-semibold text-[#255DCE] hover:text-white">View Details →</span>
        </div>
      )}
    </div>
  );
};
