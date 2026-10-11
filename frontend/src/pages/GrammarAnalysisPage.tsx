import React, { useState } from 'react';
import {
  CheckCheck,
  Check,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';
import type { GrammarCategory } from '../types';

interface GrammarAnalysisPageProps {
  onNavigateToAnalyzer: () => void;
  onNavigateToImproved: () => void;
}

export const GrammarAnalysisPage: React.FC<GrammarAnalysisPageProps> = ({
  onNavigateToAnalyzer,
  onNavigateToImproved,
}) => {
  const { currentAnalysis, applyFix, applyAllFixes } = useAnalysis();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { showToast } = useToast();

  const categories = ['All', 'Spelling', 'Grammar', 'Style & Clarity', 'Punctuation'];

  const filteredIssues =
    selectedCategory === 'All'
      ? currentAnalysis.issues
      : currentAnalysis.issues.filter((issue) => issue.category === selectedCategory);

  const handleApplyFix = (issueId: string, replacement: string) => {
    applyFix(issueId, replacement);
    showToast(`Applied correction: "${replacement}"`);
  };

  const handleApplyAll = () => {
    applyAllFixes();
    showToast('Applied all available grammar & spelling corrections!');
  };

  const getCategoryBadgeVariant = (cat: GrammarCategory) => {
    switch (cat) {
      case 'Spelling':
        return 'pink';
      case 'Grammar':
        return 'lavender';
      case 'Style & Clarity':
        return 'blue';
      case 'Punctuation':
        return 'amber';
      default:
        return 'slate';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <CheckCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Grammar & Spelling Diagnostics
            </h3>
            <p className="text-xs text-slate-500">
              LanguageTool HTTP API • {currentAnalysis.issues.length} active issue
              {currentAnalysis.issues.length === 1 ? '' : 's'} identified
            </p>
          </div>
        </div>

        {currentAnalysis.issues.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="mint"
              size="sm"
              onClick={handleApplyAll}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Apply All Corrections
            </Button>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {categories.map((cat) => {
          const count =
            cat === 'All'
              ? currentAnalysis.issues.length
              : currentAnalysis.issues.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Issues List or Empty State */}
      {filteredIssues.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<CheckCheck className="w-6 h-6 text-emerald-600" />}
            title="No Grammar or Spelling Issues"
            description={
              currentAnalysis.issues.length === 0
                ? "Excellent! Your current text adheres to all LanguageTool syntactic, spelling, and punctuation rules."
                : `No issues found under the "${selectedCategory}" category.`
            }
            actionLabel="View Readability & Tone"
            onAction={onNavigateToImproved}
          />
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              className="p-5 hover:border-slate-300 transition-all border-slate-200/90 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Badge variant={getCategoryBadgeVariant(issue.category)} size="sm">
                    {issue.category}
                  </Badge>
                  {issue.ruleId && (
                    <span className="text-2xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      Rule: {issue.ruleId}
                    </span>
                  )}
                </div>

                <span className="text-2xs text-slate-400 font-mono">
                  Offset: {issue.offset} • Length: {issue.length}
                </span>
              </div>

              {/* Issue Description */}
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug mb-3">
                {issue.message}
              </p>

              {/* Original snippet vs Replacements */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Found in text:</span>
                  <span className="font-mono bg-rose-100/90 text-rose-800 px-2 py-0.5 rounded text-xs line-through font-semibold">
                    {issue.originalText}
                  </span>
                </div>

                {/* Replacement options */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Suggestions:</span>
                  {issue.replacements.map((rep, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyFix(issue.id, rep)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-semibold transition-all cursor-pointer hover:shadow-2xs"
                    >
                      <span>{rep}</span>
                      <span className="text-2xs font-normal text-emerald-600 underline">Apply Fix</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToAnalyzer}
        >
          ← Back to Text Analyzer
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateToImproved}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Improved Text
        </Button>
      </div>
    </div>
  );
};
