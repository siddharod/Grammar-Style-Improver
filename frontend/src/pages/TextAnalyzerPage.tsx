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
    await runAnalysis(currentAnalysis.originalText, targetTone, selectedLanguage);
    showToast('Analysis completed successfully!');
    onNavigateToResults('readability');
  };

  return (
    <div className="space-y-6">
      {/* Sample Presets Quick Loader Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
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
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 border border-slate-200/80 hover:border-purple-200 transition-all font-medium cursor-pointer"
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
          <Card className="p-0 overflow-hidden border-slate-200/80 shadow-xs">
            {/* Editor Toolbar */}
            <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Source Text
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-2xs text-slate-500">Live Word & Metric Counter</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Clear text"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="p-4 sm:p-5">
              <textarea
                value={currentAnalysis.originalText}
                onChange={(e) => updateOriginalText(e.target.value)}
                placeholder="Paste or type your draft here to evaluate readability, grammar, spelling, and tone..."
                rows={12}
                className="w-full text-sm leading-relaxed text-slate-800 bg-transparent border-0 focus:outline-none resize-y placeholder:text-slate-400 min-h-[260px]"
              />
            </div>

            {/* Bottom Real-time Counter Stats Bar */}
            <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  Words:{' '}
                  <strong className="text-slate-800 font-semibold font-mono">
                    {currentAnalysis.metrics.wordCount}
                  </strong>
                </span>
                <span>
                  Characters:{' '}
                  <strong className="text-slate-800 font-semibold font-mono">
                    {currentAnalysis.metrics.characterCount}
                  </strong>
                </span>
                <span>
                  Sentences:{' '}
                  <strong className="text-slate-800 font-semibold font-mono">
                    {currentAnalysis.metrics.sentenceCount}
                  </strong>
                </span>
                <span className="hidden sm:inline">
                  Avg Words/Sentence:{' '}
                  <strong className="text-slate-800 font-semibold font-mono">
                    {currentAnalysis.metrics.averageSentenceLength}
                  </strong>
                </span>
              </div>

              <div>
                <span>
                  Est. Reading Time:{' '}
                  <strong className="text-purple-700 font-semibold font-mono">
                    ~{currentAnalysis.metrics.readingTimeMinutes} min
                  </strong>
                </span>
              </div>
            </div>
          </Card>

          {isAnalyzing && (
            <LoadingIndicator
              message="Processing Full Multi-stage Analysis"
              subMessage="Calculating Flesch metrics, parsing syntax trees with LanguageTool, and prompting generative AI for stylistic rewrites..."
            />
          )}
        </div>

        {/* Right Col: Configuration & Optimization Controls */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              Analysis Configuration
            </h3>

            {/* Language Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-purple-600" />
                Language Engine
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-slate-800 cursor-pointer"
              >
                <option value="en-US">English (United States) - LanguageTool</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="en-CA">English (Canada)</option>
                <option value="en-AU">English (Australia)</option>
              </select>
              <p className="mt-1 text-2xs text-slate-400">
                Grammar rules will be calibrated to the chosen dialect.
              </p>
            </div>

            {/* Target Tone Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Target Tone / Writing Goal
              </label>
              <div className="space-y-2">
                {tones.map((t) => (
                  <label
                    key={t.id}
                    onClick={() => setTargetTone(t.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      targetTone === t.id
                        ? 'border-purple-300 bg-purple-50/70 text-purple-950'
                        : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      checked={targetTone === t.id}
                      onChange={() => setTargetTone(t.id)}
                      className="mt-0.5 text-purple-600 focus:ring-purple-400 accent-purple-600 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold block">{t.label}</span>
                      <span className="text-2xs text-slate-500 block leading-tight mt-0.5">
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
          <Card className="p-4 bg-purple-50/50 border-purple-100">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-2xs text-purple-900 leading-relaxed">
                <span className="font-semibold block mb-1">Navigation Shortcut</span>
                Once analyzed, you can navigate between Grammar, Readability & Tone, Improved Text, and Writing Suggestions using the sidebar.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
