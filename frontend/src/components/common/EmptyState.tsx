import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-[rgba(37,93,206,0.35)] rounded-2xl bg-[#071B50] ${className}`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A245F] text-[#255DCE] border border-[rgba(37,93,206,0.45)] mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#F5F7FF]">{title}</h3>
      <p className="mt-1.5 text-sm text-[#B8C8F5] max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
