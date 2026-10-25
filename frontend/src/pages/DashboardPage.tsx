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
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';
import { StatCard } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { SAMPLE_PRESETS } from '../data/mockData';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { history, loadPreset, loadHistoryRecord } = useAnalysis();

  const totalAnalyses      = history.length;
  const avgReadability     = history.length > 0
    ? (history.reduce((a, i) => a + i.metrics.fleschScore, 0) / history.length).toFixed(1)
    : '0.0';
  const totalIssues        = history.reduce((a, i) => a + i.issues.length, 0);

  const handleSelectPreset = (id: string) => {
    loadPreset(id);
    onNavigate('analyzer');
  };

  return (
    <div className="space-y-6">

      {/* ── HERO SECTION ── */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 sm:p-8 lg:p-10"
        style={{
          background: 'linear-gradient(115deg, #010e3b 0%, #021861 40%, #1a44a8 75%, #255DCE 100%)',
          border: '1px solid rgba(37,93,206,0.50)',
          boxShadow: '0 0 60px rgba(37,93,206,0.30), 0 2px 40px rgba(4,18,63,0.60)',
        }}
      >
        {/* Ambient light blobs */}
        <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(37,93,206,0.35) 0%, transparent 70%)' }} />
        <div className="absolute right-1/4 bottom-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)' }} />
        {/* Decorative AI lines */}
        <div className="absolute top-6 right-8 hidden lg:block opacity-15 pointer-events-none">
          <Sparkles className="w-40 h-40 text-white" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
                color: '#DCE7FF',
                backdropFilter: 'blur(8px)',
              }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              College Viva · Technical Demonstration
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back,{' '}
              <span
                style={{
                  backgroundImage: 'linear-gradient(90deg, #ffffff 0%, #93b4fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {user?.name || 'Researcher'}!
              </span>
            </h2>

            <p className="mt-2 text-sm sm:text-base max-w-xl leading-relaxed font-medium"
              style={{ color: '#B8C8F5' }}>
              Grammar & Style Improver evaluates readability with Flesch formulas,
              scans syntax via LanguageTool, and rewrites tone using Groq Cloud AI.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('analyzer')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-[0_0_24px_rgba(37,93,206,0.60)] hover:shadow-[0_0_36px_rgba(37,93,206,0.80)]"
            >
              Analyze New Text
            </Button>
          </div>
        </div>
      </div>

      {/* ── STATISTICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Analyses"
          value={totalAnalyses}
          subtitle="Saved in SQLite session"
          icon={<FileText className="w-5 h-5 text-white" />}
          variant="navy"
          onClick={() => onNavigate('history')}
        />
        <StatCard
          title="Avg Readability Score"
          value={`${avgReadability} / 100`}
          subtitle="Flesch Reading Ease Formula"
          icon={<Gauge className="w-5 h-5 text-white" />}
          variant="blue"
          onClick={() => onNavigate('readability')}
        />
        <StatCard
          title="Issues Flagged"
          value={totalIssues}
          subtitle="Grammar, spelling & style"
          icon={<AlertCircle className="w-5 h-5 text-[#DE1110]" />}
          variant="red"
          onClick={() => onNavigate('grammar')}
        />
        <StatCard
          title="Active AI Provider"
          value="Groq Cloud AI"
          subtitle="Tone & Writing Assistant"
          icon={<Cpu className="w-5 h-5 text-[#93b4fd]" />}
          variant="elevated"
          accent="cobalt"
          onClick={() => onNavigate('settings')}
        />
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-col: Action card + Recent analyses */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Action Card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#071B50',
              border: '1px solid rgba(79,130,255,0.22)',
              boxShadow: '0 2px 16px rgba(4,18,63,0.40)',
            }}
          >
            <div
              className="flex items-start justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(37,93,206,0.22)' }}
            >
              <div>
                <span className="text-xs font-bold text-[#255DCE] uppercase tracking-wider">
                  Quick Action
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Start an Optimization Run
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#7B9AD0' }}>
                  Paste any draft to inspect Flesch readability, fix grammar, and rewrite tone.
                </p>
              </div>
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                style={{
                  background: 'rgba(37,93,206,0.15)',
                  border: '1px solid rgba(37,93,206,0.35)',
                }}
              >
                <Sparkles className="w-5 h-5 text-[#255DCE]" />
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5">
              <div
                className="p-4 rounded-xl flex flex-col justify-between"
                style={{ background: 'rgba(10,36,95,0.60)', border: '1px solid rgba(79,130,255,0.20)' }}
              >
                <span className="text-xs font-bold text-[#255DCE] uppercase tracking-wider">Step 1</span>
                <h4 className="text-xs font-bold text-white mt-1">Input Text</h4>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#7B9AD0' }}>
                  Paste raw text or select one of 4 viva sample drafts.
                </p>
              </div>

              <div
                className="p-4 rounded-xl flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,36,95,0.80), rgba(26,68,168,0.50))',
                  border: '1px solid rgba(37,93,206,0.40)',
                }}
              >
                <span className="text-xs font-bold text-[#B8C8F5] uppercase tracking-wider">Step 2</span>
                <h4 className="text-xs font-bold text-white mt-1">Real-time Checks</h4>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#93b4fd' }}>
                  LanguageTool grammar checks & Flesch calculations.
                </p>
              </div>

              <div
                className="p-4 rounded-xl flex flex-col justify-between text-white"
                style={{
                  background: 'linear-gradient(135deg, #255DCE 0%, #1a44a8 100%)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 0 18px rgba(37,93,206,0.40)',
                }}
              >
                <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Step 3</span>
                <h4 className="text-xs font-bold text-white mt-1">AI Rewriting</h4>
                <p className="text-xs mt-1.5 leading-relaxed text-blue-100">
                  Side-by-side diff view with word-level highlighting.
                </p>
              </div>
            </div>

            <div
              className="flex items-center justify-end gap-3 px-5 py-4"
              style={{ borderTop: '1px solid rgba(37,93,206,0.20)' }}
            >
              <Button variant="outline" size="sm" onClick={() => onNavigate('history')}>
                Browse History
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onNavigate('analyzer')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Launch Text Analyzer
              </Button>
            </div>
          </div>

          {/* Recent Analyses */}
          <div
            className="rounded-2xl"
            style={{
              background: '#071B50',
              border: '1px solid rgba(79,130,255,0.22)',
              boxShadow: '0 2px 16px rgba(4,18,63,0.40)',
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(37,93,206,0.22)' }}
            >
              <div>
                <h3 className="text-sm font-bold text-white">Recent Analysis Records</h3>
                <p className="text-xs" style={{ color: '#7B9AD0' }}>
                  Analyses saved in current session
                </p>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold transition-colors cursor-pointer"
                style={{ color: '#255DCE' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#93b4fd')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#255DCE')}
              >
                View all ({history.length}) →
              </button>
            </div>

            <div className="divide-y px-2 py-1"
              style={{ borderColor: 'rgba(37,93,206,0.15)' }}>
              {history.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#255DCE' }} />
                  <p className="text-sm text-white font-medium">No analyses yet</p>
                  <p className="text-xs mt-1" style={{ color: '#7B9AD0' }}>
                    Run your first analysis to see it here.
                  </p>
                </div>
              ) : (
                history.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 rounded-xl px-4 cursor-pointer transition-all"
                    style={{ color: '#F5F7FF' }}
                    onClick={() => { loadHistoryRecord(item.id); onNavigate('improved'); }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(37,93,206,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                        <Badge variant="navy" size="sm">{item.targetTone}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#7B9AD0' }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#255DCE]" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{item.metrics.wordCount} words</span>
                        <span>•</span>
                        <span style={{ color: '#93b4fd' }} className="font-medium">
                          Flesch: {item.metrics.fleschScore}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.issues.length > 0 ? (
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                          style={{
                            background: 'rgba(222,17,16,0.15)',
                            color: '#ff7b7b',
                            border: '1px solid rgba(222,17,16,0.40)',
                          }}
                        >
                          {item.issues.length} Issues
                        </span>
                      ) : (
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                          style={{
                            background: 'rgba(37,93,206,0.15)',
                            color: '#93b4fd',
                            border: '1px solid rgba(37,93,206,0.35)',
                          }}
                        >
                          Clean
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4" style={{ color: '#7B9AD0' }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right col: Presets + Architecture */}
        <div className="space-y-6">
          {/* Presets card */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: '#071B50',
              border: '1px solid rgba(79,130,255,0.22)',
              boxShadow: '0 2px 16px rgba(4,18,63,0.40)',
            }}
          >
            <div
              className="flex items-center gap-2 pb-3 mb-3"
              style={{ borderBottom: '1px solid rgba(37,93,206,0.22)' }}
            >
              <BookOpen className="w-4 h-4 text-[#255DCE]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Instant Viva Samples
              </h3>
            </div>
            <p className="text-xs mb-3" style={{ color: '#7B9AD0' }}>
              Click any sample to load test text into the analyzer:
            </p>

            <div className="space-y-2">
              {SAMPLE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className="p-3 rounded-xl cursor-pointer group transition-all"
                  style={{
                    background: 'rgba(10,36,95,0.50)',
                    border: '1px solid rgba(79,130,255,0.20)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(37,93,206,0.18)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,93,206,0.50)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(10,36,95,0.50)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,130,255,0.20)';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                    <Badge variant="blue" size="sm">{preset.tone}</Badge>
                  </div>
                  <p className="mt-1 text-xs line-clamp-2" style={{ color: '#7B9AD0' }}>
                    {preset.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture box */}
          <div
            className="p-5 rounded-2xl text-white"
            style={{
              background: 'linear-gradient(135deg, #010e3b 0%, #021861 100%)',
              border: '1px solid rgba(37,93,206,0.40)',
              boxShadow: '0 0 24px rgba(37,93,206,0.15)',
            }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7B9AD0' }}>
              System Architecture Note
            </h4>
            <div className="space-y-2.5 text-xs leading-relaxed" style={{ color: '#B8C8F5' }}>
              <p>
                <strong className="text-white">Mathematical Engine:</strong> Flesch Reading Ease:
                <br />
                <code
                  className="inline-block mt-1 text-xs px-2 py-1 rounded font-mono"
                  style={{
                    background: 'rgba(37,93,206,0.20)',
                    border: '1px solid rgba(37,93,206,0.40)',
                    color: '#93b4fd',
                  }}
                >
                  206.835 - 1.015(ASL) - 84.6(ASW)
                </code>
              </p>
              <p>
                <strong className="text-white">Grammar Engine:</strong> LanguageTool HTTP API{' '}
                <span style={{ color: '#7B9AD0' }}>`/v2/check`</span> with rule match offsets.
              </p>
              <p>
                <strong className="text-white">AI Tone Engine:</strong> Groq Cloud API (Qwen 3) for
                tone diagnosis and stylistic rewriting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
