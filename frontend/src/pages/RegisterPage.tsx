import React, { useState } from 'react';
import { Sparkles, User, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

interface RegisterPageProps {
  onNavigateToLogin: () => void;
}

const inputStyle = {
  background: 'rgba(10,36,95,0.60)',
  border: '1px solid rgba(37,93,206,0.35)',
  color: '#F5F7FF',
};

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateToLogin }) => {
  const { register, loading } = useAuth();
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                 = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill out all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both entries.');
      return;
    }
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'transparent' }}>
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-4"
          style={{
            background: 'linear-gradient(135deg, #021861, #255DCE)',
            boxShadow: '0 0 32px rgba(37,93,206,0.55)',
          }}
        >
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Create an Account</h2>
        <p className="mt-1.5 text-sm" style={{ color: '#7B9AD0' }}>
          Access the Grammar, Readability & Tone Optimization Suite
        </p>
      </div>

      {/* Form card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div
          className="p-6 sm:p-8 rounded-2xl"
          style={{
            background: '#071B50',
            border: '1px solid rgba(37,93,206,0.40)',
            boxShadow: '0 0 48px rgba(37,93,206,0.18)',
          }}
        >
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
            {[
              { label: 'Full Name',         icon: User, value: name,            set: setName,            type: 'text',     ph: 'e.g. Jane Doe' },
              { label: 'Email Address',     icon: Mail, value: email,           set: setEmail,           type: 'email',    ph: 'name@university.edu' },
              { label: 'Password',          icon: Lock, value: password,        set: setPassword,        type: 'password', ph: 'At least 6 characters' },
              { label: 'Confirm Password',  icon: Lock, value: confirmPassword, set: setConfirmPassword, type: 'password', ph: 'Re-enter password' },
            ].map(({ label, icon: Icon, value, set, type, ph }) => (
              <div key={label}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#B8C8F5' }}>
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: '#7B9AD0' }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                    style={inputStyle}
                    placeholder={ph}
                    required
                    onFocus={(e) => (e.target.style.borderColor = '#255DCE')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(37,93,206,0.35)')}
                  />
                </div>
              </div>
            ))}

            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-3"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div
            className="mt-6 pt-5 text-center"
            style={{ borderTop: '1px solid rgba(37,93,206,0.25)' }}
          >
            <p className="text-xs" style={{ color: '#7B9AD0' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-semibold text-[#255DCE] hover:text-[#93b4fd] cursor-pointer transition-colors"
              >
                Sign in to your account
              </button>
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: '#7B9AD0' }}>
          <GraduationCap className="w-3.5 h-3.5 text-[#255DCE]" />
          <span>Department of Computer Science & Engineering</span>
        </div>
      </div>
    </div>
  );
};
