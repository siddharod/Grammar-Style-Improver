import React from 'react';
import {
  LayoutDashboard,
  FileEdit,
  CheckCheck,
  Gauge,
  Sparkles,
  Lightbulb,
  History,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAnalysis } from '../../context/AnalysisContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const { currentAnalysis } = useAnalysis();

  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',           icon: LayoutDashboard },
    { id: 'analyzer',     label: 'Text Analyzer',        icon: FileEdit },
    {
      id: 'grammar',
      label: 'Grammar Analysis',
      icon: CheckCheck,
      badge: currentAnalysis.issues.length > 0 ? `${currentAnalysis.issues.length}` : undefined,
      badgeColor: 'bg-[#DE1110] text-white font-bold text-xs px-1.5 py-0.5 rounded-full shadow-sm',
    },
    { id: 'readability',  label: 'Readability & Tone',   icon: Gauge },
    { id: 'improved',     label: 'Improved Text',         icon: Sparkles },
    {
      id: 'suggestions',
      label: 'Writing Suggestions',
      icon: Lightbulb,
      badge: currentAnalysis.suggestions.length > 0 ? `${currentAnalysis.suggestions.length}` : undefined,
      badgeColor: 'bg-[#255DCE]/30 text-[#93b4fd] border border-[rgba(37,93,206,0.5)] font-bold text-xs px-1.5 py-0.5 rounded-full',
    },
    { id: 'history',      label: 'Analysis History',     icon: History },
    { id: 'settings',     label: 'Settings & Account',   icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#04123F]/75 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #021861 0%, #010e3b 100%)',
          borderRight: '1px solid rgba(37, 93, 206, 0.30)',
          boxShadow: '4px 0 32px rgba(37, 93, 206, 0.12)',
        }}
      >
        {/* ── Brand header ── */}
        <div
          className="p-5 flex items-center gap-3"
          style={{ borderBottom: '1px solid rgba(37,93,206,0.25)' }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white shrink-0"
            style={{
              background: 'linear-gradient(135deg, #255DCE, #1a44a8)',
              boxShadow: '0 0 16px rgba(37,93,206,0.55)',
            }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
              Grammar & Style
            </h1>
            <p className="text-xs font-semibold" style={{ color: '#7B9AD0' }}>
              AI Writing Improver
            </p>
          </div>
        </div>

        {/* ── University badge ── */}
        <div
          className="mx-3 my-2.5 px-4 py-2.5 rounded-xl flex items-center gap-2"
          style={{
            background: 'rgba(37,93,206,0.10)',
            border: '1px solid rgba(37,93,206,0.28)',
          }}
        >
          <GraduationCap className="w-4 h-4 shrink-0" style={{ color: '#7B9AD0' }} />
          <div className="text-xs text-white">
            <span className="font-bold block text-white">University Project Viva</span>
            <span style={{ color: '#7B9AD0' }} className="font-medium text-xs">
              Full-Stack Architecture Demo
            </span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer relative overflow-hidden"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(90deg, #255DCE 0%, #1a44a8 100%)',
                        color: '#ffffff',
                        boxShadow: '0 0 18px rgba(37,93,206,0.45)',
                        borderLeft: '3px solid rgba(255,255,255,0.7)',
                      }
                    : {
                        color: '#B8C8F5',
                        background: 'transparent',
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(37,93,206,0.18)';
                    (e.currentTarget as HTMLElement).style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#B8C8F5';
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="w-4 h-4 transition-colors shrink-0"
                    style={{ color: isActive ? '#ffffff' : '#7B9AD0' }}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={item.badgeColor}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── User profile footer ── */}
        <div
          className="p-3"
          style={{ borderTop: '1px solid rgba(37,93,206,0.25)' }}
        >
          <div
            className="flex items-center justify-between p-2.5 rounded-xl"
            style={{
              background: 'rgba(7,27,80,0.70)',
              border: '1px solid rgba(37,93,206,0.28)',
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg text-white font-bold text-xs shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #255DCE, #1a44a8)',
                  boxShadow: '0 0 10px rgba(37,93,206,0.40)',
                }}
              >
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-xs truncate" style={{ color: '#7B9AD0', fontSize: '0.62rem' }}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg transition-colors cursor-pointer"
              style={{ color: '#7B9AD0' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(222,17,16,0.20)';
                (e.currentTarget as HTMLElement).style.color = '#DE1110';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#7B9AD0';
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
