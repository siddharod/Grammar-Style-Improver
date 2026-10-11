import React, { createContext, useContext, useState } from 'react';
import type { AnalysisRecord, ToneType } from '../types';
import { INITIAL_ANALYSIS_DATA, MOCK_HISTORY, SAMPLE_PRESETS } from '../data/mockData';

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
  deleteHistoryRecord: (id: string) => void;
  updateOriginalText: (text: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord>(INITIAL_ANALYSIS_DATA);
  const [history, setHistory] = useState<AnalysisRecord[]>(MOCK_HISTORY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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

  const runAnalysis = async (text: string, tone: ToneType, _language: string) => {
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1200)); // UI loading state simulation

    // Local heuristic computation for instant reactive feedback
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length || 1 : 0;
    const asl = sentences > 0 ? words / sentences : 0;
    const approxFlesch = Math.min(100, Math.max(10, Math.round(206.835 - 1.015 * asl - 84.6 * 1.5)));

    let category = 'Standard';
    let grade = '8th to 9th Grade';
    if (approxFlesch >= 80) {
      category = 'Easy';
      grade = '6th Grade';
    } else if (approxFlesch >= 60) {
      category = 'Standard';
      grade = '8th to 9th Grade';
    } else if (approxFlesch >= 40) {
      category = 'Fairly Difficult';
      grade = '10th to 12th Grade';
    } else {
      category = 'Difficult';
      grade = 'College Level';
    }

    // Generated improved text placeholder preview
    const improved = text
      .replace(/beleives/gi, 'believes')
      .replace(/Their are/g, 'There are')
      .replace(/effects/g, 'affects')
      .replace(/revert back/g, 'respond')
      .replace(/touch base/g, 'connect')
      .replace(/ASAP/g, 'at your earliest convenience')
      .replace(/Due to the fact that/g, 'Because')
      .replace(/In order to/g, 'To');

    const newRecord: AnalysisRecord = {
      id: `anl_${Date.now()}`,
      userId: 'usr_demo_101',
      title: `${tone} Text Analysis`,
      originalText: text,
      improvedText: improved,
      targetTone: tone,
      providerUsed: 'Gemini (Primary)',
      createdAt: new Date().toISOString(),
      metrics: {
        fleschScore: approxFlesch,
        fleschCategory: category,
        gradeLevel: grade,
        readingTimeMinutes: Math.max(0.1, Number((words / 200).toFixed(1))),
        wordCount: words,
        characterCount: chars,
        sentenceCount: sentences,
        averageSentenceLength: Number(asl.toFixed(1)),
        averageSyllablesPerWord: 1.52,
        complexWordPercentage: 14.2,
      },
      issues: currentAnalysis.issues,
      detectedTones: [
        { tone: tone, percentage: 72, description: `Primary tone aligned with target style (${tone}).`, color: 'blue' },
        { tone: 'Informative', percentage: 18, description: 'Direct explanatory clarity.', color: 'lavender' },
        { tone: 'Analytical', percentage: 10, description: 'Objective structure and phrasing.', color: 'mint' },
      ],
      suggestions: currentAnalysis.suggestions,
    };

    setCurrentAnalysis(newRecord);
    setHistory((prev) => [newRecord, ...prev]);
    setIsAnalyzing(false);
  };

  const loadHistoryRecord = (id: string) => {
    const record = history.find((h) => h.id === id);
    if (record) {
      setCurrentAnalysis(record);
      setActiveTab('analyzer');
    }
  };

  const deleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
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
