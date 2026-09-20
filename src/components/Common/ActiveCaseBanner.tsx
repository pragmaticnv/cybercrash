import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Radio, 
  Building2, 
  Sliders, 
  RefreshCw,
  Shield,
  Plus
} from 'lucide-react';

interface ActiveCaseBannerProps {
  currentPortal?: 'lea' | 'i4c' | 'bank' | 'admin' | string;
}

export const ActiveCaseBanner: React.FC<ActiveCaseBannerProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { 
    activeCase, 
    prediction, 
    selectedDemoKey, 
    selectDemoCase, 
    isLoading 
  } = useActiveCaseStore();

  const [isSwitching, setIsSwitching] = useState(false);

  const currentPath = location.pathname;
  const isLEA = currentPath.startsWith('/cases') || currentPath.startsWith('/investigation');
  const isI4C = currentPath.startsWith('/i4c');
  const isBank = currentPath.startsWith('/bank');
  const isAdmin = currentPath.startsWith('/admin');

  const handleSelectDemo = async (key: string) => {
    if (!key) return;
    setIsSwitching(true);
    try {
      await selectDemoCase(key);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="w-full bg-[#030812] border-b border-cyan-500/25 text-white select-none z-20 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Active Demo Case Focus + Dropdown */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
              ACTIVE CASE FOCUS:
            </span>
          </div>

          <div className="relative flex items-center">
            <select
              value={selectedDemoKey || activeCase?.id || 'LIVE_DEMO_001'}
              onChange={(e) => handleSelectDemo(e.target.value)}
              disabled={isLoading || isSwitching}
              className="bg-[#091527] border border-cyan-500/50 text-cyan-200 font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer disabled:opacity-50"
            >
              {activeCase && !['LIVE_DEMO_001', 'LIVE_DEMO_002', 'LIVE_DEMO_003', 'DEMO_EXISTING_001', 'DEMO_MIXED_001', 'DEMO_NEW_001'].includes(activeCase.id) && (
                <option value={activeCase.id} className="bg-[#091527] text-cyan-200 font-bold">
                  ⚡ {activeCase.id} · {activeCase.type} ({activeCase.amount} · {activeCase.stateCode}) [NEWLY ANALYZED CASE]
                </option>
              )}
              <option value="LIVE_DEMO_001" className="bg-[#091527] text-cyan-200">
                LIVE_DEMO_001 · Investment Scam (₹1,50,000 · Goa · ACC_013041)
              </option>
              <option value="LIVE_DEMO_002" className="bg-[#091527] text-cyan-200">
                LIVE_DEMO_002 · UPI Fraud (₹2,75,000 · Punjab · NEW_MULE_001)
              </option>
              <option value="LIVE_DEMO_003" className="bg-[#091527] text-cyan-200">
                LIVE_DEMO_003 · Marketplace Fraud (₹2,50,000 · Tamil Nadu · NEW_MULE_002)
              </option>
              <option value="DEMO_EXISTING_001" className="bg-[#091527] text-cyan-200">
                DEMO_EXISTING_001 · Pre-Existing Mule Syndicate (₹1,50,000 · Goa)
              </option>
              <option value="DEMO_MIXED_001" className="bg-[#091527] text-cyan-200">
                DEMO_MIXED_001 · Cross-Border Relay Network (₹2,75,000 · Punjab)
              </option>
              <option value="DEMO_NEW_001" className="bg-[#091527] text-cyan-200">
                DEMO_NEW_001 · Rapid Zero-Shot Mule Ring (₹2,50,000 · Tamil Nadu)
              </option>
            </select>

            {(isLoading || isSwitching) && (
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin ml-2" />
            )}
          </div>

          {/* Quick Case ML Prediction Tag */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#071324] border border-white/[0.08] font-mono text-[11px]">
            <span className="text-slate-400">ML TARGET:</span>
            <span className="text-emerald-400 font-bold">{prediction.predictedZone}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">CONFIDENCE:</span>
            <span className="text-cyan-300 font-bold">{prediction.confidencePercent}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">MULE:</span>
            <span className="text-amber-300">{activeCase.primaryMule}</span>
          </div>
        </div>

        {/* Right: Authenticated Role / RBAC Domain Indicator & Context Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Active Role Console Badge (RBAC compliant) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] font-mono text-[11px]">
            <span className="text-slate-500 uppercase">OPERATOR:</span>
            <span className="text-white font-bold">{user?.name || (isLEA ? 'Amit Salve' : isBank ? 'Varun Grover' : isI4C ? 'Sunita Deshmukh' : 'Rajesh Varma')}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 uppercase">ROLE:</span>
            {isLEA && (
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                LEA INVESTIGATOR
              </span>
            )}
            {isI4C && (
              <span className="text-red-300 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-red-400" />
                I4C THREAT INTELLIGENCE
              </span>
            )}
            {isBank && (
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                BANK FRAUD DESK
              </span>
            )}
            {isAdmin && (
              <span className="text-purple-300 font-bold flex items-center gap-1">
                <Sliders className="w-3 h-3 text-purple-400" />
                SYSTEM ADMINISTRATOR
              </span>
            )}
          </div>

          {/* New Case Intake Action (Only accessible in LEA console) */}
          {isLEA && (
            <button
              onClick={() => navigate(`/investigation/${activeCase.id}?newCase=true`)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-[10.5px] font-bold tracking-wider uppercase border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] ml-1 cursor-pointer"
              title="Open New Case Intake Form"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>+ INTAKE CASE</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
