import React from 'react';
import { Menu, Plus, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

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
    dashboard: {
      title: 'Project Dashboard',
      subtitle: 'Overview of writing metrics, recent analyses, and system health',
    },
    analyzer: {
      title: 'Text Analyzer Studio',
      subtitle: 'Input text, inspect metrics in real time, and trigger comprehensive AI optimization',
    },
    grammar: {
      title: 'Grammar & Spell Check',
      subtitle: 'LanguageTool rule verification, category tagging, and one-click corrections',
    },
    readability: {
      title: 'Readability & Tone Metrics',
      subtitle: 'Flesch Reading Ease calculations and multi-dimensional AI tone classification',
    },
    improved: {
      title: 'Improved Text & Style Comparison',
      subtitle: 'Side-by-side comparison with word-level difference highlighting',
    },
    suggestions: {
      title: 'Writing Suggestions & Recommendations',
      subtitle: 'Categorized clarity, active voice, and conciseness enhancements',
    },
    history: {
      title: 'Analysis History',
      subtitle: 'Archived records belonging to the current user with search and export capabilities',
    },
    settings: {
      title: 'Settings & System Diagnostics',
      subtitle: 'User account details, session security, and API provider credentials',
    },
  };

  const currentInfo = pageTitles[currentTab] || {
    title: 'Text Optimizer',
    subtitle: 'Readability, grammar, and tone engine',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {currentInfo.title}
          </h2>
          <p className="hidden sm:block text-2xs text-slate-500">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status Pills & Action Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2">
          <Badge variant="mint" size="sm" icon={<Activity className="w-3 h-3 text-emerald-600" />}>
            Ready for Analysis
          </Badge>
          <Badge variant="blue" size="sm" icon={<ShieldCheck className="w-3 h-3 text-blue-600" />}>
            Session Protected
          </Badge>
        </div>

        {currentTab !== 'analyzer' && (
          <Button
            variant="primary"
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
