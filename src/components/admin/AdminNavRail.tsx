import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderLock, 
  Users, 
  KeyRound, 
  Cpu, 
  ScrollText, 
  Activity, 
  Settings,
  ChevronRight
} from 'lucide-react';

export type AdminSection = 
  | 'overview' 
  | 'case-control' 
  | 'users' 
  | 'data-access' 
  | 'ml-services' 
  | 'audit-trail' 
  | 'system-status' 
  | 'settings';

interface AdminNavRailProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
}

interface NavItem {
  id: AdminSection;
  num: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', num: '01', label: 'OVERVIEW', icon: LayoutDashboard },
  { id: 'case-control', num: '02', label: 'CASE CONTROL', icon: FolderLock },
  { id: 'users', num: '03', label: 'USERS & ROLES', icon: Users },
  { id: 'data-access', num: '04', label: 'DATA ACCESS', icon: KeyRound },
  { id: 'ml-services', num: '05', label: 'ML SERVICES', icon: Cpu },
  { id: 'audit-trail', num: '06', label: 'AUDIT TRAIL', icon: ScrollText },
  { id: 'system-status', num: '07', label: 'SYSTEM STATUS', icon: Activity },
  { id: 'settings', num: '08', label: 'SETTINGS', icon: Settings },
];

export const AdminNavRail: React.FC<AdminNavRailProps> = ({ activeSection, onSelectSection }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-[57px] bottom-0 z-20 flex flex-col justify-between py-5 bg-[#040914]/95 border-r border-white/[0.08] backdrop-blur-xl transition-all duration-300 ease-out select-none ${
        isHovered ? 'w-56 shadow-[10px_0_30px_rgba(0,0,0,0.7)]' : 'w-16'
      }`}
    >
      {/* Upper Navigation Items */}
      <div className="flex flex-col space-y-1.5 px-2">
        <div className={`px-2 mb-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[9px] font-mono tracking-[0.25em] text-[#64748B] uppercase">
            CONTROL CONSOLE
          </span>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`relative flex items-center h-10 px-2.5 rounded-lg text-left transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent text-white border-l-2 border-[#E11D2A] shadow-[0_0_15px_rgba(225,29,42,0.25)]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.03] hover:border-l-2 hover:border-cyan-500/50'
              }`}
            >
              {/* Left Indicator Icon */}
              <div className="relative flex items-center justify-center w-7 h-7 flex-shrink-0">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-[#FF4D58] drop-shadow-[0_0_8px_rgba(225,29,42,0.6)]'
                      : 'text-[#64748B] group-hover:text-cyan-400'
                  }`}
                />
              </div>

              {/* Number and Label (Expanded view) */}
              <div
                className={`flex items-center gap-2.5 ml-2 overflow-hidden whitespace-nowrap transition-all duration-200 ${
                  isHovered ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive ? 'text-[#FF6B72]' : 'text-[#475569]'}`}>
                  {item.num}
                </span>
                <span
                  className={`text-[11.5px] font-semibold tracking-wider uppercase font-sans ${
                    isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Hover chevron hint in expanded view */}
              {isHovered && isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[#FF6B72] ml-auto opacity-75" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer console stats */}
      <div className="px-2 border-t border-white/[0.06] pt-3">
        <div
          className={`flex flex-col px-2 overflow-hidden whitespace-nowrap transition-all duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B]">
            <span>NODE CONSOLE</span>
            <span className="text-emerald-400">SYNCED</span>
          </div>
          <div className="text-[8.5px] font-mono text-[#475569] mt-0.5">
            GOV-NET ID #8841-A
          </div>
        </div>
      </div>
    </aside>
  );
};
