import type { AnalysisRecord, ToneType, User } from '../types';

const API_BASE = '/api';

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Ensure session cookies are sent and received
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data as T;
  } catch (err: any) {
    if (err.status) throw err;
    throw new Error(err.message || 'Network error connecting to backend service.');
  }
}

export const api = {
  // System Health
  async getHealth(): Promise<any> {
    return request('/health');
  },

  // Authentication
  async register(name: string, email: string, pass: string): Promise<{ user: User }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: pass }),
    });
  },

  async login(email: string, pass: string): Promise<{ user: User }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
  },

  async logout(): Promise<void> {
    return request('/auth/logout', {
      method: 'POST',
    });
  },

  async getMe(): Promise<{ authenticated: boolean; user?: User }> {
    return request('/auth/me');
  },

  // Analysis Engine
  async analyze(text: string, tone: ToneType = 'Professional', language: string = 'en-US'): Promise<{ analysis: AnalysisRecord }> {
    return request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, tone, language }),
    });
  },

  // Analysis History
  async getHistory(): Promise<{ history: AnalysisRecord[] }> {
    return request('/history');
  },

  async getHistoryRecord(id: string | number): Promise<{ analysis: AnalysisRecord }> {
    return request(`/history/${id}`);
  },

  async deleteHistoryRecord(id: string | number): Promise<{ success: boolean; deleted_id: string }> {
    return request(`/history/${id}`, {
      method: 'DELETE',
    });
  },

  // AI Assistant Chatbot
  async getChatStatus(): Promise<{ success: boolean; available: boolean; provider: string; model?: string }> {
    return request('/chat/status');
  },

  async sendChatMessage(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<{ success: boolean; reply: string; model: string }> {
    return request('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  },
};
