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
    <div className="flex flex-col items-center justify-center p-10 bg-white/80 rounded-2xl border border-purple-100/80 shadow-xs">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-600 mb-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">{message}</h4>
      <p className="mt-1 text-xs text-slate-500 max-w-md text-center">{subMessage}</p>
      
      {/* Multi-stage pipeline indicator */}
      <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-purple-700 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-purple-500" /> Readability Math
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-purple-700 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> LanguageTool
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-purple-700 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Gemini Tone & Style
        </span>
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-slate-100 rounded"
            style={{ width: `${100 - i * 15}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
