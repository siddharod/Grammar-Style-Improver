import React, { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

interface LoginPageProps {
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToRegister }) => {
  const { login, demoLogin, loading } = useAuth();
  const [email, setEmail]       = useState('alex.morgan@university.edu');
  const [password, setPassword] = useState('Password123!');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      await login(email, password, rememberMe);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Logo + Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-lg mb-4"
          style={{
            background: 'linear-gradient(135deg, #021861, #255DCE)',
            boxShadow: '0 0 32px rgba(37,93,206,0.55)',
          }}
        >
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Sign In to Grammar & Style Improver
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: '#7B9AD0' }}>
          College Engineering Project · Readability, Grammar & Tone Engine
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div
          className="p-6 sm:p-8 rounded-2xl"
          style={{
            background: '#071B50',
            border: '1px solid rgba(37,93,206,0.40)',
            boxShadow: '0 0 48px rgba(37,93,206,0.18)',
          }}
        >
          {/* Viva banner */}
          <div
            className="mb-6 p-3.5 rounded-xl flex items-start gap-3"
            style={{
              background: 'rgba(37,93,206,0.12)',
              border: '1px solid rgba(37,93,206,0.35)',
            }}
          >
            <GraduationCap className="w-5 h-5 text-[#255DCE] shrink-0 mt-0.5" />
            <div className="text-xs text-[#B8C8F5]">
              <span className="font-bold block text-white">Examiner / Viva Demonstration:</span>
              <span>Use the pre-filled demo account or click below for instant access.</span>
              <button
                type="button"
                onClick={demoLogin}
                className="mt-2 block font-semibold text-[#255DCE] hover:text-[#93b4fd] underline cursor-pointer text-xs transition-colors"
              >
                ⚡ Instant 1-Click Demo Login →
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 p-3 rounded-xl flex items-center gap-2 text-xs"
              style={{
                background: 'rgba(222,17,16,0.12)',
                border: '1px solid rgba(222,17,16,0.40)',
                color: '#ff7b7b',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE1110] shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#B8C8F5' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#7B9AD0' }}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(10,36,95,0.60)',
                    border: '1px solid rgba(37,93,206,0.35)',
                    color: '#F5F7FF',
                  }}
                  placeholder="student@university.edu"
                  required
                  onFocus={(e) => (e.target.style.borderColor = '#255DCE')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(37,93,206,0.35)')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#B8C8F5' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#7B9AD0' }}>
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(10,36,95,0.60)',
                    border: '1px solid rgba(37,93,206,0.35)',
                    color: '#F5F7FF',
                  }}
                  placeholder="••••••••"
                  required
                  onFocus={(e) => (e.target.style.borderColor = '#255DCE')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(37,93,206,0.35)')}
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none" style={{ color: '#B8C8F5' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer accent-[#255DCE]"
                  style={{ borderColor: 'rgba(37,93,206,0.50)' }}
                />
                Remember me for 30 days
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert('For the project viva, use the pre-configured credentials.'); }}
                className="text-[#255DCE] hover:text-[#93b4fd] font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div
            className="mt-6 pt-5 text-center"
            style={{ borderTop: '1px solid rgba(37,93,206,0.25)' }}
          >
            <p className="text-xs" style={{ color: '#7B9AD0' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="font-semibold text-[#255DCE] hover:text-[#93b4fd] cursor-pointer transition-colors"
              >
                Create a new account
              </button>
            </p>
          </div>
        </div>

        {/* Security notes */}
        <div className="mt-5 flex items-center justify-center gap-4 text-xs" style={{ color: '#7B9AD0' }}>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#255DCE]" /> Werkzeug Password Hashing
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#255DCE]" /> Flask Session Auth
          </span>
        </div>
      </div>
    </div>
  );
};
