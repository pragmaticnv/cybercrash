import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [portalRole, setPortalRole] = useState<'lea' | 'i4c' | 'bank' | 'admin'>('lea');
  const [userId, setUserId] = useState('lea_demo');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePortalSwitch = (role: 'lea' | 'i4c' | 'bank' | 'admin') => {
    setPortalRole(role);
    if (role === 'bank') {
      setUserId('bank_security');
    } else if (role === 'i4c') {
      setUserId('i4c_national');
    } else if (role === 'admin') {
      setUserId('admin_demo');
    } else {
      setUserId('lea_demo');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    const isAdmin =
      portalRole === 'admin' ||
      userId.trim().toLowerCase() === 'admin_demo';

    const isBank =
      portalRole === 'bank' ||
      userId.toLowerCase().includes('bank');

    const isI4C =
      portalRole === 'i4c' ||
      userId.toLowerCase().includes('i4c') ||
      userId.toLowerCase().includes('national');

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin');
        } else if (isBank) {
          navigate('/bank');
        } else if (isI4C) {
          navigate('/i4c');
        } else {
          navigate('/cases');
        }
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between select-none bg-[#03070D] text-white font-sans overflow-hidden">
      {/* Background with cinematic threat map image and overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWw0ssm5KItr1bld2h3ZzB9vUEenfwRrzHyQNGYMh91IEKzS9YtUvGQQI2SNEj565Fk0JSXWrjpDTkpELnBNObkbvQY_TByXAEPA94D6U1gWhyIUIxTX0TKH6dfwKNdSHU5LyGvFqLZ-PG6nscXPotpJCH7wwmT36nJCFRoelYZLXogIkLM4bxi2QTlx44B2nc9tFYzB0s0DyrQ1NH1bJQjjTk_dnY6Gk8AP4t0b2vP0IlEkfr9PAB5A"
          alt="Cyber Intelligence Center"
          className="w-full h-full object-cover object-center scale-[1.02] brightness-90 filter"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03070D]/95 via-[#03070D]/65 via-50% to-[#03070D]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#03070D_100%)]" />
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#03070D]/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#03070D] via-[#03070D]/85 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full px-6 lg:px-12 pt-6 lg:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => navigate('/cases')}>
          <div className="relative w-[50px] h-[48px] flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(47,128,200,0.35)]">
            <svg viewBox="0 0 54 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="emBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7FD3F0" />
                  <stop offset="45%" stopColor="#2F80C8" />
                  <stop offset="100%" stopColor="#144C82" />
                </linearGradient>
                <linearGradient id="emRed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF4D58" />
                  <stop offset="50%" stopColor="#E11D2A" />
                  <stop offset="100%" stopColor="#8E0F17" />
                </linearGradient>
              </defs>
              <path d="M27 3L6 14V33L27 49V3Z" fill="url(#emBlue)" fillOpacity="0.95" />
              <path d="M27 7L10 16.5V30L27 43V7Z" fill="white" fillOpacity="0.12" />
              <path d="M27 3L48 14V33L27 49V3Z" fill="url(#emRed)" fillOpacity="0.95" />
              <line x1="27" y1="3" x2="27" y2="49" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.2" />
              <circle cx="27" cy="24" r="3.5" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="font-display font-extrabold tracking-[0.08em] text-[26px] leading-tight uppercase flex items-center">
              <span className="text-white">CYBER</span>
              <span className="text-[#E11D2A]">CRASH</span>
            </div>
            <div className="text-[#DDE3EA] text-[11px] tracking-[0.28em] font-medium uppercase font-sans mt-0.5 opacity-90">
              TRACE · PREDICT · PREVENT
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 py-1.5 px-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] text-[#A0ACB9]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-white/90 text-[11px] uppercase tracking-wider">RESTRICTED ACCESS · GOV-NET ENCRYPTED</span>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="relative z-20 w-full flex-1 max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-16 py-4 flex flex-col items-center justify-center">
        {/* Left Side Heading */}
        <div className="hidden lg:flex flex-col justify-center items-start absolute left-8 xl:left-16 top-1/2 -translate-y-1/2 select-none">
          <h1 className="font-display font-bold text-[28px] xl:text-[34px] tracking-[0.03em] leading-[1.04] uppercase">
            <span className="block text-white">FIGHT</span>
            <span className="block text-white">CYBERCRIME</span>
            <span className="block text-[#E11D2A] drop-shadow-[0_0_16px_rgba(225,29,42,0.45)]">TOGETHER</span>
          </h1>
          <div className="w-8 h-[2px] bg-[#E11D2A] mt-3 rounded-full opacity-80 shadow-[0_0_8px_rgba(225,29,42,0.6)]" />
        </div>

        {/* Centralized Login Card */}
        <div className="w-full max-w-[460px] mx-auto z-10">
          <div className="rounded-[28px] bg-[rgba(14,24,36,0.72)] backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[#FF6B72] text-[11px] font-mono font-medium uppercase tracking-wider mb-3">
                <Shield className="w-3.5 h-3.5 text-[#E11D2A]" />
                OFFICIAL ACCESS GATEWAY
              </div>
              <div className="font-display font-bold text-[32px] sm:text-[36px] tracking-[0.06em] uppercase leading-tight flex items-center justify-center">
                <span className="text-white">CYBER</span>
                <span className="text-[#E11D2A]">CRASH</span>
              </div>
              <div className="text-[13.5px] text-[#A0ACB9] font-medium mt-1 tracking-wide">
                Multi-Agency Cybercrime Intelligence Platform
              </div>
            </div>

            {/* Portal Switcher Tabs */}
            <div className="mt-5 p-1 bg-[#091220] rounded-xl border border-white/[0.08] grid grid-cols-4 gap-1 font-mono text-[9.5px] sm:text-[10.5px]">
              <button
                type="button"
                onClick={() => handlePortalSwitch('lea')}
                className={`py-2 px-1 rounded-lg font-bold transition-all text-center ${
                  portalRole === 'lea'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LEA CASES
              </button>
              <button
                type="button"
                onClick={() => handlePortalSwitch('i4c')}
                className={`py-2 px-1 rounded-lg font-bold transition-all text-center ${
                  portalRole === 'i4c'
                    ? 'bg-red-500/25 text-red-300 border border-red-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                I4C NATIONAL
              </button>
              <button
                type="button"
                onClick={() => handlePortalSwitch('bank')}
                className={`py-2 px-1 rounded-lg font-bold transition-all text-center ${
                  portalRole === 'bank'
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                BANK05
              </button>
              <button
                type="button"
                onClick={() => handlePortalSwitch('admin')}
                className={`py-2 px-1 rounded-lg font-bold transition-all text-center ${
                  portalRole === 'admin'
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ADMIN
              </button>
            </div>

            <form onSubmit={handleSignIn} className="mt-4 flex flex-col space-y-3.5">
              <div className="relative flex items-center h-[50px] rounded-[10px] bg-white/[0.045] border border-white/[0.13]">
                <User className="absolute left-[18px] w-5 h-5 text-[#C9D1DA]" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={
                    portalRole === 'admin'
                      ? 'User ID (e.g. admin_demo)'
                      : portalRole === 'bank'
                      ? 'User ID (e.g. bank_security)'
                      : portalRole === 'i4c'
                      ? 'User ID (e.g. i4c_national)'
                      : 'User ID (e.g. lea_demo)'
                  }
                  className="w-full h-full bg-transparent pl-[52px] pr-4 text-[15px] text-white placeholder-[#7C8794] focus:outline-none"
                />
              </div>

              <div className="relative flex items-center h-[50px] rounded-[10px] bg-white/[0.045] border border-white/[0.13]">
                <Lock className="absolute left-[18px] w-5 h-5 text-[#C9D1DA]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-full bg-transparent pl-[52px] pr-12 text-[15px] text-white placeholder-[#7C8794] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#AEB8C2] hover:text-white"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className={`w-full h-[50px] rounded-[10px] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all mt-2 shadow-lg ${
                  authSuccess
                    ? 'bg-emerald-600 border border-emerald-400'
                    : portalRole === 'admin'
                    ? 'bg-gradient-to-b from-[#9333EA] via-[#7E22CE] to-[#581C87] hover:brightness-110 shadow-purple-900/50'
                    : portalRole === 'bank'
                    ? 'bg-gradient-to-b from-[#F59E0B] via-[#D97706] to-[#92400E] hover:brightness-110 shadow-amber-900/50'
                    : portalRole === 'i4c'
                    ? 'bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#991B1B] hover:brightness-110 shadow-red-900/50'
                    : 'bg-gradient-to-b from-[#2F80C8] via-[#1D60A5] to-[#123E6E] hover:brightness-110 shadow-blue-900/50'
                }`}
              >
                {isAuthenticating ? (
                  <span>Authenticating Gov-Net Token...</span>
                ) : authSuccess ? (
                  <span>Access Granted · Entering Workspace</span>
                ) : (
                  <>
                    <span>
                      {portalRole === 'admin'
                        ? 'Enter Admin Console'
                        : portalRole === 'bank'
                        ? 'Enter Bank Operations'
                        : portalRole === 'i4c'
                        ? 'Enter I4C Command'
                        : 'Enter Case Command'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2.5">
                Quick Multi-Agency Portals
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => navigate('/cases')}
                  className="py-2 px-1.5 rounded-lg bg-white/[0.04] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-semibold uppercase transition-colors"
                >
                  LEA Cases
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/i4c')}
                  className="py-2 px-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 text-[10px] font-mono text-red-300 font-semibold uppercase transition-colors"
                >
                  I4C Command
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/bank')}
                  className="py-2 px-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-[10px] font-mono text-amber-300 font-semibold uppercase transition-colors"
                >
                  Bank Security
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="py-2 px-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 hover:border-purple-500/70 text-[10px] font-mono text-purple-300 font-semibold uppercase transition-colors shadow-sm"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/investigation/CASE_007001')}
                  className="py-2 px-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-500/15 border border-white/[0.08] hover:border-purple-500/40 text-[10px] font-mono text-slate-300 font-semibold uppercase transition-colors"
                >
                  CASE_007001
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
