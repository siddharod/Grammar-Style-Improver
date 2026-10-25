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
      <div className="leading-relaxed text-sm text-[#F5F7FF] space-y-2">
        <p className="font-sans">
          {impWords.map((word, idx) => {
            const isAdded = !origWords.includes(word);
            return (
              <span
                key={idx}
                className={
                  isAdded
                    ? 'inline-block bg-[#255DCE]/30 text-white border border-[#255DCE] px-1.5 py-0.5 mx-0.5 rounded text-xs font-semibold shadow-xs shadow-[#255DCE]/20'
                    : 'inline-block mr-1 text-[#B8C8F5]'
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#071B50] rounded-xl border border-[rgba(79,130,255,0.25)] shadow-lg shadow-black/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#04123F] p-1 rounded-xl border border-[rgba(79,130,255,0.25)]">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-gradient-to-r from-[#255DCE] to-[#102F91] text-white shadow-xs electric-glow-btn'
                  : 'text-[#7B9AD0] hover:text-[#F5F7FF]'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'unified'
                  ? 'bg-gradient-to-r from-[#255DCE] to-[#102F91] text-white shadow-xs electric-glow-btn'
                  : 'text-[#7B9AD0] hover:text-[#F5F7FF]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Highlight Changes
            </button>
          </div>
          <span className="hidden sm:inline-block text-xs text-[rgba(79,130,255,0.3)]">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#B8C8F5] bg-[#0A245F] px-2.5 py-1 rounded-lg border border-[rgba(79,130,255,0.3)]">
            <Sparkles className="w-3 h-3 text-[#255DCE]" /> Tone: {targetTone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyImproved}
            leftIcon={copiedImproved ? <Check className="w-3.5 h-3.5 text-[#255DCE]" /> : <Copy className="w-3.5 h-3.5" />}
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
          <div className="flex flex-col bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.25)] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0A245F]/90 border-b border-[rgba(79,130,255,0.2)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7B9AD0]"></span>
                <span className="text-xs font-bold text-[#7B9AD0] uppercase tracking-wider">
                  Original Draft
                </span>
              </div>
              <button
                onClick={handleCopyOriginal}
                className="text-xs font-medium text-[#7B9AD0] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedOriginal ? <Check className="w-3 h-3 text-[#255DCE]" /> : <Copy className="w-3 h-3" />}
                {copiedOriginal ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed text-[#B8C8F5] whitespace-pre-wrap min-h-[220px] bg-[#04123F]/40 font-sans">
              {originalText}
            </div>
          </div>

          {/* Right: Improved */}
          <div className="flex flex-col bg-[#071B50] rounded-2xl border border-[#255DCE]/50 shadow-xl overflow-hidden ring-1 ring-[#255DCE]/40 electric-border-glow">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#102F91]/80 to-[#0A245F] border-b border-[#255DCE]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#255DCE] shadow-sm shadow-[#255DCE]"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#255DCE]" /> Improved Text
                </span>
              </div>
              <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#255DCE] text-white shadow-xs electric-glow-btn">
                Polished
              </span>
            </div>
            <div className="p-5 text-sm leading-relaxed text-white whitespace-pre-wrap min-h-[220px] bg-[#04123F]/40 font-sans font-normal">
              {improvedText}
            </div>
          </div>
        </div>
      ) : (
        /* Unified Highlight View */
        <div className="bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.25)] shadow-xl p-6">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[rgba(79,130,255,0.2)]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#255DCE]"></span>
              Highlighted Enhancements
            </h4>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded bg-[#255DCE] shadow-xs shadow-[#255DCE]"></span>
                <span className="text-[#B8C8F5] font-medium text-xs">Added / Improved Phrasing</span>
              </span>
            </div>
          </div>
          {computeWordDiff(originalText, improvedText)}
        </div>
      )}
    </div>
  );
};
