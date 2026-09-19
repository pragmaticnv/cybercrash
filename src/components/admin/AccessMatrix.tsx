import React, { useState } from 'react';
import { 
  ACCESS_MATRIX_ROLES, 
  ACCESS_MATRIX_COLUMNS, 
  ACCESS_MATRIX_DATA 
} from '../../data/adminDemoData';
import { KeyRound, Shield, Info, HelpCircle } from 'lucide-react';

export const AccessMatrix: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const getIndicator = (val: 'ALLOWED' | 'LIMITED' | 'RESTRICTED') => {
    switch (val) {
      case 'ALLOWED':
        return (
          <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10.5px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="font-semibold">ALLOWED</span>
          </div>
        );
      case 'LIMITED':
        return (
          <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10.5px]">
            <span className="w-2 h-2 rounded-full border border-amber-400 bg-amber-400/20" />
            <span className="font-semibold">LIMITED</span>
          </div>
        );
      case 'RESTRICTED':
        return (
          <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-white/[0.02] border border-white/[0.08] text-[#64748B] font-mono text-[10.5px]">
            <span className="text-[12px] font-bold text-red-400/70">—</span>
            <span>RESTRICTED</span>
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-5 backdrop-blur-md flex flex-col hover:border-white/[0.12] transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-white/[0.07] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-wide uppercase flex items-center gap-2">
              DATA ACCESS MATRIX
            </h2>
            <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider uppercase">
              Role-Based Access Control (RBAC) Across Cross-Agency Entities
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>● ALLOWED</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full border border-amber-400 bg-amber-400/20" />
            <span>○ LIMITED</span>
          </div>
          <div className="flex items-center gap-1 text-[#64748B]">
            <span className="font-bold text-red-400/70">—</span>
            <span>RESTRICTED</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse min-w-[920px]">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              <th className="py-3 px-3 text-[10.5px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider w-[200px]">
                ROLE / AGENCY ENTITY
              </th>
              {ACCESS_MATRIX_COLUMNS.map((col) => (
                <th
                  key={col}
                  className="py-3 px-2 text-center text-[10px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {ACCESS_MATRIX_ROLES.map((role) => {
              const isSelected = selectedRole === role.label;
              const rowPermissions = ACCESS_MATRIX_DATA[role.label] || {};

              return (
                <tr
                  key={role.id}
                  onClick={() => setSelectedRole(isSelected ? null : role.label)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-red-500/[0.06]'
                      : 'hover:bg-white/[0.025]'
                  }`}
                >
                  {/* Role Name */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="text-[12.5px] font-bold text-white group-hover:text-cyan-300 transition-colors font-sans">
                        {role.label}
                      </span>
                      <span className="text-[9.5px] font-mono text-[#64748B] mt-0.5">
                        {role.description}
                      </span>
                    </div>
                  </td>

                  {/* Columns */}
                  {ACCESS_MATRIX_COLUMNS.map((col) => {
                    const status = rowPermissions[col] || 'RESTRICTED';
                    return (
                      <td key={col} className="py-3 px-2 text-center">
                        {getIndicator(status)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Technical Footnote */}
      <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>POLICIES ENFORCED VIA GOV-NET TOKEN ENCRYPTION · LEVEL 4 SEPARATION</span>
        </div>
        <span>CLICK ANY ROW TO HIGHLIGHT SPECIFIC ROLE AUTHORITY</span>
      </div>
    </div>
  );
};
