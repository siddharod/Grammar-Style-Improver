import React, { useState } from 'react';
import { CheckCheck, Check, ArrowRight, Filter } from 'lucide-react';
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
      case 'Spelling':     return 'red';
      case 'Grammar':      return 'navy';
      case 'Style & Clarity': return 'blue';
      case 'Punctuation':  return 'amber';
      default:             return 'slate';
    }
  };

  const panelStyle = {
    background: '#071B50',
    border: '1px solid rgba(79,130,255,0.22)',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl"
        style={panelStyle}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
            style={{ background: 'rgba(37,93,206,0.15)', border: '1px solid rgba(37,93,206,0.40)' }}
          >
            <CheckCheck className="w-5 h-5 text-[#255DCE]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Grammar & Spelling Diagnostics</h3>
            <p className="text-xs" style={{ color: '#7B9AD0' }}>
              LanguageTool HTTP API • {currentAnalysis.issues.length} active issue
              {currentAnalysis.issues.length === 1 ? '' : 's'} identified
            </p>
          </div>
        </div>
        {currentAnalysis.issues.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleApplyAll}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Apply All Corrections
          </Button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold flex items-center gap-1.5 mr-1" style={{ color: '#7B9AD0' }}>
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
              className="text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer"
              style={
                selectedCategory === cat
                  ? { background: '#255DCE', color: '#fff', boxShadow: '0 0 12px rgba(37,93,206,0.45)' }
                  : { background: 'rgba(7,27,80,0.70)', color: '#B8C8F5', border: '1px solid rgba(79,130,255,0.25)' }
              }
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Issues list */}
      {filteredIssues.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CheckCheck className="w-6 h-6 text-[#255DCE]" />}
            title="No Grammar or Spelling Issues"
            description={
              currentAnalysis.issues.length === 0
                ? 'Excellent! Your text adheres to all LanguageTool syntactic, spelling, and punctuation rules.'
                : `No issues found under the "${selectedCategory}" category.`
            }
            actionLabel="Proceed to Improved Text"
            onAction={onNavigateToImproved}
          />
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-5 rounded-2xl transition-all"
              style={{
                background: '#071B50',
                border: '1px solid rgba(79,130,255,0.22)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,93,206,0.50)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,130,255,0.22)';
              }}
            >
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3"
                style={{ borderBottom: '1px solid rgba(37,93,206,0.22)' }}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={getCategoryBadgeVariant(issue.category)} size="sm">
                    {issue.category}
                  </Badge>
                  {issue.ruleId && (
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        background: 'rgba(10,36,95,0.80)',
                        border: '1px solid rgba(79,130,255,0.25)',
                        color: '#93b4fd',
                      }}
                    >
                      Rule: {issue.ruleId}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono" style={{ color: '#7B9AD0' }}>
                  Offset: {issue.offset} • Length: {issue.length}
                </span>
              </div>

              <p className="text-sm font-semibold text-white leading-snug mb-3">{issue.message}</p>

              <div
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 rounded-xl"
                style={{ background: 'rgba(10,36,95,0.60)', border: '1px solid rgba(79,130,255,0.20)' }}
              >
                <div className="flex items-center gap-2 text-xs">
                  <span style={{ color: '#7B9AD0' }} className="font-medium">Found in text:</span>
                  <span
                    className="font-mono px-2 py-0.5 rounded text-xs font-semibold line-through"
                    style={{
                      background: 'rgba(222,17,16,0.12)',
                      border: '1px solid rgba(222,17,16,0.35)',
                      color: '#ff7b7b',
                    }}
                  >
                    {issue.originalText}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: '#7B9AD0' }}>Suggestions:</span>
                  {issue.replacements.map((rep, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyFix(issue.id, rep)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      style={{
                        background: 'rgba(37,93,206,0.15)',
                        border: '1px solid rgba(37,93,206,0.40)',
                        color: '#93b4fd',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#255DCE';
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(37,93,206,0.15)';
                        (e.currentTarget as HTMLElement).style.color = '#93b4fd';
                      }}
                    >
                      <span>{rep}</span>
                      <span className="text-xs font-normal opacity-75">Apply</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: '1px solid rgba(37,93,206,0.22)' }}
      >
        <Button variant="outline" size="sm" onClick={onNavigateToAnalyzer}>
          ← Back to Text Analyzer
        </Button>
        <Button
          variant="secondary"
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
