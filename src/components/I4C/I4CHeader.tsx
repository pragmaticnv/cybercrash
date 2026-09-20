import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, User, Lock, Activity, ArrowRight, ExternalLink, Globe2 } from 'lucide-react';
import { useI4CStore } from '../../store/useI4CStore';
import { useAuthStore } from '../../store/useAuthStore';
import { i4cSearchDatabase } from '../../data/i4cMockData';
import { I4CSearchResult } from '../../types/i4c';

export const I4CHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    searchQuery,
    setSearchQuery,
    openStateById,
    openNetworkById,
    openHotspotById,
    openAccountDrawer
  } = useI4CStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter search results
  const filteredResults = searchQuery.trim()
    ? i4cSearchDatabase.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (item: I4CSearchResult) => {
    setIsSearchOpen(false);
    setSearchQuery('');

    if (item.type === 'CASE') {
      navigate(`/investigation/${item.targetId}`);
    } else if (item.type === 'NETWORK') {
      openNetworkById(item.targetId);
    } else if (item.type === 'ZONE') {
      openHotspotById(item.targetId);
    } else if (item.type === 'ACCOUNT') {
      openAccountDrawer(item.targetId);
    }
  };

  return (
    <header className="w-full bg-[#030712] border-b border-white/[0.08] px-4 lg:px-8 py-2.5 flex items-center justify-between z-40 sticky top-0 backdrop-blur-md">
      {/* Left: Brand Logo Lockup */}
      <div
        onClick={() => navigate('/i4c')}
        className="flex items-center gap-3 cursor-pointer group select-none"
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 54 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
            <defs>
              <linearGradient id="i4cBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7FD3F0" />
                <stop offset="45%" stopColor="#2F80C8" />
                <stop offset="100%" stopColor="#144C82" />
              </linearGradient>
              <linearGradient id="i4cRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D58" />
                <stop offset="50%" stopColor="#E11D2A" />
                <stop offset="100%" stopColor="#8E0F17" />
              </linearGradient>
            </defs>
            <path d="M27 3L6 14V33L27 49V3Z" fill="url(#i4cBlue)" fillOpacity="0.95" />
            <path d="M27 7L10 16.5V30L27 43V7Z" fill="white" fillOpacity="0.12" />
            <path d="M27 3L48 14V33L27 49V3Z" fill="url(#i4cRed)" fillOpacity="0.95" />
            <line x1="27" y1="3" x2="27" y2="49" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.2" />
            <circle cx="27" cy="24" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="flex flex-col">
          <div className="font-display font-extrabold tracking-[0.08em] text-[18px] leading-none uppercase flex items-center">
            <span className="text-white">CYBER</span>
            <span className="text-[#E11D2A]">CRASH</span>
          </div>
          <span className="text-[#8899A6] text-[9px] tracking-[0.25em] font-medium uppercase font-sans mt-0.5">
            TRACE · PREDICT · PREVENT
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-[520px] mx-4 lg:mx-8 relative" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search Case ID, Account ID, Network ID, Zone ID, or UTR..."
            className="w-full bg-[#070E1A] border border-white/[0.12] rounded-lg pl-10 pr-4 py-1.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 font-sans transition-all"
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

        {/* Grouped Search Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0A1220] border border-white/[0.14] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[380px] overflow-y-auto">
            {filteredResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-mono">
                No matching intelligence records found for "{searchQuery}"
              </div>
            ) : (
              <div className="py-2 divide-y divide-white/[0.06]">
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="px-4 py-2.5 hover:bg-white/[0.06] cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded ${
                          item.type === 'CASE'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : item.type === 'NETWORK'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : item.type === 'ZONE'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.type}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-400 flex items-center gap-1.5">
                          {item.title}
                          {item.tag && (
                            <span className="text-[9px] font-mono text-slate-400 bg-white/[0.05] px-1.5 py-0.2 rounded">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.subtitle}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: I4C Identity & Controls */}
      <div className="flex items-center gap-3">
        {/* I4C INTELLIGENCE Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#0F1B2F] border border-cyan-500/30 text-xs text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.15)]">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] tracking-wider uppercase font-bold">I4C INTELLIGENCE</span>
        </div>

        {/* I4C Live Active Status */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">I4C ACTIVE</span>
        </div>

        {/* Officer Profile & Exit */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[11px] font-mono font-bold text-white leading-tight">
              {user?.name || 'Dr. Sunita Deshmukh'}
            </span>
            <span className="text-[9.5px] font-mono text-red-300">
              {user?.role || 'I4C'} · {user?.badgeNumber || 'I4C-NAT-1008'}
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#0E1E34] border border-white/[0.12] flex items-center justify-center text-red-400">
            <User className="w-3.5 h-3.5" />
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Lock & Exit I4C Terminal (Logout)"
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
