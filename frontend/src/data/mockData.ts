import type { AnalysisRecord, ToneType, User } from '../types';

export const DEMO_USER: User = {
  id: 'usr_demo_101',
  name: 'Alex Morgan',
  email: 'alex.morgan@university.edu',
  role: 'Engineering Student',
  joinedDate: 'Oct 2026',
  analysesCount: 14,
};

export interface SamplePreset {
  id: string;
  name: string;
  category: string;
  tone: ToneType;
  description: string;
  text: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'academic',
    name: 'Academic Research Abstract',
    category: 'University Research',
    tone: 'Academic',
    description: 'Contains passive voice constructions, complex vocabulary, and a sentence fragment.',
    text: `The experimental methodology was executed in order to ascertain the parameters of neural convergence. Due to the fact that multiple iterations were not thoroughly documented by the researchers. It can be observed that statistical anomalies were noticed in preliminary trials. Consequently, further investigations are imperatively required to substantiate these assertions.`
  },
  {
    id: 'business',
    name: 'Executive Business Memo',
    category: 'Corporate Memo',
    tone: 'Professional',
    description: 'Contains corporate buzzwords, spelling errors, and wordy phrasing.',
    text: `We are writing this memo to touch base regarding our Q4 deliverables. At this point in time, our team beleives we need to synergize cross-functional bandwidth. Their are several bottleneck situations occurring in the pipeline, which effects our overall turnaround velocity. Please revert back with your feedback ASAP.`
  },
  {
    id: 'informal',
    name: 'Informal Blog Draft',
    category: 'Creative & Web',
    tone: 'Casual',
    description: 'Casual phrasing, colloquial contractions, and punctuation quirks.',
    text: `Hey guys, so I wanted to share some thoughts on how modern AI tools can totally change how we write stuff every day. Honestly its pretty crazy how fast things are moving. You should definitely check it out because it literally saves you tons of hours every single week!`
  },
  {
    id: 'convoluted',
    name: 'Bureaucratic Proposal',
    category: 'Policy & Grants',
    tone: 'Concise',
    description: 'Dense sentence structures with a very low Flesch Reading Ease score.',
    text: `Notwithstanding the previously articulated budgetary constraints, the committee has arrived at the determination that the facilitation of technological modernization initiatives shall be prioritized across all operational domains, with the explicit caveat that compliance mandates remain rigorously enforced.`
  }
];

export const INITIAL_ANALYSIS_DATA: AnalysisRecord = {
  id: 'anl_demo_882',
  userId: 'usr_demo_101',
  title: 'Executive Business Memo Analysis',
  originalText: `We are writing this memo to touch base regarding our Q4 deliverables. At this point in time, our team beleives we need to synergize cross-functional bandwidth. Their are several bottleneck situations occurring in the pipeline, which effects our overall turnaround velocity. Please revert back with your feedback ASAP.`,
  improvedText: `We are writing to provide an update on our Q4 deliverables. Currently, our team recommends coordinating cross-functional resources. Several bottlenecks in the pipeline are affecting our turnaround time. Please share your feedback at your earliest convenience.`,
  targetTone: 'Professional',
  providerUsed: 'Gemini (Primary)',
  createdAt: '2026-10-11T16:15:00Z',
  metrics: {
    fleschScore: 54.2,
    fleschCategory: 'Fairly Difficult',
    gradeLevel: '10th to 12th Grade',
    readingTimeMinutes: 0.3,
    wordCount: 46,
    characterCount: 308,
    sentenceCount: 4,
    averageSentenceLength: 11.5,
    averageSyllablesPerWord: 1.65,
    complexWordPercentage: 21.7,
  },
  issues: [
    {
      id: 'iss_1',
      category: 'Spelling',
      message: 'Possible spelling mistake found for "beleives".',
      originalText: 'beleives',
      replacements: ['believes'],
      offset: 96,
      length: 8,
      ruleId: 'MORFOLOGIK_RULE_EN_US'
    },
    {
      id: 'iss_2',
      category: 'Grammar',
      message: 'Did you mean the possessive or demonstrative "There are" instead of "Their are"?',
      originalText: 'Their are',
      replacements: ['There are'],
      offset: 147,
      length: 9,
      ruleId: 'THEIR_THERE'
    },
    {
      id: 'iss_3',
      category: 'Grammar',
      message: 'Incorrect verb choice: use "affects" (verb) instead of "effects" (noun).',
      originalText: 'effects',
      replacements: ['affects'],
      offset: 211,
      length: 7,
      ruleId: 'AFFECT_EFFECT'
    },
    {
      id: 'iss_4',
      category: 'Style & Clarity',
      message: 'Redundant phrasing: "revert back" contains repetition.',
      originalText: 'revert back',
      replacements: ['reply', 'respond', 'share your thoughts'],
      offset: 256,
      length: 11,
      ruleId: 'REDUNDANCY'
    }
  ],
  detectedTones: [
    {
      tone: 'Corporate & Formal',
      percentage: 65,
      description: 'Uses professional greetings, corporate terminology, and standard business memo pacing.',
      color: 'blue'
    },
    {
      tone: 'Hesitant / Wordy',
      percentage: 22,
      description: 'Contains qualifying filler words like "at this point in time" and "touch base".',
      color: 'lavender'
    },
    {
      tone: 'Urgent',
      percentage: 13,
      description: 'Closing call to action "ASAP" introduces a hurried tone.',
      color: 'pink'
    }
  ],
  suggestions: [
    {
      id: 'sug_1',
      category: 'Conciseness',
      title: 'Eliminate Wordy Filler Phrases',
      explanation: 'Replacing "At this point in time" with "Currently" reduces cognitive load and sharpens focus.',
      before: 'At this point in time, our team believes...',
      after: 'Currently, our team believes...',
      severity: 'medium'
    },
    {
      id: 'sug_2',
      category: 'Clarity',
      title: 'Replace Corporate Jargon',
      explanation: '"Synergize cross-functional bandwidth" sounds unnecessarily complex. "Coordinate cross-functional resources" is clearer for team alignment.',
      before: 'synergize cross-functional bandwidth',
      after: 'coordinate cross-functional resources',
      severity: 'high'
    },
    {
      id: 'sug_3',
      category: 'Active Voice',
      title: 'Simplify Problem Framing',
      explanation: 'Directly identifying pipeline bottlenecks without nominalizing "bottleneck situations" makes the report more authoritative.',
      before: 'bottleneck situations occurring in the pipeline',
      after: 'bottlenecks in the pipeline',
      severity: 'low'
    },
    {
      id: 'sug_4',
      category: 'Vocabulary',
      title: 'Elevate Closing Etiquette',
      explanation: 'Replacing informal abbreviation "ASAP" with "at your earliest convenience" maintains executive polish.',
      before: 'Please revert back with your feedback ASAP.',
      after: 'Please share your feedback at your earliest convenience.',
      severity: 'medium'
    }
  ]
};

