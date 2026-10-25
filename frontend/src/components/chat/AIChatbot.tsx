import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

const STARTER_PROMPTS = [
  'Explain the difference between active and passive voice.',
  'How do I calculate and interpret Flesch Reading Ease?',
  'Give me tips to make my writing more concise and direct.',
  'When should I use a semicolon versus a colon?',
];

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your AI Writing Assistant. I can help answer grammar & punctuation questions, explain readability indexes, recommend tone refinements, and suggest sentence rewrites. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<{
    available: boolean;
    model?: string;
  } | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Poll or check status when opened
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await api.getChatStatus();
        if (isMounted) {
          setServiceStatus({
            available: res.available,
            model: res.model,
          });
        }
      } catch (err) {
        if (isMounted) {
          setServiceStatus({ available: false });
        }
      }
    };

    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);
    setLastFailedMessage(null);

    try {
      // Build conversation history for API
      const conversationHistory = messages
        .filter((m) => !m.error && m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      conversationHistory.push({
        role: 'user',
        content: text,
      });

      const response = await api.sendChatMessage(conversationHistory);

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setLastFailedMessage(text);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          err.message ||
          'Sorry, I encountered an issue contacting the AI assistant. Please check your Groq API connection or try again.',
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Conversation reset. Ask me anything about grammar rules, tone optimization, or sentence rewrites!',
        timestamp: new Date(),
      },
    ]);
    setLastFailedMessage(null);
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open AI Writing Assistant"
          title="Open AI Writing Assistant"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#255DCE] to-[#021861] text-white shadow-xl shadow-[#255DCE]/40 electric-glow-btn transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#255DCE]/40 cursor-pointer border border-[rgba(79,130,255,0.4)]"
        >
          {isOpen ? (
            <ChevronDown className="w-6 h-6 transition-transform group-hover:rotate-180" />
          ) : (
            <span className="text-2xl select-none" role="img" aria-label="Robot">
              🤖
            </span>
          )}

          {/* Pulse notification dot */}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#255DCE] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#04123F]"></span>
            </span>
          )}
        </button>
      </div>

      {/* Floating Chatbot Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Writing Assistant Window"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100vh-7.5rem)] bg-[#071B50] rounded-2xl shadow-2xl border border-[rgba(79,130,255,0.35)] flex flex-col overflow-hidden electric-glow-lg transition-all animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#021861] via-[#0A245F] to-[#102F91] text-white px-4 py-3.5 flex items-center justify-between border-b border-[rgba(79,130,255,0.25)] shadow-sm shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#255DCE] text-white text-base shadow-sm electric-glow-btn">
                <span>🤖</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white tracking-tight">
                    AI Writing Assistant
                  </h3>
                  {serviceStatus && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold ${
                        serviceStatus.available
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-[#DE1110]/20 text-rose-300 border border-[#DE1110]/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          serviceStatus.available ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-[#DE1110]'
                        }`}
                      />
                      {serviceStatus.available ? 'Groq Active' : 'Offline'}
                    </span>
                  )}
                </div>
                <p className="text-3xs text-[#93b4fd]">
                  Real-time grammar, style & rewriting support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 text-[#B8C8F5] hover:text-white hover:bg-[#102F91]/50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat window"
                className="p-1.5 text-[#B8C8F5] hover:text-white hover:bg-[#102F91]/50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#04123F]/80">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-[#255DCE] to-[#1d4bb0] text-white rounded-tr-xs shadow-md shadow-[#255DCE]/20 font-medium'
                        : msg.error
                        ? 'bg-[#2a0808]/80 text-[#fca5a5] border border-[#DE1110]/40 rounded-tl-xs shadow-sm'
                        : 'bg-[#0A245F] text-[#F5F7FF] border border-[rgba(79,130,255,0.25)] rounded-tl-xs shadow-sm'
                    }`}
                  >
                    {msg.error && (
                      <div className="flex items-center gap-1.5 mb-1 font-bold text-2xs text-[#DE1110]">
                        <AlertCircle className="w-3.5 h-3.5 text-[#DE1110]" />
                        <span>Generation Error</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  </div>
                  <span className="text-3xs text-[#7B9AD0] mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-[#0A245F] border border-[rgba(79,130,255,0.25)] rounded-2xl rounded-tl-xs px-3.5 py-2.5 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-[#255DCE] animate-spin" />
                  <span className="text-xs text-[#B8C8F5] font-medium">Assistant is thinking...</span>
                </div>
              </div>
            )}

            {/* Retry Button if last request failed */}
            {lastFailedMessage && !isLoading && (
              <div className="flex justify-center pt-1">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a0808] border border-[#DE1110]/50 text-[#fca5a5] text-2xs font-semibold hover:bg-[#DE1110] hover:text-white shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry Failed Message
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Suggestions (Shown when conversation is fresh) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3.5 py-2 bg-[#071B50] border-t border-[rgba(79,130,255,0.2)] shrink-0">
              <span className="text-3xs font-bold text-[#7B9AD0] uppercase tracking-wider block mb-1.5">
                Suggested questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-2xs px-2.5 py-1 rounded-lg bg-[#0A245F] hover:bg-[#102F91] text-[#B8C8F5] hover:text-white border border-[rgba(79,130,255,0.25)] font-medium transition-colors cursor-pointer text-left truncate max-w-full"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-[#071B50] border-t border-[rgba(79,130,255,0.25)] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a grammar question or request a rewrite... (Enter to send)"
                rows={2}
                disabled={isLoading}
                className="flex-1 p-2.5 text-xs bg-[#0A245F] border border-[rgba(79,130,255,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255DCE]/50 focus:border-[#255DCE] text-white resize-none placeholder:text-[#7B9AD0]/60 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                title="Send message"
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#255DCE] to-[#102F91] text-white hover:from-[#1d4bb0] hover:to-[#0a2782] disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#255DCE]/30 transition-all shrink-0 cursor-pointer electric-glow-btn"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            <div className="flex items-center justify-between mt-1.5 px-1 text-3xs text-[#7B9AD0]">
              <span>Shift + Enter for new line</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#255DCE]" /> Groq AI Engine
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
