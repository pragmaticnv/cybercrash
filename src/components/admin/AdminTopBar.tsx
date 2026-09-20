import React from 'react';
import { Shield, ShieldAlert, LogOut, Cpu, Database, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface AdminTopBarProps {
  onOpenSystemStatus?: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ onOpenSystemStatus }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-[#040914]/90 border-b border-white/[0.08] px-4 lg:px-8 py-2.5 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md select-none">
      {/* LEFT: CYBERCRASH Logo Lockup */}
      <div 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="relative w-8 h-8 flex items-center justify-center filter drop-shadow-[0_0_10px_rgba(225,29,42,0.35)]">
          <svg viewBox="0 0 54 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="emBlueBar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7FD3F0" />
                <stop offset="45%" stopColor="#2F80C8" />
                <stop offset="100%" stopColor="#144C82" />
              </linearGradient>
              <linearGradient id="emRedBar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D58" />
                <stop offset="50%" stopColor="#E11D2A" />
                <stop offset="100%" stopColor="#8E0F17" />
              </linearGradient>
            </defs>
            <path d="M27 3L6 14V33L27 49V3Z" fill="url(#emBlueBar)" fillOpacity="0.95" />
            <path d="M27 7L10 16.5V30L27 43V7Z" fill="white" fillOpacity="0.12" />
            <path d="M27 3L48 14V33L27 49V3Z" fill="url(#emRedBar)" fillOpacity="0.95" />
            <line x1="27" y1="3" x2="27" y2="49" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.2" />
            <circle cx="27" cy="24" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="flex flex-col">
          <div className="font-display font-black tracking-[0.09em] text-[20px] leading-none uppercase flex items-center">
            <span className="text-white">CYBER</span>
            <span className="text-[#E11D2A]">CRASH</span>
          </div>
          <span className="text-[#94A3B8] text-[9px] tracking-[0.28em] font-medium uppercase font-sans mt-0.5 opacity-90">
            TRACE · PREDICT · PREVENT
          </span>
        </div>
      </div>

      {/* CENTER: Technical System Status Console */}
      <div 
        onClick={onOpenSystemStatus}
        className="hidden md:flex items-center gap-4 py-1.5 px-4 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-all cursor-pointer group"
        title="Click to view detailed system health diagnostics"
      >
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[10.5px] font-semibold text-emerald-400 tracking-wider">SYSTEM OPERATIONAL</span>
        </div>

        <div className="h-3 w-px bg-white/[0.12]" />

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-[#94A3B8]">
          <Radio className="w-3 h-3 text-cyan-400" />
          <span>NCRP / CFCFRMS SIMULATION</span>
        </div>

        <div className="h-3 w-px bg-white/[0.12]" />

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-[#94A3B8]">
          <Cpu className="w-3 h-3 text-amber-400" />
          <span>MODEL SERVICES ONLINE</span>
        </div>

        <div className="h-3 w-px bg-white/[0.12]" />

        <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-[#94A3B8]">
          <Database className="w-3 h-3 text-sky-400" />
          <span>DATABASE CONNECTED</span>
        </div>
      </div>

      {/* RIGHT: Secure Operator Identity Indicator & Logout */}
      <div className="flex items-center gap-3">
        {/* Subtle Demo indicator */}
        <div className="hidden lg:flex items-center px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.02] text-[9px] font-mono uppercase tracking-widest text-[#64748B]">
          DEMO ENVIRONMENT
        </div>

        {/* Operator Identity Badge */}
        <div className="flex items-center gap-2.5 py-1 px-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] hover:border-white/[0.2] transition-colors">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-red-600/30 to-red-950/60 border border-red-500/40 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-[#FF6B72]" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-white tracking-wide">
                {user?.username || 'admin_sec'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-[#FF4D58] border border-red-500/30 text-[8.5px] font-mono font-bold tracking-wider uppercase">
                {user?.role || 'ADMIN'} ACCESS
              </span>
            </div>
            <span className="text-[9.5px] font-mono text-[#94A3B8] tracking-widest uppercase">
              {user?.name || 'Rajesh Varma'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out to Login Gateway"
          className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/15 border border-white/[0.08] hover:border-red-500/40 text-[#94A3B8] hover:text-[#FF6B72] transition-all flex items-center justify-center"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
