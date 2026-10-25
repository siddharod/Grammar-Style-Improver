import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalysisProvider, useAnalysis } from './context/AnalysisContext';
import { ToastProvider } from './components/common/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TextAnalyzerPage } from './pages/TextAnalyzerPage';
import { GrammarAnalysisPage } from './pages/GrammarAnalysisPage';
import { ReadabilityTonePage } from './pages/ReadabilityTonePage';
import { ImprovedTextPage } from './pages/ImprovedTextPage';
import { WritingSuggestionsPage } from './pages/WritingSuggestionsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const MainContent: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const { activeTab, setActiveTab } = useAnalysis();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#04123F] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#255DCE] to-[#021861] text-white shadow-xl shadow-[#255DCE]/40 electric-glow-btn animate-pulse border border-[rgba(79,130,255,0.4)]">
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-sm font-semibold text-[#B8C8F5] tracking-wide">Connecting to Grammar Optimizer Service...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterPage onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateToRegister={() => setAuthView('register')} />;
  }

  return (
    <AppLayout currentTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
      {activeTab === 'analyzer' && (
        <TextAnalyzerPage onNavigateToResults={(tab) => setActiveTab(tab)} />
      )}
      {activeTab === 'grammar' && (
        <GrammarAnalysisPage
          onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          onNavigateToImproved={() => setActiveTab('improved')}
        />
      )}
      {activeTab === 'readability' && (
        <ReadabilityTonePage onNavigateToImproved={() => setActiveTab('improved')} />
      )}
      {activeTab === 'improved' && (
        <ImprovedTextPage
          onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          onNavigateToSuggestions={() => setActiveTab('suggestions')}
        />
      )}
      {activeTab === 'suggestions' && (
        <WritingSuggestionsPage
          onNavigateToImproved={() => setActiveTab('improved')}
          onNavigateToHistory={() => setActiveTab('history')}
        />
      )}
      {activeTab === 'history' && (
        <HistoryPage
          onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          onNavigateToImproved={() => setActiveTab('improved')}
        />
      )}
      {activeTab === 'settings' && <SettingsPage />}
    </AppLayout>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AnalysisProvider>
        <ToastProvider>
          <MainContent />
        </ToastProvider>
      </AnalysisProvider>
    </AuthProvider>
  );
}

export default App;