export const MOCK_HISTORY: AnalysisRecord[] = [
  INITIAL_ANALYSIS_DATA,
  {
    id: 'anl_demo_881',
    userId: 'usr_demo_101',
    title: 'Distributed Systems Project Abstract',
    originalText: `The protocol was evaluated across twelve geo-distributed server instances. Latency distributions were measured rigorously.`,
    improvedText: `We evaluated the protocol across twelve geographically distributed servers, measuring latency distribution across various network conditions.`,
    targetTone: 'Academic',
    providerUsed: 'Gemini (Primary)',
    createdAt: '2026-10-10T14:22:00Z',
    metrics: {
      fleschScore: 68.4,
      fleschCategory: 'Standard',
      gradeLevel: '8th to 9th Grade',
      readingTimeMinutes: 0.2,
      wordCount: 18,
      characterCount: 132,
      sentenceCount: 2,
      averageSentenceLength: 9.0,
      averageSyllablesPerWord: 1.55,
      complexWordPercentage: 16.6,
    },
    issues: [],
    detectedTones: [
      { tone: 'Academic', percentage: 88, description: 'Objective, passive voice, scholarly vocabulary.', color: 'lavender' },
      { tone: 'Analytical', percentage: 12, description: 'Direct data-driven metrics presentation.', color: 'blue' }
    ],
    suggestions: [
      {
        id: 'sug_h1',
        category: 'Active Voice',
        title: 'Use Active Voice in Methodology',
        explanation: 'Transitioning from passive to active voice increases readability for peer reviewers.',
        before: 'The protocol was evaluated...',
        after: 'We evaluated the protocol...',
        severity: 'low'
      }
    ]
  },
  {
    id: 'anl_demo_880',
    userId: 'usr_demo_101',
    title: 'Customer Onboarding Welcome Email',
    originalText: `Hey user! Welcome to our tool. Hope you find it useful. Do let us know if something breaks.`,
    improvedText: `Welcome to Grammar & Style Improver! We're thrilled to have you onboard. If you ever have questions or need assistance, our support team is always here to help.`,
    targetTone: 'Casual',
    providerUsed: 'Groq (Fallback)',
    createdAt: '2026-10-08T09:40:00Z',
    metrics: {
      fleschScore: 82.1,
      fleschCategory: 'Easy',
      gradeLevel: '6th Grade',
      readingTimeMinutes: 0.1,
      wordCount: 17,
      characterCount: 94,
      sentenceCount: 4,
      averageSentenceLength: 4.25,
      averageSyllablesPerWord: 1.25,
      complexWordPercentage: 5.8,
    },
    issues: [
      {
        id: 'iss_h2',
        category: 'Style & Clarity',
        title: 'Negative Framing',
        message: 'Avoid negative priming such as "if something breaks" in onboarding messages.',
        originalText: 'if something breaks',
        replacements: ['if you have questions', 'if you need assistance'],
        offset: 65,
        length: 19
      }
    ],
    detectedTones: [
      { tone: 'Casual & Friendly', percentage: 70, description: 'Approachable, warm tone with simple sentences.', color: 'mint' },
      { tone: 'Informal', percentage: 30, description: 'Conversational greetings.', color: 'pink' }
    ],
    suggestions: []
  }
];
