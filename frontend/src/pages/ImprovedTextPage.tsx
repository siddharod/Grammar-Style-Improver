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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">
                AI-Improved Text & Side-by-Side Comparison
              </h3>
              <Badge variant="lavender" size="sm">
                Target: {currentAnalysis.targetTone}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
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
        <Card className="p-4 bg-emerald-50/50 border-emerald-100">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Grammar & Flow
            </span>
          </div>
          <p className="text-2xs text-emerald-800 leading-relaxed">
            All flagged spelling errors, grammatical anomalies, and punctuation inconsistencies have been corrected.
          </p>
        </Card>

        <Card className="p-4 bg-purple-50/50 border-purple-100">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
              Target Tone
            </span>
          </div>
          <p className="text-2xs text-purple-800 leading-relaxed">
            Language has been calibrated to match your chosen <strong>{currentAnalysis.targetTone}</strong> writing goal.
          </p>
        </Card>

        <Card className="p-4 bg-blue-50/50 border-blue-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Conciseness & Clarity
            </span>
          </div>
          <p className="text-2xs text-blue-800 leading-relaxed">
            Extraneous filler phrasing, corporate jargon, and convoluted clauses have been simplified for optimal Flesch readability.
          </p>
        </Card>
      </div>
    </div>
  );
};
