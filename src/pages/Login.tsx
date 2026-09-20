import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { DEMO_ACCOUNTS } from '../data/authDemoAccounts';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('lea_officer');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const handleFillCredentials = (demoUsername: string, demoPass: string) => {
    setUsername(demoUsername);
    setPassword(demoPass);
    setAuthError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const result = await login({ username, password });

    if (!result.success || !result.user) {
      setAuthError(result.error || 'Authentication rejected. Verify credentials.');
      return;
    }

    const authenticatedUser = result.user;
    setAuthSuccess(true);
    setSuccessMessage(`Access Granted: ${authenticatedUser.name} (${authenticatedUser.role})`);

    // Route strictly to the authenticated user's authorized dashboard
    setTimeout(() => {
      // If there was a redirect URL that matches the user's role, go there; otherwise go to authorized dashboard
      const stateFrom = (location.state as any)?.from?.pathname;
      const isAllowedTarget =
        stateFrom &&
        ((authenticatedUser.role === 'LEA' && (stateFrom.startsWith('/lea') || stateFrom.startsWith('/cases') || stateFrom.startsWith('/investigation'))) ||
          (authenticatedUser.role === 'BANK' && stateFrom.startsWith('/bank')) ||
          (authenticatedUser.role === 'I4C' && stateFrom.startsWith('/i4c')) ||
          (authenticatedUser.role === 'ADMIN' && stateFrom.startsWith('/admin')));

      const destination = isAllowedTarget ? stateFrom : authenticatedUser.authorizedDashboard;
      navigate(destination, { replace: true });
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between select-none bg-[#03070D] text-white font-sans overflow-hidden">
      {/* Background with cinematic threat map image and overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/login-bg.png"
          alt="Cyber Intelligence Command Center"
          className="w-full h-full object-cover object-center scale-[1.01] brightness-[0.88] contrast-[1.06] filter"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03070D]/75 via-[#03070D]/35 to-[#03070D]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#03070D_95%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#03070D]/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#03070D] via-[#03070D]/80 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full px-6 lg:px-12 pt-6 lg:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3.5 group select-none">
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
          <span className="font-mono text-white/90 text-[11px] uppercase tracking-wider">RESTRICTED ACCESS · RBAC ENFORCED</span>
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
          <div className="mt-3 text-xs font-mono text-slate-400 max-w-[280px]">
            Multi-Agency Integrated Forensic Architecture (LEA · BANK · I4C · ADMIN)
          </div>
        </div>

        {/* Centralized Login Card */}
        <div className="w-full max-w-[480px] mx-auto z-10">
          <div className="rounded-[28px] bg-[rgba(14,24,36,0.78)] backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-7 sm:p-9 relative overflow-hidden">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-[#FF6B72] text-[11px] font-mono font-medium uppercase tracking-wider mb-2.5">
                <Shield className="w-3.5 h-3.5 text-[#E11D2A]" />
                OFFICIAL RBAC AUTHENTICATION GATEWAY
              </div>
              <div className="font-display font-bold text-[30px] sm:text-[34px] tracking-[0.06em] uppercase leading-tight flex items-center justify-center">
                <span className="text-white">CYBER</span>
                <span className="text-[#E11D2A]">CRASH</span>
              </div>
              <div className="text-[13px] text-[#A0ACB9] font-medium mt-1 tracking-wide">
                Role is strictly verified from authenticated user account
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="mt-4 flex flex-col space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Operator Identity / Username
                </label>
                <div className="relative flex items-center h-[48px] rounded-[10px] bg-white/[0.045] border border-white/[0.13] focus-within:border-cyan-500/60 transition-colors">
                  <User className="absolute left-[16px] w-4.5 h-4.5 text-[#C9D1DA]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="e.g. lea_officer, bank_officer, i4c_analyst, admin_sec"
                    className="w-full h-full bg-transparent pl-[48px] pr-4 text-[14px] text-white placeholder-[#7C8794] focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Security Token / Password
                </label>
                <div className="relative flex items-center h-[48px] rounded-[10px] bg-white/[0.045] border border-white/[0.13] focus-within:border-cyan-500/60 transition-colors">
                  <Lock className="absolute left-[16px] w-4.5 h-4.5 text-[#C9D1DA]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Enter password"
                    className="w-full h-full bg-transparent pl-[48px] pr-12 text-[14px] text-white placeholder-[#7C8794] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#AEB8C2] hover:text-white"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-[48px] rounded-[10px] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all mt-2 shadow-lg cursor-pointer ${
                  authSuccess
                    ? 'bg-emerald-600 border border-emerald-400'
                    : 'bg-gradient-to-r from-red-600 via-rose-600 to-blue-600 hover:brightness-110 shadow-red-950/50 border border-white/[0.1]'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Gov-Net RBAC Credentials...</span>
                  </span>
                ) : authSuccess ? (
                  <span className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>{successMessage}</span>
                  </span>
                ) : (
                  <>
                    <span>Authenticate &amp; Access Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Prototype Demo Accounts Helper (Auto-fill for evaluation) */}
            <div className="mt-5 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-cyan-400" />
                  PROTOTYPE DEMO ACCOUNTS (1-CLICK AUTO-FILL):
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.user.id}
                    type="button"
                    onClick={() => handleFillCredentials(acc.user.username, 'password123')}
                    className="p-2 rounded-lg bg-[#070F1E] hover:bg-[#0B172E] border border-white/[0.08] hover:border-cyan-500/50 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white group-hover:text-cyan-300">
                        {acc.user.role}
                      </span>
                      <span className="text-[9px] text-slate-500">{acc.user.authorizedDashboard}</span>
                    </div>
                    <div className="text-slate-400 text-[9.5px] truncate mt-0.5">
                      {acc.user.username}
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-[9.5px] font-mono text-slate-500 text-center mt-2.5">
                Default password for all demo accounts: <span className="text-slate-400 font-bold">password123</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
