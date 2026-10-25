import React from 'react';
import { Gauge, Sparkles, BookOpen, Cpu, ArrowRight } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface ReadabilityTonePageProps {
  onNavigateToImproved: () => void;
}

export const ReadabilityTonePage: React.FC<ReadabilityTonePageProps> = ({ onNavigateToImproved }) => {
  const { currentAnalysis } = useAnalysis();
  const { metrics, detectedTones, providerUsed, targetTone } = currentAnalysis;

  const getFleschScoreDetails = (score: number) => {
    if (score >= 90) return { label: 'Very Easy',       note: '5th grade level. Extremely clear and conversational.' };
    if (score >= 80) return { label: 'Easy',             note: '6th grade level. Conversational English.' };
    if (score >= 70) return { label: 'Fairly Easy',      note: '7th grade level. Plain English for general audience.' };
    if (score >= 60) return { label: 'Standard',         note: '8th–9th grade level. Suitable for mainstream business & media.' };
    if (score >= 50) return { label: 'Fairly Difficult', note: '10th–12th grade level. Requires focused attention.' };
    if (score >= 30) return { label: 'Difficult',        note: 'College undergraduate level. Dense scholarly prose.' };
    return             { label: 'Very Confusing',        note: 'College graduate level. Convoluted syntax.' };
  };

  const fleschDetails = getFleschScoreDetails(metrics.fleschScore);

  const panelStyle = {
    background: '#071B50',
    border: '1px solid rgba(79,130,255,0.22)',
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl" style={panelStyle}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
            style={{ background: 'rgba(37,93,206,0.15)', border: '1px solid rgba(37,93,206,0.40)' }}
          >
            <Gauge className="w-5 h-5 text-[#255DCE]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Readability Metrics & AI Tone Diagnostics</h3>
            <p className="text-xs" style={{ color: '#7B9AD0' }}>
              Algorithmic Flesch evaluation coupled with semantic AI tone classification
            </p>
          </div>
        </div>
        <Badge variant="blue" size="md" icon={<Cpu className="w-3.5 h-3.5" />}>
          Engine: {providerUsed}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Readability */}
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={panelStyle}>
            <div
              className="flex items-center justify-between pb-4 mb-4"
              style={{ borderBottom: '1px solid rgba(37,93,206,0.22)' }}
            >
              <div>
                <span className="text-2xs font-bold text-[#255DCE] uppercase tracking-wider">
                  Mathematical Analysis
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">Flesch Reading Ease Score</h4>
              </div>
              <Badge variant="navy" size="sm">Target: {targetTone}</Badge>
            </div>

            {/* Score display */}
            <div
              className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl"
              style={{ background: 'rgba(10,36,95,0.60)', border: '1px solid rgba(37,93,206,0.30)' }}
            >
              <div
                className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full shrink-0"
                style={{
                  border: '4px solid rgba(37,93,206,0.50)',
                  background: 'rgba(7,27,80,0.90)',
                  boxShadow: '0 0 24px rgba(37,93,206,0.30)',
                }}
              >
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  {metrics.fleschScore}
                </span>
                <span className="text-2xs font-semibold uppercase tracking-wider" style={{ color: '#7B9AD0' }}>
                  Out of 100
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-1.5"
                  style={{
                    background: 'rgba(37,93,206,0.18)',
                    border: '1px solid rgba(37,93,206,0.40)',
                    color: '#93b4fd',
                  }}
                >
                  {fleschDetails.label}
                </div>
                <h5 className="text-sm font-semibold text-white">{metrics.gradeLevel}</h5>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: '#B8C8F5' }}>
                  {fleschDetails.note}
                </p>
              </div>
            </div>

            {/* Secondary metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {[
                { label: 'Grade Level',          val: metrics.gradeLevel },
                { label: 'Avg Sentence Length',  val: `${metrics.averageSentenceLength} words` },
                { label: 'Avg Syllables / Word', val: metrics.averageSyllablesPerWord },
                { label: 'Complex Word Ratio',   val: `${metrics.complexWordPercentage}%` },
                { label: 'Est. Reading Time',    val: `~${metrics.readingTimeMinutes} min` },
                { label: 'Sentence Count',       val: metrics.sentenceCount },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="p-3 rounded-xl"
                  style={{ background: 'rgba(10,36,95,0.60)', border: '1px solid rgba(79,130,255,0.20)' }}
                >
                  <span className="text-2xs font-medium block" style={{ color: '#7B9AD0' }}>{label}</span>
                  <span className="text-sm font-bold text-white block mt-0.5 font-mono">{val}</span>
                </div>
              ))}
            </div>

            {/* Formula reference */}
            <div
              className="mt-5 p-3.5 rounded-xl flex items-start gap-2.5"
              style={{ background: 'rgba(37,93,206,0.10)', border: '1px solid rgba(37,93,206,0.30)' }}
            >
              <BookOpen className="w-4 h-4 text-[#255DCE] shrink-0 mt-0.5" />
              <div className="text-2xs leading-relaxed" style={{ color: '#B8C8F5' }}>
                <span className="font-bold block text-white mb-0.5">Viva Formula Defense:</span>
                Flesch Reading Ease (FRE):{' '}
                <code
                  className="font-mono px-1.5 py-0.5 rounded text-xs font-semibold"
                  style={{
                    background: 'rgba(37,93,206,0.20)',
                    border: '1px solid rgba(37,93,206,0.35)',
                    color: '#93b4fd',
                  }}
                >
                  206.835 - 1.015(Words/Sentences) - 84.6(Syllables/Words)
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tone Analysis */}
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={panelStyle}>
            <div
              className="flex items-center justify-between pb-4 mb-4"
              style={{ borderBottom: '1px solid rgba(37,93,206,0.22)' }}
            >
              <div>
                <span className="text-2xs font-bold text-[#255DCE] uppercase tracking-wider">
                  Semantic Intelligence
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">AI-Detected Tone Breakdown</h4>
              </div>
              <Badge variant="blue" size="sm" icon={<Sparkles className="w-3 h-3 text-[#255DCE]" />}>
                Groq Multi-Tone
              </Badge>
            </div>

            <p className="text-xs mb-5 leading-relaxed" style={{ color: '#B8C8F5' }}>
              The neural model deconstructs your draft across sentiment, formality, conciseness, and
              emotional resonance to diagnose tone alignment:
            </p>

            <div className="space-y-4">
              {detectedTones.map((tone, idx) => {
                const barColors = [
                  'linear-gradient(90deg, #021861, #255DCE)',
                  'linear-gradient(90deg, #255DCE, #1a44a8)',
                  'linear-gradient(90deg, #DE1110, #a00d0c)',
                ];
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl"
                    style={{ background: 'rgba(10,36,95,0.60)', border: '1px solid rgba(79,130,255,0.20)' }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{tone.tone}</span>
                      <span className="text-xs font-mono font-bold text-[#93b4fd]">{tone.percentage}%</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden mb-2"
                      style={{ background: 'rgba(7,27,80,0.80)', border: '1px solid rgba(37,93,206,0.20)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${tone.percentage}%`,
                          background: barColors[idx % barColors.length],
                        }}
                      />
                    </div>
                    <p className="text-2xs leading-relaxed" style={{ color: '#B8C8F5' }}>
                      {tone.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Provider note */}
            <div
              className="mt-5 p-3.5 rounded-xl flex items-center justify-between text-2xs"
              style={{
                background: 'rgba(10,36,95,0.60)',
                border: '1px solid rgba(79,130,255,0.20)',
                color: '#7B9AD0',
              }}
            >
              <span>Primary Engine: Groq Cloud API (Qwen 3)</span>
              <span className="text-[#255DCE] font-semibold">Local Readability Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-end pt-4"
        style={{ borderTop: '1px solid rgba(37,93,206,0.22)' }}
      >
        <Button
          variant="secondary"
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
