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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Text Analyzer', icon: FileEdit },
    {
      id: 'grammar',
      label: 'Grammar Analysis',
      icon: CheckCheck,
      badge: currentAnalysis.issues.length > 0 ? `${currentAnalysis.issues.length}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    { id: 'readability', label: 'Readability & Tone', icon: Gauge },
    { id: 'improved', label: 'Improved Text', icon: Sparkles },
    {
      id: 'suggestions',
      label: 'Writing Suggestions',
      icon: Lightbulb,
      badge: currentAnalysis.suggestions.length > 0 ? `${currentAnalysis.suggestions.length}` : undefined,
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'settings', label: 'Settings & Account', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-600 text-white shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                Grammar & Style
              </h1>
              <p className="text-2xs font-medium text-purple-600">Tone & Readability</p>
            </div>
          </div>
        </div>

        {/* Viva Engineering Project Badge */}
        <div className="px-4 py-2.5 mx-3 my-2.5 bg-purple-50/80 rounded-xl border border-purple-100/80 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
          <div className="text-2xs text-purple-900">
            <span className="font-semibold block">University Project Viva</span>
            <span className="text-purple-600">Full-Stack Architecture Demo</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-purple-50/90 text-purple-800 shadow-2xs border border-purple-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-2xs font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-2xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
