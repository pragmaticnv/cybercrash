import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, Building2, User, Lock, Activity, Globe, Scale } from 'lucide-react';
import { useBankStore } from '../../store/useBankStore';
import { BANK_ACCOUNTS } from '../../data/bank/bankAccounts';
import { BANK_TRANSACTIONS } from '../../data/bank/bankTransactions';

export const BankHeader: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, setSelectedAccountId, setSelectedTransaction, openDrawer } = useBankStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Global '/' hotkey listener to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const q = searchQuery.trim().toLowerCase();
  const matchedAccounts = q ? BANK_ACCOUNTS.filter((a) => a.accountId.toLowerCase().includes(q) || a.holderName.toLowerCase().includes(q)) : [];
  const matchedTx = q ? BANK_TRANSACTIONS.filter((t) => t.transactionId.toLowerCase().includes(q) || t.sourceAccount.toLowerCase().includes(q) || t.destinationAccount.toLowerCase().includes(q)) : [];

  return (
    <header className="w-full bg-[#030712] border-b border-white/[0.08] px-4 lg:px-8 py-2.5 flex items-center justify-between z-40 sticky top-0 backdrop-blur-md">
      {/* Left: CYBERCRASH Bank Identity Lockup */}
      <div
        onClick={() => navigate('/bank')}
        className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 54 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            <defs>
              <linearGradient id="bankGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="bankBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7FD3F0" />
                <stop offset="50%" stopColor="#2F80C8" />
                <stop offset="100%" stopColor="#144C82" />
              </linearGradient>
            </defs>
            <path d="M27 3L6 14V33L27 49V3Z" fill="url(#bankBlue)" fillOpacity="0.95" />
            <path d="M27 7L10 16.5V30L27 43V7Z" fill="white" fillOpacity="0.12" />
            <path d="M27 3L48 14V33L27 49V3Z" fill="url(#bankGold)" fillOpacity="0.95" />
            <line x1="27" y1="3" x2="27" y2="49" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1.2" />
            <circle cx="27" cy="24" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="flex flex-col">
          <div className="font-display font-extrabold tracking-[0.08em] text-[18px] leading-none uppercase flex items-center">
            <span className="text-white">CYBER</span>
            <span className="text-[#F59E0B]">CRASH</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[#A0ACB9] text-[9.5px] tracking-[0.2em] font-medium uppercase font-sans">
              BANK SECURITY
            </span>
            <span className="text-white/30 text-[9px]">·</span>
            <span className="text-amber-400 font-mono text-[9.5px] font-bold">
              BANK05
            </span>
          </div>
        </div>
      </div>

      {/* Center: Command-Style Search with '/' Hotkey */}
      <div className="flex-1 max-w-[500px] mx-4 lg:mx-8 relative" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-500" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search Account ID (e.g. ACC_013041), TXN ID, or Case ID... (Press '/' to focus)"
            className="w-full bg-[#070F1C] border border-white/[0.12] rounded-lg pl-10 pr-9 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 font-sans transition-all"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 rounded bg-white/[0.08] text-[9.5px] font-mono text-slate-400 border border-white/[0.1]">
            /
          </kbd>
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && q && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#091220] border border-white/[0.14] rounded-xl shadow-2xl overflow-hidden z-50 max-h-[340px] overflow-y-auto">
            {matchedAccounts.length === 0 && matchedTx.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 font-mono">
                No matching accounts or transactions for "{searchQuery}"
              </div>
            ) : (
              <div className="py-2 divide-y divide-white/[0.06]">
                {matchedAccounts.map((acc) => (
                  <div
                    key={acc.accountId}
                    onClick={() => {
                      setSelectedAccountId(acc.accountId);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      navigate(`/bank/account/${acc.accountId}`);
                    }}
                    className="px-4 py-2 hover:bg-white/[0.06] cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ACCOUNT
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 font-mono">
                          {acc.accountId}
                        </div>
                        <div className="text-[11px] text-slate-400">{acc.holderName} · {acc.bankName}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Risk: {acc.networkRiskScore.toFixed(3)}</span>
                  </div>
                ))}
                {matchedTx.map((tx) => (
                  <div
                    key={tx.transactionId}
                    onClick={() => {
                      setSelectedTransaction(tx);
                      openDrawer('transaction');
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 hover:bg-white/[0.06] cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        TRANSACTION
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 font-mono">
                          {tx.transactionId} · ₹{tx.amount.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400">{tx.sourceAccount} &rarr; {tx.destinationAccount} ({tx.channel})</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Operational Status & Multi-Agency Portals */}
      <div className="flex items-center gap-2.5">
        {/* Switch to I4C / LEA Portals */}
        <div className="hidden xl:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-lg border border-white/[0.08]">
          <button
            onClick={() => navigate('/i4c')}
            title="Open I4C National Command Center"
            className="flex items-center gap-1 px-2 py-1 rounded text-[10.5px] font-mono text-slate-300 hover:text-cyan-300 hover:bg-white/[0.06] transition-colors"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>I4C NATIONAL</span>
          </button>
          <button
            onClick={() => navigate('/cases')}
            title="Open LEA Case Command"
            className="flex items-center gap-1 px-2 py-1 rounded text-[10.5px] font-mono text-slate-300 hover:text-red-300 hover:bg-white/[0.06] transition-colors"
          >
            <Scale className="w-3 h-3 text-red-400" />
            <span>LEA CASES</span>
          </button>
        </div>

        {/* Bank Operational Status Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-wider font-semibold">
            STATUS: OPERATIONAL
          </span>
        </div>

        {/* Current Shift */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0F1C2E] border border-white/[0.08] text-xs text-slate-300 font-mono">
          <span className="text-[10px] text-slate-400">SHIFT:</span>
          <span className="text-amber-400 font-bold text-[10.5px]">ACTIVE (DAY 1)</span>
        </div>

        {/* User / Exit */}
        <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/[0.08]">
          <div className="w-7 h-7 rounded-full bg-[#102036] border border-white/[0.12] flex items-center justify-center text-slate-300">
            <User className="w-3.5 h-3.5" />
          </div>
          <button
            onClick={() => navigate('/')}
            title="Lock & Exit Workstation"
            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
