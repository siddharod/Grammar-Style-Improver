export type ToneType = 'Academic' | 'Professional' | 'Casual' | 'Persuasive' | 'Concise';

export type GrammarCategory = 'Spelling' | 'Grammar' | 'Punctuation' | 'Style & Clarity';

export interface GrammarIssue {
  id: string;
  title?: string;
  category: GrammarCategory;
  message: string;
  originalText: string;
  replacements: string[];
  offset: number;
  length: number;
  ruleId?: string;
}

export interface ReadabilityMetrics {
  fleschScore: number;
  fleschCategory: string;
  gradeLevel: string;
  readingTimeMinutes: number;
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  averageSyllablesPerWord: number;
  complexWordPercentage: number;
  isMeaningful?: boolean;
  sampleSizeNotice?: string;
}

export interface ToneMetric {
  tone: string;
  percentage: number;
  description: string;
  color: 'lavender' | 'blue' | 'pink' | 'mint' | string;
}

export interface WritingSuggestion {
  id: string;
  category: 'Clarity' | 'Conciseness' | 'Active Voice' | 'Vocabulary';
  title: string;
  explanation: string;
  before: string;
  after: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  title: string;
  originalText: string;
  improvedText: string;
  targetTone: ToneType;
  detectedTones: ToneMetric[];
  metrics: ReadabilityMetrics;
  issues: GrammarIssue[];
  suggestions: WritingSuggestion[];
  providerUsed: string;
  moduleStatus?: Record<string, any>;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinedDate: string;
  analysesCount: number;
}
