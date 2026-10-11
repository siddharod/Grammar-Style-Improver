import React from 'react';
import {
  FileText,
  Gauge,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
  GraduationCap,
  ChevronRight,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';
import { Card, StatCard } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SAMPLE_PRESETS } from '../data/mockData';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { history, loadPreset, loadHistoryRecord } = useAnalysis();

  // Compute live statistics from history
  const totalAnalyses = history.length;
  const avgReadability =
    history.length > 0
      ? (history.reduce((acc, item) => acc + item.metrics.fleschScore, 0) / history.length).toFixed(1)
      : '0.0';
  const totalIssuesDetected = history.reduce((acc, item) => acc + item.issues.length, 0);

  const handleSelectPreset = (presetId: string) => {
    loadPreset(presetId);
    onNavigate('analyzer');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Viva Banner */}
      <div className="bg-gradient-to-r from-purple-50/90 via-white to-blue-50/60 rounded-2xl border border-purple-100 p-6 sm:p-7 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-2xs font-bold uppercase tracking-wider mb-2.5">
              <GraduationCap className="w-3.5 h-3.5" /> College Viva & Technical Demonstration Mode
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Researcher'}!
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Grammar & Style Improver analyzes text readability using standard mathematical formulas,
              scans syntax via LanguageTool, and optimizes tone using dual-provider generative AI.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('analyzer')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze New Text
            </Button>
          </div>
        </div>
      </div>

      {/* Clearly Labelled Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Analyses"
          value={totalAnalyses}
          subtitle="Saved in SQLite session"
          icon={<FileText className="w-5 h-5" />}
          accent="lavender"
          onClick={() => onNavigate('history')}
        />
        <StatCard
          title="Avg Readability Score"
          value={`${avgReadability} / 100`}
          subtitle="Flesch Reading Ease Formula"
          icon={<Gauge className="w-5 h-5" />}
          accent="blue"
          onClick={() => onNavigate('readability')}
        />
        <StatCard
          title="Issues Flagged"
          value={totalIssuesDetected}
          subtitle="Grammar, spelling & style"
          icon={<AlertCircle className="w-5 h-5" />}
          accent="pink"
          onClick={() => onNavigate('grammar')}
        />
        <StatCard
          title="Active AI Provider"
          value="Gemini 1.5"
          subtitle="Groq backup configured"
          icon={<Cpu className="w-5 h-5" />}
          accent="mint"
          onClick={() => onNavigate('settings')}
        />
      </div>

      {/* 2-Column Section: Analyze New Text Action Card + Quick Viva Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Action & Feature Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-purple-200/60 shadow-xs relative overflow-hidden bg-white">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Quick Action
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Start an Optimization Run
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paste any draft to inspect Flesch readability, fix grammar, and rewrite for a specific tone.
                </p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-2xs font-bold text-slate-400 uppercase">Step 1</span>
                  <h4 className="text-xs font-semibold text-slate-800 mt-1">Input Text</h4>
                  <p className="text-2xs text-slate-500 mt-1">
                    Paste raw text or select one of 4 viva sample drafts.
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
                <div>
                  <span className="text-2xs font-bold text-purple-500 uppercase">Step 2</span>
                  <h4 className="text-xs font-semibold text-purple-900 mt-1">Real-time Checks</h4>
                  <p className="text-2xs text-purple-700/80 mt-1">
                    LanguageTool grammar checks & Flesch calculations.
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
                <div>
                  <span className="text-2xs font-bold text-emerald-600 uppercase">Step 3</span>
                  <h4 className="text-xs font-semibold text-emerald-900 mt-1">AI Rewriting</h4>
                  <p className="text-2xs text-emerald-700/80 mt-1">
                    Side-by-side comparison with word difference view.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('history')}
              >
                Browse History
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('analyzer')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Launch Text Analyzer
              </Button>
            </div>
          </Card>

          {/* Recent Analyses List */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Analysis Records</h3>
                <p className="text-2xs text-slate-500">Analyses saved in current session</p>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer flex items-center gap-1"
              >
                View all ({history.length}) →
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-slate-50/60 -mx-3 px-3 rounded-xl transition-colors cursor-pointer"
                  onClick={() => {
                    loadHistoryRecord(item.id);
                    onNavigate('improved');
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {item.title}
                      </h4>
                      <Badge variant="lavender" size="sm">
                        {item.targetTone}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-2xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{item.metrics.wordCount} words</span>
                      <span>•</span>
                      <span className="text-slate-600 font-medium">
                        Flesch: {item.metrics.fleschScore} ({item.metrics.fleschCategory})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.issues.length > 0 ? (
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                        {item.issues.length} Issues
                      </span>
                    ) : (
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        Clean
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Instant Viva Demonstration Samples & System Pillars */}
        <div className="space-y-6">
          <Card className="p-5 border-blue-100/80">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Instant Viva Demonstration Samples
              </h3>
            </div>
            <p className="text-2xs text-slate-500 mb-3">
              Click any sample below to instantly load test text into the analyzer for live examination:
            </p>

            <div className="space-y-2.5">
              {SAMPLE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-purple-300 hover:bg-purple-50/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-900">
                      {preset.name}
                    </span>
                    <Badge variant="blue" size="sm">
                      {preset.tone}
                    </Badge>
                  </div>
                  <p className="mt-1 text-2xs text-slate-500 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Technical Viva Architecture Box */}
          <Card className="p-5 bg-slate-50/80 border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              System Architecture Note
            </h4>
            <div className="space-y-2 text-2xs text-slate-600 leading-relaxed">
              <p>
                <strong>Mathematical Engine:</strong> Flesch Reading Ease:
                <br />
                <code className="text-2xs bg-white px-1.5 py-0.5 rounded border border-slate-200 text-purple-700 font-mono">
                  206.835 - 1.015(ASL) - 84.6(ASW)
                </code>
              </p>
              <p>
                <strong>Grammar Engine:</strong> LanguageTool HTTP API (`/v2/check`) with structured rule match offsets.
              </p>
              <p>
                <strong>AI Tone Engine:</strong> Google Gemini API with seamless failover to Groq Cloud.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
