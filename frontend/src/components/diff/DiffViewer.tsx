import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Sparkles, Layers } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

interface DiffViewerProps {
  originalText: string;
  improvedText: string;
  targetTone?: string;
  onApplyToEditor?: (text: string) => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  improvedText,
  targetTone = 'Professional',
  onApplyToEditor,
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [copiedImproved, setCopiedImproved] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const { showToast } = useToast();

  const handleCopyImproved = () => {
    navigator.clipboard.writeText(improvedText);
    setCopiedImproved(true);
    showToast('Improved text copied to clipboard!');
    setTimeout(() => setCopiedImproved(false), 2000);
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(originalText);
    setCopiedOriginal(true);
    showToast('Original text copied to clipboard!');
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  // Simple tokenized word diff computation
  const computeWordDiff = (orig: string, imp: string) => {
    const origWords = orig.trim().split(/\s+/);
    const impWords = imp.trim().split(/\s+/);

    return (
      <div className="leading-relaxed text-sm text-slate-700 space-y-2">
        <p className="font-sans">
          {impWords.map((word, idx) => {
            const isAdded = !origWords.includes(word);
            return (
              <span
                key={idx}
                className={
                  isAdded
                    ? 'inline-block bg-emerald-100/90 text-emerald-800 px-1 py-0.5 mx-0.5 rounded text-xs font-semibold'
                    : 'inline-block mr-1'
                }
              >
                {word}{' '}
              </span>
            );
          })}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-purple-600" /> Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'unified'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> Highlight Changes
            </button>
          </div>
          <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
            <Sparkles className="w-3 h-3 text-purple-500" /> Tone: {targetTone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyImproved}
            leftIcon={copiedImproved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedImproved ? 'Copied!' : 'Copy Improved'}
          </Button>
          {onApplyToEditor && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApplyToEditor(improvedText)}
            >
              Use in Editor
            </Button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Original */}
          <div className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/70 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Original Draft
                </span>
              </div>
              <button
                onClick={handleCopyOriginal}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedOriginal ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedOriginal ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap min-h-[220px]">
              {originalText}
            </div>
          </div>

          {/* Right: Improved */}
          <div className="flex flex-col bg-white rounded-2xl border border-purple-200/80 shadow-2xs overflow-hidden ring-1 ring-purple-100">
            <div className="flex items-center justify-between px-5 py-3.5 bg-purple-50/50 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Improved Text
                </span>
              </div>
              <span className="text-2xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Polished
              </span>
            </div>
            <div className="p-5 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap min-h-[220px]">
              {improvedText}
            </div>
          </div>
        </div>
      ) : (
        /* Unified Highlight View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Highlighted Enhancements
            </h4>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-200"></span>
                <span className="text-slate-600 font-medium">Added / Improved Phrasing</span>
              </span>
            </div>
          </div>
          {computeWordDiff(originalText, improvedText)}
        </div>
      )}
    </div>
  );
};
