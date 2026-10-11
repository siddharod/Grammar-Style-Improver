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
  const { isAuthenticated } = useAuth();
  const { activeTab, setActiveTab } = useAnalysis();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

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
