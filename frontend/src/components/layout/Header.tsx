import React from 'react';
import { Menu, Plus, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  currentTab: string;
  onOpenMobileMenu: () => void;
  onNewAnalysis: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onNewAnalysis,
}) => {
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard:   { title: 'Project Dashboard',                    subtitle: 'Overview of writing metrics, recent analyses, and system health' },
    analyzer:    { title: 'Text Analyzer Studio',                 subtitle: 'Input text, inspect metrics in real time, and trigger comprehensive AI optimization' },
    grammar:     { title: 'Grammar & Spell Check',               subtitle: 'LanguageTool rule verification, category tagging, and one-click corrections' },
    readability: { title: 'Readability & Tone Metrics',           subtitle: 'Flesch Reading Ease calculations and multi-dimensional AI tone classification' },
    improved:    { title: 'Improved Text & Style Comparison',     subtitle: 'Side-by-side comparison with word-level difference highlighting' },
    suggestions: { title: 'Writing Suggestions & Recommendations',subtitle: 'Categorized clarity, active voice, and conciseness enhancements' },
    history:     { title: 'Analysis History',                     subtitle: 'Archived records belonging to the current user with search and export capabilities' },
    settings:    { title: 'Settings & System Diagnostics',        subtitle: 'User account details, session security, and API provider credentials' },
  };

  const currentInfo = pageTitles[currentTab] || {
    title: 'Text Optimizer',
    subtitle: 'Readability, grammar, and tone engine',
  };

  return (
    <header
      className="sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 text-white"
      style={{
        background: 'rgba(2, 24, 97, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(37, 93, 206, 0.30)',
        boxShadow: '0 2px 24px rgba(4, 18, 63, 0.50)',
      }}
    >
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl transition-colors cursor-pointer"
          aria-label="Open sidebar"
          style={{ color: '#B8C8F5' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(37,93,206,0.20)';
            (e.currentTarget as HTMLElement).style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#B8C8F5';
          }}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {currentInfo.title}
          </h2>
          <p className="hidden sm:block text-xs font-medium" style={{ color: '#7B9AD0' }}>
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status Pills & Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(37,93,206,0.15)',
              border: '1px solid rgba(37,93,206,0.40)',
              color: '#93b4fd',
            }}
          >
            <Activity className="w-3 h-3 text-[#255DCE]" />
            <span>Ready for Analysis</span>
          </div>
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(37,93,206,0.10)',
              border: '1px solid rgba(37,93,206,0.30)',
              color: '#B8C8F5',
            }}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Session Protected</span>
          </div>
        </div>

        {currentTab !== 'analyzer' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onNewAnalysis}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Analyze</span> New Text
          </Button>
        )}
      </div>
    </header>
  );
};
