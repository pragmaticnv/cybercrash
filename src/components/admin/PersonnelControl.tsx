import React from 'react';
import { 
  PERSONNEL_COUNTS, 
  DEMO_PERSONNEL_ROSTER, 
  AdminPersonnelItem 
} from '../../data/adminDemoData';
import { Users, Shield, Building2, Globe2, UserCheck, ArrowRight } from 'lucide-react';

interface PersonnelControlProps {
  onOpenDirectory: () => void;
  onSelectPersonnel?: (person: AdminPersonnelItem) => void;
}

export const PersonnelControl: React.FC<PersonnelControlProps> = ({ 
  onOpenDirectory,
  onSelectPersonnel 
}) => {
  // Highlighted operator demo preview (e.g. lea_demo)
  const highlighted = DEMO_PERSONNEL_ROSTER[0];

  return (
    <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-5 backdrop-blur-md flex flex-col justify-between hover:border-white/[0.12] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center">
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-wide uppercase flex items-center gap-2">
              AUTHORIZED PERSONNEL
            </h2>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider uppercase">
              Cross-Agency Multi-Tenant Identity Roster
            </span>
          </div>
        </div>

        <button
          onClick={onOpenDirectory}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/[0.04] hover:bg-sky-500/15 border border-white/[0.1] hover:border-sky-500/30 text-[11px] font-mono font-semibold text-sky-300 transition-all"
        >
          <span>VIEW PERSONNEL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Role Counts 4-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        {/* LEA */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[9.5px] font-mono uppercase">LEA OFFICERS</span>
            <Shield className="w-3 h-3 text-red-400" />
          </div>
          <span className="text-[20px] font-display font-bold text-white leading-tight mt-0.5">
            {PERSONNEL_COUNTS.leaOfficers}
          </span>
          <span className="text-[9px] font-mono text-cyan-400 mt-1">Law Enforcement</span>
        </div>

        {/* Banks */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[9.5px] font-mono uppercase">BANK USERS</span>
            <Building2 className="w-3 h-3 text-sky-400" />
          </div>
          <span className="text-[20px] font-display font-bold text-white leading-tight mt-0.5">
            {PERSONNEL_COUNTS.bankUsers}
          </span>
          <span className="text-[9px] font-mono text-sky-400 mt-1">Financial Nodal</span>
        </div>

        {/* Nodal */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[9.5px] font-mono uppercase">NODAL OFFICERS</span>
            <Globe2 className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-[20px] font-display font-bold text-white leading-tight mt-0.5">
            {PERSONNEL_COUNTS.nodalOfficers}
          </span>
          <span className="text-[9px] font-mono text-amber-400 mt-1">I4C / Central</span>
        </div>

        {/* Admin */}
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] flex flex-col">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[9.5px] font-mono uppercase">ADMINISTRATORS</span>
            <UserCheck className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-[20px] font-display font-bold text-white leading-tight mt-0.5">
            {PERSONNEL_COUNTS.administrators}
          </span>
          <span className="text-[9px] font-mono text-emerald-400 mt-1">Root Clearance</span>
        </div>
      </div>

      {/* Featured Operator Telemetry Card */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
              OPERATOR INSPECTION PREVIEW
            </span>
          </div>
          <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {highlighted.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
          <div>
            <span className="text-[#64748B] text-[9.5px] block uppercase">USER ID</span>
            <span className="text-white font-bold">{highlighted.userId}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[9.5px] block uppercase">ROLE</span>
            <span className="text-cyan-300 font-semibold">{highlighted.role}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[9.5px] block uppercase">ACCESS LEVEL</span>
            <span className="text-white/90 truncate block">{highlighted.accessLevel}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[9.5px] block uppercase">LAST ACCESS</span>
            <span className="text-amber-400 font-semibold">{highlighted.lastActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
