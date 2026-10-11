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
        return 'mint';
      case 'Active Voice':
        return 'lavender';
      case 'Vocabulary':
        return 'pink';
      default:
        return 'slate';
    }
  };

  const getSeverityBadgeVariant = (sev: string) => {
    switch (sev) {
      case 'high':
        return 'pink';
      case 'medium':
        return 'amber';
      case 'low':
        return 'mint';
      default:
        return 'slate';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Categorized Writing Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              AI-generated actionable insights to elevate clarity, voice, and stylistic maturity
            </p>
          </div>
        </div>

        <Badge variant="lavender" size="md">
          {currentAnalysis.suggestions.length} Actionable Suggestions
        </Badge>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5" /> Category:
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
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Suggestions List */}
      {filteredSuggestions.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
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
              className="p-6 border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Badge variant={getCategoryBadgeVariant(suggestion.category)} size="sm">
                    {suggestion.category}
                  </Badge>
                  <h4 className="text-sm font-bold text-slate-800">
                    {suggestion.title}
                  </h4>
                </div>

                <Badge variant={getSeverityBadgeVariant(suggestion.severity)} size="sm">
                  {suggestion.severity.toUpperCase()} IMPACT
                </Badge>
              </div>

              {/* Detailed Explanation */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {suggestion.explanation}
              </p>

              {/* Before and After Comparison Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <span className="text-2xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                    Original Construction
                  </span>
                  <p className="text-xs text-rose-950 font-medium">
                    "{suggestion.before}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-2xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                    Recommended Polish
                  </span>
                  <p className="text-xs text-emerald-950 font-semibold">
                    "{suggestion.after}"
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
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
