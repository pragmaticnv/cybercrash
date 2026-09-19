import React, { useState } from 'react';
import { INITIAL_AUDIT_EVENTS, AuditEventItem } from '../../data/adminDemoData';
import { X, Search, ScrollText, Download, ShieldAlert, Filter, Terminal } from 'lucide-react';

interface FullAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullAuditModal: React.FC<FullAuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filtered = INITIAL_AUDIT_EVENTS.filter((evt) => {
    const matchesSev = selectedSeverity === 'ALL' || evt.severity === selectedSeverity;
    const matchesSearch =
      evt.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.agency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-5xl max-h-[85vh] bg-[#050B16] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
              <ScrollText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white tracking-wide uppercase">
                COMPLETE SECURITY AUDIT TRAIL
              </h2>
              <span className="text-[10.5px] font-mono text-[#94A3B8] tracking-wider uppercase">
                Tamper-Resistant Forensic Audit Ledger (ISO/IEC 27037 Compliant)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-white/[0.06] bg-white/[0.015] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search User, Target ID, Action..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#081220] border border-white/[0.1] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {['ALL', 'SECURITY', 'WARNING', 'NOTICE', 'INFO'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`py-1 px-2.5 rounded text-[10px] font-mono font-medium transition-all ${
                    selectedSeverity === sev
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-white/[0.03] text-[#94A3B8] hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <button
              onClick={() => alert('Exporting signed audit snapshot CSV (Demo Mode)...')}
              className="flex items-center gap-1.5 py-1 px-3 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[10.5px] font-mono text-[#CBD5E1]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT</span>
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-5 font-mono space-y-2">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-[#040914] border border-white/[0.05] hover:border-white/[0.12] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-[11.5px]"
            >
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-semibold w-16">{evt.timestamp}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-white font-bold">
                  {evt.userId}
                </span>
                <span className="text-[#94A3B8] font-medium">{evt.target}</span>
                <span
                  className={`font-semibold ${
                    evt.severity === 'SECURITY'
                      ? 'text-red-400'
                      : evt.severity === 'WARNING'
                      ? 'text-amber-400'
                      : evt.severity === 'NOTICE'
                      ? 'text-sky-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {evt.action}
                </span>
              </div>

              <div className="flex items-center gap-4 text-[10.5px] text-[#64748B]">
                <span>{evt.ipAddress}</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.03] text-[#CBD5E1] border border-white/[0.06]">
                  {evt.agency}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/[0.08] bg-white/[0.015] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>ROOT CERTIFICATE: 0x9B42...A1F0 (VERIFIED IMMUTABLE)</span>
          </div>
          <span>TOTAL LOG EVENTS: {INITIAL_AUDIT_EVENTS.length}</span>
        </div>
      </div>
    </div>
  );
};
