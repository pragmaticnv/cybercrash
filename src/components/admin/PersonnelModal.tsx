import React, { useState } from 'react';
import { DEMO_PERSONNEL_ROSTER, AdminPersonnelItem } from '../../data/adminDemoData';
import { X, Search, Shield, Building2, Globe2, UserCheck, Filter } from 'lucide-react';

interface PersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonnelModal: React.FC<PersonnelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = DEMO_PERSONNEL_ROSTER.filter((user) => {
    const matchesCategory = selectedCategory === 'ALL' || user.category === selectedCategory;
    const matchesSearch =
      user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.agency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRoleBadge = (category: string) => {
    switch (category) {
      case 'LEA':
        return (
          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/25 text-[10px] font-mono font-bold">
            LEA
          </span>
        );
      case 'BANK':
        return (
          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/25 text-[10px] font-mono font-bold">
            BANK
          </span>
        );
      case 'NODAL':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] font-mono font-bold">
            NODAL
          </span>
        );
      case 'ADMIN':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono font-bold">
            ADMIN
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-5xl max-h-[85vh] bg-[#050B16] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center">
              <Shield className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white tracking-wide uppercase">
                PERSONNEL DIRECTORY
              </h2>
              <span className="text-[10.5px] font-mono text-[#94A3B8] tracking-wider uppercase">
                Authorized Platform Operators & Multi-Agency Roster
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

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-white/[0.06] bg-white/[0.015] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by User ID, Name, or Agency..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#081220] border border-white/[0.1] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'LEA', 'BANK', 'NODAL', 'ADMIN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 px-3 rounded-lg text-[10.5px] font-mono font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-white/[0.03] text-[#94A3B8] hover:text-white border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-mono text-[#94A3B8] uppercase">
                <th className="py-2.5 px-3">USER ID / NAME</th>
                <th className="py-2.5 px-3">ROLE</th>
                <th className="py-2.5 px-3">AGENCY</th>
                <th className="py-2.5 px-3">ACCESS LEVEL</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-3 text-right">LAST ACTIVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-[11.5px] font-mono">
              {filtered.map((user) => (
                <tr key={user.userId} className="hover:bg-white/[0.025] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {getRoleBadge(user.category)}
                      <div>
                        <span className="font-bold text-white block">{user.userId}</span>
                        <span className="text-[10px] text-[#94A3B8]">{user.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-cyan-300 font-medium">{user.role}</td>
                  <td className="py-3 px-3 text-[#CBD5E1] text-[11px]">{user.agency}</td>
                  <td className="py-3 px-3 text-[#94A3B8] text-[10.5px]">{user.accessLevel}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9.5px] font-bold">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-amber-400 font-medium">
                    {user.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/[0.08] bg-white/[0.015] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
          <span>SHOWING {filtered.length} OF {DEMO_PERSONNEL_ROSTER.length} REGISTERED OPERATORS</span>
          <span>ROLE-BASED DEMO DIRECTORY · NO LIVE DB WRITE</span>
        </div>
      </div>
    </div>
  );
};
