import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

interface LoginPageProps {
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToRegister }) => {
  const { login, demoLogin, loading } = useAuth();
  const [email, setEmail] = useState('alex.morgan@university.edu');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both your university/work email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    await login(email, password, rememberMe);
  };

  return (
    <div className="min-h-screen bg-[#fafbfd] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* App Logo */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600 text-white shadow-md mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Grammar & Style Improver
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          College Engineering Project • Readability, Grammar & Tone Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="p-6 sm:p-8 shadow-sm border-slate-200/90">
          {/* Viva Evaluation Banner */}
          <div className="mb-6 p-3.5 bg-purple-50/80 rounded-xl border border-purple-200/70 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-900">
              <span className="font-semibold block">Examiner / Viva Demonstration:</span>
              <span>Use the pre-filled demo student account or click below for 1-click evaluation access.</span>
              <button
                type="button"
                onClick={demoLogin}
                className="mt-2 block font-semibold text-purple-700 hover:text-purple-900 underline cursor-pointer text-xs"
              >
                ⚡ Instant 1-Click Demo Login →
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 transition-all text-slate-800"
                  placeholder="student@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 transition-all text-slate-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-400 cursor-pointer accent-purple-600"
                />
                Remember me for 30 days
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For the project viva, you can sign in directly using the pre-configured credentials.'); }} className="text-purple-600 hover:text-purple-700 font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                Create a new account
              </button>
            </p>
          </div>
        </Card>

        {/* Security & Tech notes */}
        <div className="mt-6 flex items-center justify-center gap-4 text-2xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" /> Werkzeug Password Hashing
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Flask Session Authentication
          </span>
        </div>
      </div>
    </div>
  );
};
