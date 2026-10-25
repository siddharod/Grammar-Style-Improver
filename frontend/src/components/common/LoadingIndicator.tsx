import React from 'react';
import { Loader2, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
  subMessage?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Analyzing text...',
  subMessage = 'Calculating readability metrics and scanning for grammar rules...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-[#071B50] rounded-2xl border border-[rgba(37,93,206,0.40)] shadow-[0_0_28px_rgba(37,93,206,0.20)]">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#0A245F] text-[#255DCE] mb-4 border border-[rgba(37,93,206,0.50)]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <Sparkles className="w-4 h-4 text-[#255DCE] absolute -top-1 -right-1 animate-pulse" />
      </div>
      <h4 className="text-base font-semibold text-[#F5F7FF]">{message}</h4>
      <p className="mt-1 text-xs text-[#B8C8F5] max-w-md text-center">{subMessage}</p>

      {/* Multi-stage pipeline indicator */}
      <div className="mt-6 flex items-center gap-3 text-xs text-[#7B9AD0]">
        <span className="flex items-center gap-1 text-[#B8C8F5] font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-[#255DCE]" /> Readability Math
        </span>
        <span className="text-[rgba(37,93,206,0.4)]">•</span>
        <span className="flex items-center gap-1 text-[#B8C8F5] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#255DCE]" /> LanguageTool
        </span>
        <span className="text-[rgba(37,93,206,0.4)]">•</span>
        <span className="flex items-center gap-1 text-[#B8C8F5] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#255DCE]" /> Groq Tone & Style
        </span>
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.22)] p-6 animate-pulse">
      <div className="h-4 bg-[#0A245F] rounded w-1/3 mb-4"></div>
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-[#071B50] border border-[rgba(37,93,206,0.2)] rounded"
            style={{ width: `${100 - i * 15}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
