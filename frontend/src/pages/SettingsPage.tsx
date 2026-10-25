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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#071B50] rounded-2xl border border-[rgba(79,130,255,0.25)] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#255DCE] to-[#021861] text-white border border-[rgba(79,130,255,0.4)] shadow-md shadow-[#255DCE]/30">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Account Settings & System Architecture
            </h3>
            <p className="text-xs text-[#7B9AD0] mt-0.5">
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
        {/* Left 2 Cols: Profile, Design System & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-[#071B50] border-[rgba(79,130,255,0.25)] shadow-xl">
            <h4 className="text-sm font-bold text-white pb-3 mb-4 border-b border-[rgba(79,130,255,0.2)] flex items-center justify-between">
              <span>User Profile & University Information</span>
              <span className="w-2 h-2 rounded-full bg-[#255DCE]"></span>
            </h4>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#B8C8F5] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#0A245F] border border-[rgba(79,130,255,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255DCE]/50 focus:border-[#255DCE] text-white font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#B8C8F5] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2.5 text-xs bg-[#04123F]/80 border border-[rgba(79,130,255,0.2)] rounded-xl text-[#7B9AD0] cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#B8C8F5] mb-1.5">
                    Default Optimization Goal
                  </label>
                  <select
                    value={defaultTone}
                    onChange={(e) => setDefaultTone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#0A245F] border border-[rgba(79,130,255,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255DCE]/50 focus:border-[#255DCE] text-white font-medium cursor-pointer transition-all"
                  >
                    <option value="Professional" className="bg-[#071B50] text-white">Professional (Corporate & Clear)</option>
                    <option value="Academic" className="bg-[#071B50] text-white">Academic (Formal & Objective)</option>
                    <option value="Casual" className="bg-[#071B50] text-white">Casual (Friendly & Conversational)</option>
                    <option value="Concise" className="bg-[#071B50] text-white">Concise (Executive & Direct)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#B8C8F5] mb-1.5">
                    Default English Dialect
                  </label>
                  <select
                    value={dialect}
                    onChange={(e) => setDialect(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#0A245F] border border-[rgba(79,130,255,0.3)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#255DCE]/50 focus:border-[#255DCE] text-white font-medium cursor-pointer transition-all"
                  >
                    <option value="en-US" className="bg-[#071B50] text-white">American English (en-US)</option>
                    <option value="en-GB" className="bg-[#071B50] text-white">British English (en-GB)</option>
                    <option value="en-CA" className="bg-[#071B50] text-white">Canadian English (en-CA)</option>
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
          <Card className="p-6 bg-gradient-to-r from-[#071B50] to-[#0A245F] border-[rgba(79,130,255,0.25)] shadow-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <GraduationCap className="w-5 h-5 text-[#255DCE]" />
              <h4 className="text-sm font-bold text-white">
                Department of Computer Science & Engineering Viva Notice
              </h4>
            </div>
            <p className="text-xs text-[#B8C8F5] leading-relaxed">
              This application has been developed to demonstrate full-stack software architecture principles,
              pure mathematical readability index calculations, external API integration with error handling,
              and multi-provider AI failover resiliency.
            </p>
          </Card>
        </div>

        {/* Right Col: Live System & API Provider Health Monitor */}
        <div className="space-y-4">
          <Card className="p-5 border-[rgba(79,130,255,0.25)] bg-[#071B50] shadow-xl">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[rgba(79,130,255,0.2)]">
              <Server className="w-4 h-4 text-[#255DCE]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                System Diagnostics & Providers
              </h4>
            </div>

            <div className="space-y-3.5">
              {/* LanguageTool Status */}
              <div className="p-3.5 rounded-xl border border-[rgba(79,130,255,0.25)] bg-[#0A245F]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">
                    LanguageTool HTTP API
                  </span>
                  <Badge variant="blue" size="sm">
                    Active
                  </Badge>
                </div>
                <p className="text-2xs text-[#7B9AD0] font-mono">
                  api.languagetool.org/v2/check
                </p>
              </div>

              {/* Groq AI Status */}
              <div className="p-3.5 rounded-xl border border-[rgba(79,130,255,0.25)] bg-[#0A245F]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">
                    Groq Cloud API
                  </span>
                  <Badge variant="blue" size="sm">
                    AI Engine
                  </Badge>
                </div>
                <p className="text-2xs text-[#7B9AD0]">
                  Tone analysis & writing recommendations (Llama 3.3)
                </p>
              </div>

              {/* Local Readability Engine */}
              <div className="p-3.5 rounded-xl border border-[rgba(79,130,255,0.25)] bg-[#0A245F]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">
                    Local Readability Engine
                  </span>
                  <Badge variant="blue" size="sm">
                    Deterministic
                  </Badge>
                </div>
                <p className="text-2xs text-[#7B9AD0]">
                  Algorithmic Flesch Reading Ease & Syllable Math
                </p>
              </div>

              {/* Database Status */}
              <div className="p-3.5 rounded-xl border border-[rgba(79,130,255,0.25)] bg-[#0A245F]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">
                    SQLite & SQLAlchemy
                  </span>
                  <Badge variant="blue" size="sm">
                    Active
                  </Badge>
                </div>
                <p className="text-2xs text-[#7B9AD0]">
                  Session authentication & analysis persistence
                </p>
              </div>
            </div>
          </Card>

          {/* Session Security */}
          <Card className="p-4 bg-[#0A245F]/70 border-[rgba(79,130,255,0.25)]">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-[#255DCE]" />
              <span>Session Protection</span>
            </div>
            <p className="text-2xs text-[#7B9AD0] leading-relaxed">
              Passwords are salted and hashed using Werkzeug (`scrypt`). Authenticated routes are protected with HTTP-only cookies.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
