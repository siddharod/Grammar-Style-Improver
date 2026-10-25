import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AnalysisRecord, ToneType } from '../types';
import { INITIAL_ANALYSIS_DATA, SAMPLE_PRESETS } from '../data/mockData';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface AnalysisContextType {
  currentAnalysis: AnalysisRecord;
  history: AnalysisRecord[];
  isAnalyzing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  runAnalysis: (text: string, tone: ToneType, language: string) => Promise<void>;
  applyFix: (issueId: string, replacement: string) => void;
  applyAllFixes: () => void;
  loadPreset: (presetId: string) => void;
  loadHistoryRecord: (id: string) => void;
  deleteHistoryRecord: (id: string) => Promise<void>;
  updateOriginalText: (text: string) => void;
  refreshHistory: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord>(INITIAL_ANALYSIS_DATA);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Fetch real persistent analysis history whenever authenticated
  const refreshHistory = async () => {
    if (!isAuthenticated) {
      setHistory([]);
      return;
    }
    try {
      const res = await api.getHistory();
      if (res.history) {
        setHistory(res.history);
      }
    } catch (err) {
      console.warn('Failed to load history from backend:', err);
    }
  };

  useEffect(() => {
    refreshHistory();
  }, [isAuthenticated]);

  const updateOriginalText = (text: string) => {
    setCurrentAnalysis((prev) => {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length || 1 : 0;
      const asl = sentences > 0 ? Number((words / sentences).toFixed(1)) : 0;
      const readingTime = Number((words / 200).toFixed(1));

      return {
        ...prev,
        originalText: text,
        metrics: {
          ...prev.metrics,
          wordCount: words,
          characterCount: chars,
          sentenceCount: sentences,
          averageSentenceLength: asl,
          readingTimeMinutes: Math.max(0.1, readingTime),
        },
      };
    });
  };

  const loadPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    updateOriginalText(preset.text);
    setCurrentAnalysis((prev) => ({
      ...prev,
      targetTone: preset.tone,
      title: `${preset.name} Analysis`,
    }));
  };

  const applyFix = (issueId: string, replacement: string) => {
    const issue = currentAnalysis.issues.find((i) => i.id === issueId);
    if (!issue) return;

    let updatedText = currentAnalysis.originalText;
    if (updatedText.includes(issue.originalText)) {
      updatedText = updatedText.replace(issue.originalText, replacement);
    }

    const remainingIssues = currentAnalysis.issues.filter((i) => i.id !== issueId);
    setCurrentAnalysis((prev) => ({
      ...prev,
      originalText: updatedText,
      issues: remainingIssues,
    }));
  };

  const applyAllFixes = () => {
    let updatedText = currentAnalysis.originalText;
    currentAnalysis.issues.forEach((issue) => {
      if (issue.replacements.length > 0 && updatedText.includes(issue.originalText)) {
        updatedText = updatedText.replace(issue.originalText, issue.replacements[0]);
      }
    });

    setCurrentAnalysis((prev) => ({
      ...prev,
      originalText: updatedText,
      issues: [],
    }));
  };

  const runAnalysis = async (text: string, tone: ToneType, language: string) => {
    setIsAnalyzing(true);
    try {
      const res = await api.analyze(text, tone, language);
      const newRecord = res.analysis;
      setCurrentAnalysis(newRecord);
      setHistory((prev) => [newRecord, ...prev.filter((h) => h.id !== newRecord.id)]);
    } catch (err: any) {
      console.error('Analysis error:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadHistoryRecord = (id: string) => {
    const record = history.find((h) => h.id === id);
    if (record) {
      setCurrentAnalysis(record);
      setActiveTab('analyzer');
    }
  };

  const deleteHistoryRecord = async (id: string) => {
    try {
      await api.deleteHistoryRecord(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error('Delete history error:', err);
      throw err;
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        history,
        isAnalyzing,
        activeTab,
        setActiveTab,
        runAnalysis,
        applyFix,
        applyAllFixes,
        loadPreset,
        loadHistoryRecord,
        deleteHistoryRecord,
        updateOriginalText,
        refreshHistory,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
