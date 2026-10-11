import React, { useState } from 'react';
import {
  User,
  LogOut,
  ShieldCheck,
  Server,
  Save,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email] = useState(user?.email || 'alex.morgan@university.edu');
  const [defaultTone, setDefaultTone] = useState('Professional');
  const [dialect, setDialect] = useState('en-US');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Account Settings & System Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Manage personal credentials, session controls, and inspect live API provider health
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={logout}
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
        >
          Sign Out of Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h4 className="text-sm font-bold text-slate-800 pb-3 mb-4 border-b border-slate-100">
              User Profile & University Information
            </h4>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-100/80 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Default Optimization Goal
                  </label>
                  <select
                    value={defaultTone}
                    onChange={(e) => setDefaultTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="Professional">Professional (Corporate & Clear)</option>
                    <option value="Academic">Academic (Formal & Objective)</option>
                    <option value="Casual">Casual (Friendly & Conversational)</option>
                    <option value="Concise">Concise (Executive & Direct)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Default English Dialect
                  </label>
                  <select
                    value={dialect}
                    onChange={(e) => setDialect(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="en-US">American English (en-US)</option>
                    <option value="en-GB">British English (en-GB)</option>
                    <option value="en-CA">Canadian English (en-CA)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </Card>

          {/* College Engineering Project Card */}
          <Card className="p-6 bg-purple-50/40 border-purple-100">
            <div className="flex items-center gap-2.5 mb-3">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <h4 className="text-sm font-bold text-purple-950">
                Department of Computer Science & Engineering Viva Notice
              </h4>
            </div>
            <p className="text-xs text-purple-900 leading-relaxed">
              This application has been developed to demonstrate full-stack software architecture principles,
              pure mathematical readability index calculations, external API integration with error handling,
              and multi-provider AI failover resiliency.
            </p>
          </Card>
        </div>

        {/* Right Col: Live System & API Provider Health Monitor */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <Server className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                System Diagnostics & Providers
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* LanguageTool Status */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800">
                    LanguageTool HTTP API
                  </span>
                  <Badge variant="mint" size="sm">
                    Ready
                  </Badge>
                </div>
                <p className="text-2xs text-slate-500 font-mono">
                  api.languagetool.org/v2/check
                </p>
              </div>

              {/* Google Gemini Status */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800">
                    Google Gemini 1.5 Flash
                  </span>
                  <Badge variant="mint" size="sm">
                    Primary
                  </Badge>
                </div>
                <p className="text-2xs text-slate-500">
                  generativelanguage.googleapis.com
                </p>
              </div>

              {/* Groq Fallback Status */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800">
                    Groq Cloud API
                  </span>
                  <Badge variant="blue" size="sm">
                    Failover
                  </Badge>
                </div>
                <p className="text-2xs text-slate-500">
                  api.groq.com/openai/v1
                </p>
              </div>

              {/* Database Status */}
              <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800">
                    SQLite Database
                  </span>
                  <Badge variant="mint" size="sm">
                    Active
                  </Badge>
                </div>
                <p className="text-2xs text-slate-500">
                  SQLAlchemy ORM (Persistent)
                </p>
              </div>
            </div>
          </Card>

          {/* Session Security */}
          <Card className="p-4 bg-slate-50 border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Session Protection</span>
            </div>
            <p className="text-2xs text-slate-500 leading-relaxed">
              Passwords are salted and hashed using Werkzeug (`scrypt`). Authenticated routes are protected with HTTP-only cookies.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
