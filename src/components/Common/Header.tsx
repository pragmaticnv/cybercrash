import React from 'react';
import { Search, Shield, Bell, User, Lock, Activity } from 'lucide-react';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useInvestigationStore();
  const navigate = useNavigate();

  return (
    <header className="w-full bg-[#040914] border-b border-white/[0.08] px-4 lg:px-8 py-3 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md">
      {/* Left: Brand Logo Lockup */}
      <div 
        onClick={() => navigate('/cases')}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="relative w-9 h-9 flex items-center justify-center">
          <svg viewBox="0 0 54 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]">
            <defs>
              <linearGradient id="emblemBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7FD3F0" />
                <stop offset="45%" stopColor="#2F80C8" />
                <stop offset="100%" stopColor="#144C82" />
              </linearGradient>
              <linearGradient id="emblemRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D58" />
                <stop offset="50%" stopColor="#E11D2A" />
                <stop offset="100%" stopColor="#8E0F17" />
              </linearGradient>
            </defs>
            <path d="M27 3L6 14V33L27 49V3Z" fill="url(#emblemBlue)" fillOpacity="0.95" />
            <path d="M27 7L10 16.5V30L27 43V7Z" fill="white" fillOpacity="0.12" />
            <path d="M27 3L48 14V33L27 49V3Z" fill="url(#emblemRed)" fillOpacity="0.95" />
            <line x1="27" y1="3" x2="27" y2="49" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.2" />
            <circle cx="27" cy="24" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="flex flex-col">
          <div className="font-display font-extrabold tracking-[0.08em] text-[20px] leading-none uppercase flex items-center">
            <span className="text-white">CYBER</span>
            <span className="text-[#E11D2A]">CRASH</span>
          </div>
          <span className="text-[#8899A6] text-[9.5px] tracking-[0.25em] font-medium uppercase font-sans mt-0.5">
            TRACE · PREDICT · PREVENT
          </span>
        </div>
      </div>

      {/* Center/Right: Case Search Bar */}
      <div className="flex-1 max-w-[460px] mx-4 lg:mx-8 hidden sm:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Case ID, Account ID, or UTR / Transaction ID..."
            className="w-full bg-[#081220] border border-white/[0.1] rounded-lg pl-10 pr-4 py-1.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 font-sans transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right: LEA Officer Status & Controls */}
      <div className="flex items-center gap-3">
        {/* LEA Secure Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-[#091526] border border-cyan-500/20 text-xs text-cyan-300">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] tracking-wider uppercase font-semibold">LEA WORKSTATION</span>
        </div>

        {/* Live Officer Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wide">OFFICER ACTIVE</span>
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-full bg-[#102036] border border-white/[0.12] flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <button
            onClick={() => navigate('/')}
            title="Lock & Exit Workstation"
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
