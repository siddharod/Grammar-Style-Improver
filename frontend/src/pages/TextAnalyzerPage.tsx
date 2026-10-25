import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  Languages,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import type { ToneType } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SAMPLE_PRESETS } from '../data/mockData';
import { useToast } from '../components/common/Toast';
import { LoadingIndicator } from '../components/common/LoadingIndicator';

interface TextAnalyzerPageProps {
  onNavigateToResults: (tab: string) => void;
}

export const TextAnalyzerPage: React.FC<TextAnalyzerPageProps> = ({ onNavigateToResults }) => {
  const {
    currentAnalysis,
    updateOriginalText,
    runAnalysis,
    isAnalyzing,
    loadPreset,
  } = useAnalysis();

  const [targetTone, setTargetTone] = useState<ToneType>(currentAnalysis.targetTone || 'Professional');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const tones: { id: ToneType; label: string; desc: string }[] = [
    { id: 'Professional', label: 'Professional', desc: 'Clear, authoritative, respectful' },
    { id: 'Academic', label: 'Academic', desc: 'Scholarly, formal, objective' },
    { id: 'Casual', label: 'Casual', desc: 'Conversational, friendly, accessible' },
    { id: 'Concise', label: 'Concise', desc: 'Direct, brief, eliminating filler' },
    { id: 'Persuasive', label: 'Persuasive', desc: 'Compelling, confident, influential' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAnalysis.originalText);
    setCopied(true);
    showToast('Input text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    updateOriginalText('');
    showToast('Text editor cleared.', 'info');
  };

  const handleRunAnalysis = async () => {
    if (!currentAnalysis.originalText.trim()) {
      showToast('Please type or load text to analyze.', 'error');
      return;
    }
    try {
      await runAnalysis(currentAnalysis.originalText, targetTone, selectedLanguage);
      showToast('Analysis completed successfully!');
      onNavigateToResults('readability');
    } catch (err: any) {
      showToast(err.message || 'Analysis failed. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sample Presets Quick Loader Bar */}
      <div className="bg-[#071B50]/90 backdrop-blur-md rounded-2xl border border-[rgba(79,130,255,0.25)] p-4 shadow-lg shadow-black/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#255DCE] shrink-0" />
            <span className="text-xs font-bold text-[#F5F7FF] uppercase tracking-wider">
              Viva Demonstration Presets:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  loadPreset(preset.id);
                  setTargetTone(preset.tone);
                  showToast(`Loaded ${preset.name}`);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#0A245F] hover:bg-[#102F91] text-[#B8C8F5] hover:text-white border border-[rgba(79,130,255,0.3)] hover:border-[#255DCE] transition-all font-semibold cursor-pointer shadow-xs hover:shadow-[#255DCE]/20"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Text Editor & Live Statistics */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden border-[rgba(79,130,255,0.25)] shadow-xl bg-[#071B50]">
            {/* Editor Toolbar */}
            <div className="px-5 py-3.5 bg-[#0A245F]/90 border-b border-[rgba(79,130,255,0.2)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#255DCE] animate-pulse"></span>
                  Source Text
                </span>
                <span className="text-[rgba(79,130,255,0.4)]">•</span>
                <span className="text-2xs text-[#7B9AD0]">Live Word & Metric Counter</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-[#B8C8F5] hover:text-white rounded-lg bg-[#071B50] hover:bg-[#102F91] border border-[rgba(79,130,255,0.2)] transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Copy text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#255DCE]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 text-[#DE1110] hover:text-white rounded-lg bg-[#2a0808]/50 hover:bg-[#DE1110] border border-[#DE1110]/30 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Clear text"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="p-5 bg-[#04123F]/50">
              <textarea
                value={currentAnalysis.originalText}
                onChange={(e) => updateOriginalText(e.target.value)}
                placeholder="Paste or type your draft here to evaluate readability, grammar, spelling, and tone..."
                rows={12}
                className="w-full text-sm leading-relaxed text-[#F5F7FF] bg-transparent border-0 focus:outline-none resize-y placeholder:text-[#7B9AD0]/50 min-h-[260px] font-sans selection:bg-[#255DCE]/40"
              />
            </div>

            {/* Bottom Real-time Counter Stats Bar */}
            <div className="px-5 py-3 bg-[#0A245F]/80 border-t border-[rgba(79,130,255,0.2)] flex flex-wrap items-center justify-between gap-4 text-xs text-[#7B9AD0]">
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  Words:{' '}
                  <strong className="text-white font-semibold font-mono">
                    {currentAnalysis.metrics.wordCount}
                  </strong>
                </span>
                <span>
                  Characters:{' '}
                  <strong className="text-white font-semibold font-mono">
                    {currentAnalysis.metrics.characterCount}
                  </strong>
                </span>
                <span>
                  Sentences:{' '}
                  <strong className="text-white font-semibold font-mono">
                    {currentAnalysis.metrics.sentenceCount}
                  </strong>
                </span>
                <span className="hidden sm:inline">
                  Avg Words/Sentence:{' '}
                  <strong className="text-white font-semibold font-mono">
                    {currentAnalysis.metrics.averageSentenceLength}
                  </strong>
                </span>
              </div>

              <div>
                <span>
                  Est. Reading Time:{' '}
                  <strong className="text-[#93b4fd] font-semibold font-mono">
                    ~{currentAnalysis.metrics.readingTimeMinutes} min
                  </strong>
                </span>
              </div>
            </div>
          </Card>

          {/* Engine Attribution */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-2xs text-[#7B9AD0] px-1">
            <span>Proofreading powered by <strong className="text-white font-semibold">LanguageTool Public API</strong> &bull; AI Tone & Style powered by <strong className="text-white font-semibold">Groq</strong></span>
            <span>Flesch metrics calculated locally</span>
          </div>

          {isAnalyzing && (
            <LoadingIndicator
              message="Processing Full Multi-stage Analysis"
              subMessage="Calculating Flesch metrics, parsing syntax trees with LanguageTool, and prompting generative AI for stylistic rewrites..."
            />
          )}
        </div>

        {/* Right Col: Configuration & Optimization Controls */}
        <div className="space-y-4">
          <Card className="p-5 border-[rgba(79,130,255,0.25)] bg-[#071B50] shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-[rgba(79,130,255,0.2)] flex items-center justify-between">
              <span>Analysis Configuration</span>
              <span className="w-2 h-2 rounded-full bg-[#255DCE]"></span>
            </h3>

            {/* Language Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#B8C8F5] mb-2 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#255DCE]" />
                Language Engine
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-[#0A245F] border border-[rgba(79,130,255,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255DCE]/60 text-white cursor-pointer"
              >
                <option value="en-US" className="bg-[#071B50] text-white">English (United States) - LanguageTool</option>
                <option value="en-GB" className="bg-[#071B50] text-white">English (United Kingdom)</option>
                <option value="en-CA" className="bg-[#071B50] text-white">English (Canada)</option>
                <option value="en-AU" className="bg-[#071B50] text-white">English (Australia)</option>
              </select>
              <p className="mt-1.5 text-2xs text-[#7B9AD0]">
                Grammar rules will be calibrated to the chosen dialect.
              </p>
            </div>

            {/* Target Tone Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#B8C8F5] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#255DCE]" />
                Target Tone / Writing Goal
              </label>
              <div className="space-y-2">
                {tones.map((t) => (
                  <label
                    key={t.id}
                    onClick={() => setTargetTone(t.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      targetTone === t.id
                        ? 'border-[#255DCE] bg-gradient-to-r from-[#102F91]/80 to-[#0A245F] text-white font-bold shadow-md shadow-[#255DCE]/20 ring-1 ring-[#255DCE]'
                        : 'border-[rgba(79,130,255,0.2)] bg-[#0A245F]/60 hover:bg-[#0A245F] text-[#B8C8F5]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      checked={targetTone === t.id}
                      onChange={() => setTargetTone(t.id)}
                      className="mt-0.5 text-[#255DCE] focus:ring-[#255DCE] accent-[#255DCE] cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold block text-white">{t.label}</span>
                      <span className="text-2xs text-[#7B9AD0] block leading-tight mt-0.5">
                        {t.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isAnalyzing}
              onClick={handleRunAnalysis}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze & Optimize Text
            </Button>
          </Card>

          {/* Quick results navigation helper */}
          <Card className="p-4 bg-[#0A245F]/70 border-[rgba(79,130,255,0.25)]">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#255DCE] shrink-0 mt-0.5" />
              <div className="text-2xs text-[#B8C8F5] leading-relaxed">
                <span className="font-bold text-white block mb-1">Navigation Shortcut</span>
                Once analyzed, you can navigate between Grammar, Readability & Tone, Improved Text, and Writing Suggestions using the sidebar.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
