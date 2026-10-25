import React from 'react';

export type BadgeVariant = 'navy' | 'blue' | 'red' | 'lavender' | 'pink' | 'mint' | 'slate' | 'amber';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  icon,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    navy:    'bg-[#021861]/80 text-[#B8C8F5] border-[rgba(37,93,206,0.45)]',
    blue:    'bg-[#255DCE]/20 text-[#93b4fd] border-[rgba(37,93,206,0.50)]',
    red:     'bg-[#DE1110]/15 text-[#ff7b7b] border-[rgba(222,17,16,0.45)]',
    lavender:'bg-[#021861]/60 text-[#B8C8F5] border-[rgba(37,93,206,0.35)]',
    pink:    'bg-[#DE1110]/15 text-[#ff7b7b] border-[rgba(222,17,16,0.45)]',
    mint:    'bg-[#255DCE]/15 text-[#93b4fd] border-[rgba(37,93,206,0.40)]',
    slate:   'bg-[#071B50] text-[#B8C8F5] border-[rgba(79,130,255,0.25)]',
    amber:   'bg-amber-950/60 text-amber-300 border-amber-700/40',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="inline-block shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
