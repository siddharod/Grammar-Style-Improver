import React, { useState } from 'react';
import {
  Lightbulb,
  Filter,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

interface WritingSuggestionsPageProps {
  onNavigateToImproved: () => void;
  onNavigateToHistory: () => void;
}

export const WritingSuggestionsPage: React.FC<WritingSuggestionsPageProps> = ({
  onNavigateToImproved,
  onNavigateToHistory,
}) => {
  const { currentAnalysis } = useAnalysis();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Clarity', 'Conciseness', 'Active Voice', 'Vocabulary'];

  const filteredSuggestions =
    activeCategory === 'All'
      ? currentAnalysis.suggestions
      : currentAnalysis.suggestions.filter((s) => s.category === activeCategory);

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Clarity':
        return 'blue';
      case 'Conciseness':
        return 'navy';
      case 'Active Voice':
        return 'blue';
      case 'Vocabulary':
        return 'navy';
      default:
        return 'slate';
    }
  };

  const getSeverityBadgeVariant = (sev: string) => {
    switch (sev) {
      case 'high':
        return 'red';
      case 'medium':
        return 'amber';
      case 'low':
        return 'blue';
      default:
        return 'slate';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.25)] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#255DCE] to-[#021861] text-white border border-[rgba(79,130,255,0.4)] shadow-md shadow-[#255DCE]/30">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Categorized Writing Recommendations
            </h3>
            <p className="text-xs text-[#7B9AD0] mt-0.5">
              AI-generated actionable insights to elevate clarity, voice, and stylistic maturity
            </p>
          </div>
        </div>

        <Badge variant="blue" size="md">
          {currentAnalysis.suggestions.length} Actionable Suggestions
        </Badge>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#7B9AD0] flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#255DCE]" /> Category:
        </span>
        {categories.map((cat) => {
          const count =
            cat === 'All'
              ? currentAnalysis.suggestions.length
              : currentAnalysis.suggestions.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#255DCE] to-[#102F91] text-white shadow-md shadow-[#255DCE]/30 border border-[#255DCE] ring-1 ring-[#255DCE]/50'
                  : 'bg-[#071B50] text-[#B8C8F5] border border-[rgba(79,130,255,0.25)] hover:bg-[#0A245F] hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Suggestions List */}
      {filteredSuggestions.length === 0 ? (
        <Card className="p-8 border-[rgba(79,130,255,0.25)] bg-[#071B50]">
          <EmptyState
            icon={<CheckCircle2 className="w-6 h-6 text-[#255DCE]" />}
            title="No Pending Recommendations"
            description="Your text already adheres to optimal clarity, voice, and conciseness guidelines."
            actionLabel="View Analysis History"
            onAction={onNavigateToHistory}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="p-6 border-[rgba(79,130,255,0.25)] shadow-xl hover:border-[#255DCE]/60 hover:shadow-[#255DCE]/10 transition-all bg-[#071B50]"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[rgba(79,130,255,0.2)]">
                <div className="flex items-center gap-2.5">
                  <Badge variant={getCategoryBadgeVariant(suggestion.category)} size="sm">
                    {suggestion.category}
                  </Badge>
                  <h4 className="text-sm font-bold text-white">
                    {suggestion.title}
                  </h4>
                </div>

                <Badge variant={getSeverityBadgeVariant(suggestion.severity)} size="sm">
                  {suggestion.severity.toUpperCase()} IMPACT
                </Badge>
              </div>

              {/* Detailed Explanation */}
              <p className="text-xs sm:text-sm text-[#B8C8F5] leading-relaxed mb-4">
                {suggestion.explanation}
              </p>

              {/* Before and After Comparison Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#2a0808]/60 border border-[#DE1110]/35 shadow-xs">
                  <span className="text-2xs font-bold text-[#f87171] uppercase tracking-wider block mb-1">
                    Original Construction
                  </span>
                  <p className="text-xs text-[#fca5a5] font-medium font-sans">
                    "{suggestion.before}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A245F] border border-[#255DCE]/40 shadow-xs">
                  <span className="text-2xs font-bold text-[#93b4fd] uppercase tracking-wider block mb-1">
                    Recommended Polish
                  </span>
                  <p className="text-xs text-white font-bold font-sans">
                    "{suggestion.after}"
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[rgba(79,130,255,0.2)]">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToImproved}
        >
          ← Back to Improved Text
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateToHistory}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Full Analysis History
        </Button>
      </div>
    </div>
  );
};
