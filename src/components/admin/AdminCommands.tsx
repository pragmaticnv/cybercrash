import React from 'react';
import { 
  Users, 
  UserPlus, 
  KeyRound, 
  ScrollText, 
  Activity, 
  Cpu, 
  Command 
} from 'lucide-react';

interface AdminCommandsProps {
  onOpenUsers: () => void;
  onOpenAssignCase: () => void;
  onOpenDataAccess: () => void;
  onOpenAuditLog: () => void;
  onOpenSystemStatus: () => void;
  onOpenModelStatus: () => void;
}

export const AdminCommands: React.FC<AdminCommandsProps> = ({
  onOpenUsers,
  onOpenAssignCase,
  onOpenDataAccess,
  onOpenAuditLog,
  onOpenSystemStatus,
  onOpenModelStatus,
}) => {
  const commands = [
    { label: 'USER ACCESS', icon: Users, action: onOpenUsers, color: 'text-sky-400', border: 'hover:border-sky-500/40' },
    { label: 'CASE ASSIGNMENT', icon: UserPlus, action: onOpenAssignCase, color: 'text-[#FF4D58]', border: 'hover:border-red-500/40' },
    { label: 'DATA ACCESS', icon: KeyRound, action: onOpenDataAccess, color: 'text-emerald-400', border: 'hover:border-emerald-500/40' },
    { label: 'AUDIT LOG', icon: ScrollText, action: onOpenAuditLog, color: 'text-amber-400', border: 'hover:border-amber-500/40' },
    { label: 'SYSTEM STATUS', icon: Activity, action: onOpenSystemStatus, color: 'text-cyan-400', border: 'hover:border-cyan-500/40' },
    { label: 'MODEL STATUS', icon: Cpu, action: onOpenModelStatus, color: 'text-indigo-400', border: 'hover:border-indigo-500/40' },
  ];

  return (
    <div className="w-full rounded-2xl bg-[rgba(10,16,25,0.75)] border border-white/[0.08] p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Label */}
      <div className="flex items-center gap-2 text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
        <Command className="w-4 h-4 text-cyan-400" />
        <span className="font-bold text-white">ADMIN COMMANDS:</span>
      </div>

      {/* Button Rail */}
      <div className="flex flex-wrap items-center gap-2">
        {commands.map((cmd, idx) => {
          const Icon = cmd.icon;
          return (
            <button
              key={idx}
              onClick={cmd.action}
              className={`flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.08] ${cmd.border} hover:bg-white/[0.06] text-[11px] font-mono font-medium tracking-wide transition-all group`}
            >
              <Icon className={`w-3.5 h-3.5 ${cmd.color} transition-transform group-hover:scale-110`} />
              <span className="text-white/90 group-hover:text-white">[ {cmd.label} ]</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
