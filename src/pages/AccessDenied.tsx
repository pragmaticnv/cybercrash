import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock, AlertTriangle, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types/auth';

interface AccessDeniedProps {
  requiredRoles?: UserRole[];
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRoles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [countdown, setCountdown] = useState(5);

  const fallbackDashboard = user?.authorizedDashboard || '/login';
  const roleName = user?.role || 'UNAUTHENTICATED';
  const agencyName = user?.agency || 'Unknown Agency';

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate(fallbackDashboard, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, fallbackDashboard, user]);

  const handleManualReturn = () => {
    navigate(fallbackDashboard, { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#02060D] text-white flex flex-col justify-between select-none font-sans relative overflow-hidden">
      {/* Background threat-grid ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-[#02060D] to-[#02060D] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 w-full px-6 py-4 border-b border-red-500/20 bg-[#040814]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-mono font-bold tracking-wider uppercase text-white flex items-center gap-2">
              <span>CYBERCRASH</span>
              <span className="text-red-500 font-extrabold">SECURITY SHIELD</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              GOV-NET ROLE-BASED ACCESS CONTROL (RBAC) ENFORCEMENT
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>ACCESS RESTRICTED (HTTP 403)</span>
        </div>
      </header>

      {/* Main Alert Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-[#070D1A]/95 border border-red-500/40 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.18)] p-6 sm:p-8 backdrop-blur-xl">
          {/* Top Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                  ACCESS CLEARANCE REJECTED
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-sans text-white tracking-tight mt-0.5">
                  403 — Unauthorized Subsystem
                </h1>
              </div>
            </div>
            <div className="hidden sm:block text-right font-mono text-[11px] text-slate-500">
              POL-SEC-RBAC
            </div>
          </div>

          {/* Description */}
          <div className="py-5 space-y-4 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            <p>
              Your authenticated identity does not have the mandatory operational clearance to enter this portal.
              CyberCrash interfaces are segregated under strict multi-agency protocol.
            </p>

            {/* Diagnostic Details Grid */}
            <div className="p-4 rounded-xl bg-[#030712] border border-white/[0.08] font-mono text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">AUTHENTICATED OPERATOR:</span>
                <span className="text-white font-bold">{user?.name || 'Anonymous User'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">ASSIGNED ROLE:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {roleName} ({user?.roleTitle || 'Operator'})
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">AFFILIATED AGENCY:</span>
                <span className="text-slate-200">{agencyName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <span className="text-slate-400">TARGET URI:</span>
                <span className="text-red-400 font-bold">{location.pathname}</span>
              </div>
              {requiredRoles.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">REQUIRED ROLE(S):</span>
                  <span className="text-cyan-300 font-bold">{requiredRoles.join(' OR ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Redirection Notice & Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400 text-center sm:text-left">
              Auto-redirecting in <span className="text-red-400 font-bold text-sm">{countdown}s</span>...
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Switch account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT</span>
              </button>

              <button
                onClick={handleManualReturn}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-mono font-bold text-white flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer border border-cyan-400/40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO AUTHORIZED CONSOLE</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Security Pill */}
      <footer className="relative z-10 w-full px-6 py-3 border-t border-white/[0.06] bg-[#030610] text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <div>POL-SEC: Section 43A IT Act · Restricted Multi-Agency Interface</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Gov-Net Session Logged</span>
        </div>
      </footer>
    </div>
  );
};
