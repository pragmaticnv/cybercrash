import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActiveCaseStore } from '../../store/useActiveCaseStore';
import { 
  FolderCheck, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Shield, 
  Radio, 
  Building2, 
  Sliders, 
  Crosshair,
  ArrowRight,
  Plus
} from 'lucide-react';

interface ActiveCaseBannerProps {
  currentPortal?: 'lea' | 'i4c' | 'bank' | 'admin' | string;
}

export const ActiveCaseBanner: React.FC<ActiveCaseBannerProps> = ({ currentPortal }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
              value={selectedDemoKey}
              onChange={(e) => handleSelectDemo(e.target.value)}
              disabled={isLoading || isSwitching}
              className="bg-[#091527] border border-cyan-500/50 text-cyan-200 font-mono text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 cursor-pointer disabled:opacity-50"
            >
              <option value="LIVE_DEMO_001">
                LIVE_DEMO_001 · Investment Scam (₹1,50,000 · Goa · ACC_013041)
              </option>
              <option value="LIVE_DEMO_002">
                LIVE_DEMO_002 · UPI Fraud (₹2,75,000 · Punjab · NEW_MULE_001)
              </option>
              <option value="LIVE_DEMO_003">
                LIVE_DEMO_003 · Marketplace Fraud (₹2,50,000 · Tamil Nadu · NEW_MULE_002)
              </option>
              {selectedDemoKey && !['LIVE_DEMO_001', 'LIVE_DEMO_002', 'LIVE_DEMO_003'].includes(selectedDemoKey) && (
                <option value={selectedDemoKey}>
                  {selectedDemoKey} · {activeCase.type} ({activeCase.amount} · {activeCase.stateCode})
                </option>
              )}
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

        {/* Right: 4 Portal Direct Jump Buttons + Intake Action */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider hidden lg:inline mr-1">
            ALL 4 INTERFACES SYNCED:
          </span>

          {/* Portal 1: LEA Officer */}
          <button
            onClick={() => navigate(currentPath.startsWith('/investigation') ? `/investigation/${activeCase.id}` : '/cases')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all border ${
              isLEA
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/[0.08] hover:border-cyan-500/40'
            }`}
            title="LEA Officer Case Command & Spatial Investigation"
          >
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>LEA OFFICER</span>
          </button>

          {/* Portal 2: I4C National Command */}
          <button
            onClick={() => navigate('/i4c')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all border ${
              isI4C
                ? 'bg-red-500/20 text-red-300 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/[0.08] hover:border-red-500/40'
            }`}
            title="I4C National Cybercrime Intelligence Command Center"
          >
            <Radio className="w-3 h-3 text-red-400" />
            <span>I4C NATIONAL</span>
          </button>

          {/* Portal 3: Banks Security */}
          <button
            onClick={() => navigate('/bank')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all border ${
              isBank
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/[0.08] hover:border-amber-500/40'
            }`}
            title="Bank Security & Fraud Operations Workstation"
          >
            <Building2 className="w-3 h-3 text-amber-400" />
            <span>BANKS</span>
          </button>

          {/* Portal 4: Admin Control */}
          <button
            onClick={() => navigate('/admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all border ${
              isAdmin
                ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/[0.08] hover:border-purple-500/40'
            }`}
            title="Admin Platform Control & Multi-Agency Coordination"
          >
            <Sliders className="w-3 h-3 text-purple-400" />
            <span>ADMIN</span>
          </button>

          {/* New Case Intake Action */}
          <button
            onClick={() => navigate(`/investigation/${activeCase.id}?newCase=true`)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-[10.5px] font-bold tracking-wider uppercase border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] ml-1"
            title="Open New Case Intake Form"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>+ INTAKE CASE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
