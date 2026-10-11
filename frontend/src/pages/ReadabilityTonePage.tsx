import React from 'react';
import {
  Gauge,
  Sparkles,
  BookOpen,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface ReadabilityTonePageProps {
  onNavigateToImproved: () => void;
}

export const ReadabilityTonePage: React.FC<ReadabilityTonePageProps> = ({ onNavigateToImproved }) => {
  const { currentAnalysis } = useAnalysis();
  const { metrics, detectedTones, providerUsed, targetTone } = currentAnalysis;

  // Flesch Score color category determination
  const getFleschScoreDetails = (score: number) => {
    if (score >= 90) return { label: 'Very Easy', color: 'text-emerald-700', bg: 'bg-emerald-500', note: '5th grade reading level. Extremely clear and conversational.' };
    if (score >= 80) return { label: 'Easy', color: 'text-emerald-600', bg: 'bg-emerald-400', note: '6th grade level. Conversational English.' };
    if (score >= 70) return { label: 'Fairly Easy', color: 'text-blue-600', bg: 'bg-blue-400', note: '7th grade level. Plain English for general audience.' };
    if (score >= 60) return { label: 'Standard', color: 'text-purple-600', bg: 'bg-purple-500', note: '8th to 9th grade level. Suitable for mainstream business & media.' };
    if (score >= 50) return { label: 'Fairly Difficult', color: 'text-amber-600', bg: 'bg-amber-500', note: '10th to 12th grade level. Requires focused attention.' };
    if (score >= 30) return { label: 'Difficult', color: 'text-rose-600', bg: 'bg-rose-500', note: 'College undergraduate level. Dense scholarly prose.' };
    return { label: 'Very Confusing', color: 'text-rose-700', bg: 'bg-rose-600', note: 'College graduate level. Convoluted syntax.' };
  };

  const fleschDetails = getFleschScoreDetails(metrics.fleschScore);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Readability Metrics & AI Tone Diagnostics
            </h3>
            <p className="text-xs text-slate-500">
              Algorithmic Flesch evaluation coupled with semantic AI tone classification
            </p>
          </div>
        </div>

        <Badge variant="mint" size="md" icon={<Cpu className="w-3.5 h-3.5" />}>
          Engine: {providerUsed}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Readability Scoring Engine */}
        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-2xs font-bold text-purple-600 uppercase tracking-wider">
                  Mathematical Analysis
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Flesch Reading Ease Score
                </h4>
              </div>
              <Badge variant="lavender" size="sm">
                Target: {targetTone}
              </Badge>
            </div>

            {/* Score Visual Gauge Display */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
              {/* Circular Gauge / Numerical Score */}
              <div className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-purple-100 bg-white shadow-2xs shrink-0">
                <span className={`text-3xl font-extrabold tracking-tight ${fleschDetails.color}`}>
                  {metrics.fleschScore}
                </span>
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                  Out of 100
                </span>
              </div>

              {/* Qualitative Interpretation */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-1.5">
                  Category: {metrics.fleschCategory}
                </div>
                <h5 className="text-sm font-semibold text-slate-800">
                  Equivalent to {metrics.gradeLevel}
                </h5>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {fleschDetails.note}
                </p>
              </div>
            </div>

            {/* Secondary Readability Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-2xs font-medium text-slate-400 block">Grade Level</span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                  {metrics.gradeLevel}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-2xs font-medium text-slate-400 block">Avg Sentence Length</span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                  {metrics.averageSentenceLength} words
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-2xs font-medium text-slate-400 block">Avg Syllables / Word</span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                  {metrics.averageSyllablesPerWord}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-2xs font-medium text-slate-400 block">Complex Word Ratio</span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                  {metrics.complexWordPercentage}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-2xs font-medium text-slate-400 block">Est. Reading Time</span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                  ~{metrics.readingTimeMinutes} min
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-2xs font-medium text-slate-400 block">Sentence Count</span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5 font-mono">
                  {metrics.sentenceCount}
                </span>
              </div>
            </div>

            {/* Viva Technical Explanation Card */}
            <div className="mt-5 p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-2xs text-purple-900 leading-relaxed">
                <span className="font-semibold block mb-0.5">Viva Formula Defense:</span>
                Flesch Reading Ease (FRE) is determined by:{' '}
                <code className="font-mono bg-white px-1 py-0.5 rounded text-purple-800">
                  206.835 - 1.015(Words / Sentences) - 84.6(Syllables / Words)
                </code>
                . Higher scores indicate easier comprehension.
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI-Powered Tone Analysis */}
        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-2xs font-bold text-purple-600 uppercase tracking-wider">
                  Semantic Intelligence
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  AI-Detected Tone Breakdown
                </h4>
              </div>
              <Badge variant="blue" size="sm" icon={<Sparkles className="w-3 h-3 text-blue-500" />}>
                Gemini Multi-Tone
              </Badge>
            </div>

            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Our neural model deconstructs your draft across sentiment, formality, conciseness, and emotional resonance to diagnose tone alignment:
            </p>

            <div className="space-y-4">
              {detectedTones.map((tone, idx) => {
                const barColor =
                  tone.color === 'blue'
                    ? 'bg-blue-500'
                    : tone.color === 'pink'
                    ? 'bg-pink-500'
                    : tone.color === 'mint'
                    ? 'bg-emerald-500'
                    : 'bg-purple-500';

                return (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">{tone.tone}</span>
                      <span className="text-xs font-mono font-bold text-purple-700">
                        {tone.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${tone.percentage}%` }}
                      />
                    </div>

                    <p className="text-2xs text-slate-500 leading-relaxed">
                      {tone.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* AI Provider Transparency Note */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-2xs text-slate-500">
              <span>Primary Engine: Google Gemini 1.5 REST API</span>
              <span className="text-purple-600 font-medium">Automatic Groq Failover Enabled</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
        <Button
          variant="primary"
          size="md"
          onClick={onNavigateToImproved}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Rewritten & Improved Text
        </Button>
      </div>
    </div>
  );
};
