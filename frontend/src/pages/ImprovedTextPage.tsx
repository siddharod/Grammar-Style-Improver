import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { DiffViewer } from '../components/diff/DiffViewer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

interface ImprovedTextPageProps {
  onNavigateToAnalyzer: () => void;
  onNavigateToSuggestions: () => void;
}

export const ImprovedTextPage: React.FC<ImprovedTextPageProps> = ({
  onNavigateToAnalyzer,
  onNavigateToSuggestions,
}) => {
  const { currentAnalysis, updateOriginalText } = useAnalysis();
  const { showToast } = useToast();

  const handleApplyToEditor = (improvedText: string) => {
    updateOriginalText(improvedText);
    showToast('Applied improved text to editor! You can now re-analyze.');
    onNavigateToAnalyzer();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.25)] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#255DCE] to-[#021861] text-white border border-[rgba(79,130,255,0.4)] shadow-md shadow-[#255DCE]/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-white tracking-tight">
                AI-Improved Text & Side-by-Side Comparison
              </h3>
              <Badge variant="blue" size="sm">
                Target: {currentAnalysis.targetTone}
              </Badge>
            </div>
            <p className="text-xs text-[#7B9AD0] mt-0.5">
              Inspect semantic rewrites, copy polished output, or view token-level diff highlights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateToAnalyzer}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Edit Source
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateToSuggestions}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Writing Suggestions
          </Button>
        </div>
      </div>

      {/* Main Diff Viewer Component */}
      <DiffViewer
        originalText={currentAnalysis.originalText}
        improvedText={currentAnalysis.improvedText}
        targetTone={currentAnalysis.targetTone}
        onApplyToEditor={handleApplyToEditor}
      />

      {/* Comparison Insights Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-[#071B50] border-[rgba(79,130,255,0.25)]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#255DCE]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Grammar & Flow
            </span>
          </div>
          <p className="text-2xs text-[#B8C8F5] leading-relaxed">
            All flagged spelling errors, grammatical anomalies, and punctuation inconsistencies have been corrected.
          </p>
        </Card>

        <Card className="p-4 bg-[#0A245F] border-[rgba(79,130,255,0.25)]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#93b4fd]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Target Tone
            </span>
          </div>
          <p className="text-2xs text-[#B8C8F5] leading-relaxed">
            Language has been calibrated to match your chosen <strong className="text-white font-semibold">{currentAnalysis.targetTone}</strong> writing goal.
          </p>
        </Card>

        <Card className="p-4 bg-[#071B50] border-[rgba(79,130,255,0.25)]">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#255DCE]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Conciseness & Clarity
            </span>
          </div>
          <p className="text-2xs text-[#B8C8F5] leading-relaxed">
            Extraneous filler phrasing, corporate jargon, and convoluted clauses have been simplified for optimal Flesch readability.
          </p>
        </Card>
      </div>
    </div>
  );
};
